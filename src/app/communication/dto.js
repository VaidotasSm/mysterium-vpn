// @flow
import type {ConnectionStatus} from '../../libraries/mysterium-tequilapi/dto/connection-status-enum'
import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'

export type ConnectionStatusChangeDTO = {
  oldStatus: ConnectionStatus,
  newStatus: ConnectionStatus
}

export type MysteriumClientLogDTO = {
  level: string,
  data: mixed
}

export type CurrentIdentityChangeDTO = {
  id: string
}

export type ProposalUpdateDTO = Array<ProposalDTO>

export type RequestConnectionDTO = {
  providerId: string
}

export type RequestTermsDTO = {
  htmlContent: string
}

export type TermsAnsweredDTO = {
  isAccepted: boolean
}

export type AppErrorDTO = {
  message: string,
  hint: string,
  fatal: boolean
}

export type HealthCheckDTO = {
  isRunning: boolean
}
