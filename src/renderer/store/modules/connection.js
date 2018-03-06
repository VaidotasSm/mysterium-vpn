import type from '../types'
import tequilAPI from '../../../libraries/tequilapi'
import {isTimeoutError} from '../../../libraries/errors'
import config from '../../config'
// TODO tequilAPI should be passed via DI
const tequilapi = tequilAPI()

let updaterTimeout

const defaultStatistics = {
}

const IP_TIMEOUTS_ALLOWED = 2

const state = {
  ip: null,
  ipTimeoutsCount: 0,
  status: 'NotConnected',
  statistics: defaultStatistics
}

const getters = {
  status: state => state.status,
  connection: state => state,
  ip: state => state.ip
}

const mutations = {
  [type.CONNECTION_STATUS] (state, status) {
    state.status = status
  },
  [type.CONNECTION_STATISTICS] (state, statistics) {
    state.statistics = statistics
  },
  [type.CONNECTION_IP] (state, ip) {
    state.ip = ip
  },
  [type.CONNECTION_STATISTICS_RESET] (state) {
    state.statistics = defaultStatistics
  },
  [type.INCREASE_IP_TIMEOUT_COUNTER] (state) {
    state.ipTimeoutsCount++
  },
  [type.RESET_TIMEOUT_COUNTER] (state) {
    state.ipTimeoutsCount = 0
  }
}

const actions = {
  async [type.STATUS_UPDATER_RUN] ({dispatch}) {
    await dispatch(type.CONNECTION_STATUS_ALL)
    updaterTimeout = setTimeout(() => {
      dispatch(type.STATUS_UPDATER_RUN)
    }, config.statusUpdateTimeout)
  },
  async [type.CONNECTION_IP] ({commit, state}) {
    try {
      const ip = await tequilapi.connection.ip()
      commit(type.CONNECTION_IP, ip)
      commit('RESET_TIMEOUT_COUNTER')
    } catch (err) {
      if (isTimeoutError(err)) {
        if (state.ipTimeoutsCount >= IP_TIMEOUTS_ALLOWED) {
          commit(type.REQUEST_FAIL, err)
        }
        commit('INCREASE_IP_TIMEOUT_COUNTER')
      } else {
        commit(type.REQUEST_FAIL, err)
      }
    }
  },
  async [type.CONNECTION_STATUS_ALL] ({commit, dispatch}) {
    const statusPromise = dispatch(type.CONNECTION_STATUS)
    const statisticsPromise = dispatch(type.CONNECTION_STATISTICS)
    const ipPromise = dispatch(type.CONNECTION_IP)

    await statusPromise
    await statisticsPromise
    await ipPromise
  },
  async [type.CONNECTION_STATUS] ({commit}) {
    try {
      const res = await tequilapi.connection.status()
      commit(type.CONNECTION_STATUS, res.status)
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
    }
  },
  async [type.CONNECTION_STATISTICS] ({commit}) {
    try {
      const statistics = await tequilapi.connection.statistics()
      commit(type.CONNECTION_STATISTICS, statistics)
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
    }
  },
  async [type.CONNECT] ({commit, dispatch}, consumerId, providerId) {
    try {
      commit(type.CONNECTION_STATUS, type.tequilapi.CONNECTING)
      commit(type.CONNECTION_STATISTICS_RESET)
      await tequilapi.connection.connect(consumerId, providerId)
      commit(type.HIDE_REQ_ERR)
      // if we ask openvpn right away status stil in not connected state
      updaterTimeout = setTimeout(() => {
        dispatch(type.STATUS_UPDATER_RUN)
      }, 1000)
    } catch (err) {
      let error = new Error('Connection to node failed. Try other one')
      error.original = err
      commit(type.REQUEST_FAIL, error)
      throw (error)
    }
  },
  async [type.DISCONNECT] ({commit, dispatch}) {
    try {
      clearTimeout(updaterTimeout)
      let res = tequilapi.connection.disconnect()
      commit(type.CONNECTION_STATUS, type.tequilapi.DISCONNECTING)
      res = await res
      dispatch(type.CONNECTION_STATUS)
      dispatch(type.CONNECTION_IP)
      return res
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw (err)
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
