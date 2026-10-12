import { PendingMessage, usePendingMessageStore } from '../pendingMessage'

const pending: PendingMessage = {
  clientMessageId: 'client-1',
  conversationId: 'c1',
  content: 'hello',
  createdAt: '2026-10-01T10:00:00.000Z',
  status: 'SENDING',
}

const state = () => usePendingMessageStore.getState()

describe('usePendingMessageStore', () => {
  beforeEach(() => {
    usePendingMessageStore.setState({ pendingMessages: {} })
  })

  it('adds a pending message keyed by client message id', () => {
    state().addPendingMessage(pending)
    expect(state().pendingMessages).toEqual({ 'client-1': pending })
  })

  it('marks a pending message as failed and back to sending, keeping its content', () => {
    state().addPendingMessage(pending)

    state().setPendingMessageStatus('client-1', 'ERROR')
    expect(state().pendingMessages['client-1']).toEqual({
      ...pending,
      status: 'ERROR',
    })

    state().setPendingMessageStatus('client-1', 'SENDING')
    expect(state().pendingMessages['client-1'].status).toBe('SENDING')
  })

  it('ignores status updates for unknown messages', () => {
    const before = state().pendingMessages
    state().setPendingMessageStatus('missing', 'ERROR')
    expect(state().pendingMessages).toBe(before)
  })

  it('removes a pending message', () => {
    state().addPendingMessage(pending)
    state().removePendingMessage('client-1')
    expect(state().pendingMessages).toEqual({})
  })
})
