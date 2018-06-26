/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
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

import { beforeEach, describe, expect, it } from '../../../helpers/dependencies'
import MainMessageBusCommunication from '../../../../src/app/communication/main-message-bus-communication'
import type { MessageBus } from '../../../../src/app/communication/messageBus'
import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import { CallbackRecorder } from '../../../helpers/utils'
import type { MainCommunication } from '../../../../src/app/communication/main-communication'
import ProposalDTO from '../../../../src/libraries/mysterium-tequilapi/dto/proposal'

class DirectMessageBus implements MessageBus {
  _subscribers: { [string]: (data?: mixed) => void } = new Map()

  send (channel: string, data?: mixed): void {
    if (this._subscribers[channel]) {
      this._subscribers[channel](data)
    }
  }

  on (channel: string, callback: (data?: mixed) => void): void {
    this._subscribers[channel] = callback
  }
}

describe('MainMessageBusCommunication', () => {
  let messageBus: MessageBus
  let mainCommunication: MainCommunication
  let rendererCommunication: RendererCommunication
  let recorder: CallbackRecorder

  beforeEach(() => {
    messageBus = new DirectMessageBus()
    mainCommunication = new MainMessageBusCommunication(messageBus)
    rendererCommunication = new RendererCommunication(messageBus)
    recorder = new CallbackRecorder()
  })

  describe('sendRendererShowErrorMessage', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onShowRendererError(recorder.getCallback())
      mainCommunication.sendRendererShowErrorMessage('test error')
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql({
        message: 'test error',
        hint: '',
        fatal: true
      })
    })
  })

  describe('sendRendererShowError', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onShowRendererError(recorder.getCallback())
      const errorDto = {fatal: false, hint: 'test hint', message: 'test message'}
      mainCommunication.sendRendererShowError(errorDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(errorDto)
    })
  })

  describe('sendMysteriumClientIsReady', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onMysteriumClientIsReady(recorder.getCallback())
      mainCommunication.sendMysteriumClientIsReady()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendMysteriumClientLog ', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onMysteriumClientLog(recorder.getCallback())
      const logDto = {data: 'test data', level: 'test level'}
      mainCommunication.sendMysteriumClientLog(logDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(logDto)
    })
  })

  describe('sendMysteriumClientLog ', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onMysteriumClientLog(recorder.getCallback())
      const logDto = {data: 'test data', level: 'test level'}
      mainCommunication.sendMysteriumClientLog(logDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(logDto)
    })
  })

  describe('sendMysteriumClientUp', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onMysteriumClientUp(recorder.getCallback())
      mainCommunication.sendMysteriumClientUp()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendMysteriumClientDown', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onMysteriumClientDown(recorder.getCallback())
      mainCommunication.sendMysteriumClientDown()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendProposals', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onProposalUpdate(recorder.getCallback())
      const proposalsDto = [
        new ProposalDTO({id: 1, providerId: 'test provider id', serviceType: 'test service type'})
      ]
      mainCommunication.sendProposals(proposalsDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(proposalsDto)
    })
  })

  describe('sendConnectionCancelRequest', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onDisconnectionRequest(recorder.getCallback())
      mainCommunication.sendConnectionCancelRequest()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendConnectionRequest', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onConnectionRequest(recorder.getCallback())
      const requestDto = { providerId: 'test provider id' }
      mainCommunication.sendConnectionRequest(requestDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(requestDto)
    })
  })

  describe('sendTermsRequest', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onTermsRequest(recorder.getCallback())
      const termsDto = { htmlContent: 'test html' }
      mainCommunication.sendTermsRequest(termsDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(termsDto)
    })
  })

  describe('sendTermsAccepted', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onTermsAccepted(recorder.getCallback())
      mainCommunication.sendTermsAccepted()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendUserSettings', () => {
    it('sends message through message bus', () => {
      rendererCommunication.onUserSettings(recorder.getCallback())
      const settingsDto = { showDisconnectNotifications: true }
      mainCommunication.sendUserSettings(settingsDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(settingsDto)
    })
  })
})