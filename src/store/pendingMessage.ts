import { create } from 'zustand'
import { createSelectors } from './utils'

/**
 * A message the current user submitted that the server has not saved yet. It is client-only
 * state: once saved, the message lives in the Apollo cache and this entry is removed.
 * - `SENDING`: the create mutation is in flight.
 * - `ERROR`: the mutation failed; the content is kept so it can be retried.
 */
export type PendingMessage = {
  clientMessageId: string
  conversationId: string
  content: string
  createdAt: string
  status: 'SENDING' | 'ERROR'
}

export interface PendingMessageState {
  /** Keyed by `clientMessageId`. */
  pendingMessages: Record<string, PendingMessage>
  addPendingMessage: (message: PendingMessage) => void
  setPendingMessageStatus: (
    clientMessageId: string,
    status: PendingMessage['status'],
  ) => void
  removePendingMessage: (clientMessageId: string) => void
}

const usePendingMessageStoreBase = create<PendingMessageState>((set) => ({
  pendingMessages: {},
  addPendingMessage: (message) =>
    set((state) => ({
      pendingMessages: {
        ...state.pendingMessages,
        [message.clientMessageId]: message,
      },
    })),
  setPendingMessageStatus: (clientMessageId, status) =>
    set((state) => {
      const message = state.pendingMessages[clientMessageId]
      if (!message) return {}

      return {
        pendingMessages: {
          ...state.pendingMessages,
          [clientMessageId]: { ...message, status },
        },
      }
    }),
  removePendingMessage: (clientMessageId) =>
    set((state) => {
      if (!(clientMessageId in state.pendingMessages)) return {}

      const pendingMessages = { ...state.pendingMessages }
      delete pendingMessages[clientMessageId]
      return { pendingMessages }
    }),
}))

const usePendingMessageStore = createSelectors(usePendingMessageStoreBase)

export default usePendingMessageStore
export { usePendingMessageStore }
