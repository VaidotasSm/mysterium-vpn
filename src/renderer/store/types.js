/*
 * Copyright (C) 2017 The "mysteriumnetwork/mysterium-vpn" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export default {
  // Mutations
  SHOW_ERROR: 'SHOW_ERROR',
  SHOW_ERROR_MESSAGE: 'SHOW_ERROR_MESSAGE',

  INIT_SUCCESS: 'INIT_SUCCESS',
  INIT_PENDING: 'INIT_PENDING',
  INIT_FAIL: 'INIT_FAIL',

  SET_CURRENT_IDENTITY: 'SET_CURRENT_IDENTITY',

  LOG_INFO: 'LOG_INFO',
  LOG_ERROR: 'LOG_ERROR',
  HEALTHCHECK_SUCCESS: 'HEALTHCHECK_SUCCESS',

  MYST_PROCESS_RUNNING: 'MYST_PROCESS_RUNNING',

  IDENTITY_UNLOCK_SUCCESS: 'IDENTITY_UNLOCK_SUCCESS',
  IDENTITY_UNLOCK_PENDING: 'IDENTITY_UNLOCK_PENDING',
  IDENTITY_UNLOCK_FAIL: 'IDENTITY_UNLOCK_FAIL',

  HIDE_ERROR: 'HIDE_ERROR',

  CONNECTION_STATISTICS_RESET: 'CONNECTION_STATISTICS_RESET',

  SET_ACTION_LOOPER: 'SET_ACTION_LOOPER',
  REMOVE_ACTION_LOOPER: 'REMOVE_ACTION_LOOPER',

  SET_LAST_CONNECTION_PROVIDER: 'SET_LAST_CONNECTION_PROVIDER',

  // Mutation + action
  CLIENT_VERSION: 'CLIENT_VERSION',
  CONNECTION_STATISTICS: 'CONNECTION_STATISTICS',
  CONNECTION_IP: 'CONNECTION_IP',
  LOCATION: 'LOCATION',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',

  // Actions
  FETCH_CONNECTION_STATUS: 'FETCH_CONNECTION_STATUS',

  CONNECT: 'CONNECT',
  DISCONNECT: 'DISCONNECT',
  RECONNECT: 'RECONNECT',

  START_ACTION_LOOPING: 'START_ACTION_LOOPING',
  STOP_ACTION_LOOPING: 'STOP_ACTION_LOOPING',

  SET_NAV_OPEN: 'SET_NAV',
  SET_NAV_VISIBLE: 'SET_NAV_VISIBLE',
  SET_VISUAL: 'SET_VISUAL',

  OVERLAY_ERROR: 'OVERLAY_ERROR',
  ERROR_IN_RENDERER: 'ERROR_IN_RENDERER',

  TERMS: 'TERMS'
}
