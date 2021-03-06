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

// @flow
import type { Container } from '../../../app/di'
import Vue from 'vue'
import axios from 'axios'
import App from '../../app'
import logger from '../../../app/logger'
import routerFactory from '../../router/factory'
import storeFactory from '../../store/factory'
import mainFactory from '../../store/modules/main'
import identityFactory from '../../store/modules/identity'
import connectionFactory from '../../store/modules/connection'
import errorsFactory from '../../store/modules/errors'
import termsFactory from '../../store/modules/terms'
import TequilapiConnectionEstablisher from '../../../app/connection/tequilapi-connection-establisher'

function bootstrap (container: Container) {
  container.service(
    'connectionEstablisher',
    ['tequilapiClient', 'eventSender', 'bugReporter'],
    (tequilapiClient, eventSender, bugReporter) => {
      return new TequilapiConnectionEstablisher(tequilapiClient, eventSender, bugReporter)
    }
  )
  container.service(
    'vue-application',
    ['bugReporter'],
    (bugReporter) => {
      if (!process.env.IS_WEB) {
        Vue.use(require('vue-electron'))
      }
      Vue.http = Vue.prototype.$http = axios
      Vue.config.productionTip = false
      Vue.config.errorHandler = (err) => {
        logger.error('Unhandled error:', err)
        bugReporter.captureErrorException(err)
      }

      return new Vue({
        components: { App },
        router: container.get('vue-router'),
        store: container.get('vue-store'),
        template: '<App/>',
        el: '#app'
      })
    }
  )

  container.service(
    'vue-router',
    ['vue-store'],
    (store) => {
      return routerFactory(store)
    }
  )

  container.service(
    'vue-store',
    [
      'vue-store.main',
      'vue-store.identity',
      'vue-store.connection',
      'vue-store.errors',
      'vue-store.terms'
    ],
    (main, identity, connection, errors, terms) => {
      return storeFactory({
        main,
        identity,
        connection,
        errors,
        terms
      })
    }
  )
  container.service(
    'vue-store.main',
    ['tequilapiClient'],
    (tequilapiClient) => mainFactory(tequilapiClient)
  )
  container.service(
    'vue-store.identity',
    ['bugReporter', 'rendererCommunication'],
    (bugReporter, rendererCommunication) => identityFactory(bugReporter, rendererCommunication)
  )
  container.service(
    'vue-store.connection',
    ['tequilapiClient', 'rendererCommunication', 'bugReporter', 'connectionEstablisher'],
    (tequilapiClient, rendererCommunication, bugReporter, connectionEstablisher) => {
      return connectionFactory(tequilapiClient, rendererCommunication, bugReporter, connectionEstablisher)
    }
  )
  container.constant('vue-store.errors', errorsFactory())
  container.constant('vue-store.terms', termsFactory())
}

export default bootstrap
