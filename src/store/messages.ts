import { Message } from '@interfaces/dtos'
import { create } from 'zustand'
import { createSelectors } from './utils'

export interface IMessageListState {
  messagesByConversation: Record<string, Message[]>
  nextCursorByConversation: Record<string, string | null>
  loadingByConversation: Record<string, boolean>
  errorByConversation: Record<string, Error | undefined>
  setLoading: (conversationId: string, loading: boolean) => void
  setError: (conversationId: string, error?: Error) => void
  setNextCursor: (conversationId: string, nextCursor?: string | null) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessages: (conversationId: string, messages: Message[]) => void
  clearMessages: (conversationId: string) => void
}

const useMessageListStoreBase = create<IMessageListState>()((set) => ({
  messagesByConversation: {},
  nextCursorByConversation: {},
  loadingByConversation: {},
  errorByConversation: {},

  /**
   * Sets the loading state for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation.
   * @param {boolean} loading - The loading state to set.
   */
  setLoading: (conversationId, loading) =>
    set((state) => ({
      loadingByConversation: {
        ...state.loadingByConversation,
        [conversationId]: loading,
      },
    })),

  /**
   * Updates the error value for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation.
   * @param {Error} [error] - The error to set. If `undefined`, the error will be cleared.
   * @returns {void}
   */
  setError: (conversationId, error) =>
    set((state) => ({
      errorByConversation: {
        ...state.errorByConversation,
        [conversationId]: error,
      },
    })),

  /**
   * Updates the next cursor value for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation.
   * @param {string | null | undefined} nextCursor - The new value for nextCursor.
   * If left undefined, the existing value will be set to null.
   */
  setNextCursor: (conversationId, nextCursor) =>
    set((state) => ({
      nextCursorByConversation: {
        ...state.nextCursorByConversation,
        [conversationId]: nextCursor ?? null,
      },
    })),

  /**
   * Replaces the existing list of messages for a specific conversation
   * with the given array of messages.
   *
   * @param {string} conversationId - The ID of the conversation.
   * @param {Message[]} messages - The new list of messages.
   */
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  /**
   * Adds new messages to the existing list of messages for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation to which the messages belong.
   * @param {Message[]} messages - An array of Message objects to be added to the conversation's message list.
   */
  addMessages: (conversationId, messages) =>
    set((state) => {
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [
            ...(state.messagesByConversation[conversationId] || []),
            ...messages,
          ],
        },
      }
    }),

  /**
   * Clears all messages, errors, and pagination state for a specific conversation.
   * This method is useful when a conversation is deleted or its messages are purged.
   *
   * @param {string} conversationId - The ID of the conversation whose messages should be cleared.
   */
  clearMessages: (conversationId) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [],
      },
      nextCursorByConversation: {
        ...state.nextCursorByConversation,
        [conversationId]: null,
      },
      errorByConversation: {
        ...state.errorByConversation,
        [conversationId]: undefined,
      },
      loadingByConversation: {
        ...state.loadingByConversation,
        [conversationId]: false,
      },
    })),
}))

const useMessageListStore = createSelectors(useMessageListStoreBase)

export default useMessageListStore
export { useMessageListStore }

