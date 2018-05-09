// @flow
import os from 'os'
import {logLevel} from '../libraries/mysterium-client/index'
import {getLogCache} from '../app/bugReporting/logsCache'

import type {Container} from '../app/di'

function bootstrap (container: Container) {
  container.service(
    'bugReporter.config',
    ['mysterionReleaseID'],
    (mysterionReleaseID) => {
      return {
        captureUnhandledRejections: true,
        release: mysterionReleaseID,
        tags: {
          environment: process.env.NODE_ENV,
          process: process.type,
          electron: process.versions.electron,
          chrome: process.versions.chrome,
          platform: os.platform(),
          platform_release: os.release()
        },
        dataCallback: (data) => {
          const stderr = getLogCache(logLevel.ERROR)
          const stdout = getLogCache(logLevel.LOG)
          data.extra.logs = {
            [logLevel.LOG]: stdout,
            [logLevel.ERROR]: stderr
          }
          return data
        },
        autoBreadcrumbs: {
          console: true
        }
      }
    }
  )
}

export default bootstrap
