import { Message } from '@interfaces/dtos'
import { create } from 'zustand'
import { createSelectors } from './utils'

export interface IMessageListState {
  messagesByConversation: Record<string, Message[]>
  nextCursorByConversation: Record<string, string | null>
  hasNextPageByConversation: Record<string, boolean>
  loadingByConversation: Record<string, boolean>
  errorByConversation: Record<string, Error | undefined>
  lastMessageByConversation: (conversationId: string) => Message | null
  setLoading: (conversationId: string, loading: boolean) => void
  setError: (conversationId: string, error?: Error) => void
  setNextCursor: (conversationId: string, nextCursor?: string | null) => void
  setHasNextPage: (conversationId: string, hasNextPage: boolean) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessagesToTheEnd: (conversationId: string, messages: Message[]) => void
  addMessagesToTheBeginning: (
    conversationId: string,
    messages: Message[],
  ) => void
  updateMessage: (conversationId: string, message: Message) => void
  clearMessages: (conversationId: string) => void
}

const useMessageListStoreBase = create<IMessageListState>()((set, get) => ({
  messagesByConversation: {},
  nextCursorByConversation: {},
  hasNextPageByConversation: {},
  setHasNextPage: (conversationId, hasNextPage) =>
    set((state) => ({
      hasNextPageByConversation: {
        ...state.hasNextPageByConversation,
        [conversationId]: hasNextPage,
      },
    })),
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
   * Adds new messages to the end of the existing list of messages for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation to which the messages belong.
   * @param {Message[]} messages - An array of Message objects to be added to the end of the conversation's message list.
   * @param {boolean} [addToBottom=false] - Whether to add the messages to the bottom (true) or top (false) of the message list.
   */
  addMessagesToTheEnd: (conversationId, messages) =>
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
   * Adds new messages to the beginning of the existing list of messages for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation to which the messages belong.
   * @param {Message[]} messages - An array of Message objects to be added to the beginning of the conversation's message list.
   */
  addMessagesToTheBeginning: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [
          ...messages,
          ...(state.messagesByConversation[conversationId] || []),
        ],
      },
    })),

  /**
   * Updates a specific message in the message list for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation.
   * @param {Message} message - The updated message object.
   */
  updateMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: state.messagesByConversation[conversationId].map(
          (m) => (m.id === message.id ? message : m),
        ),
      },
    })),

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

  /**
   * Returns the last message in the message list for a specific conversation.
   *
   * @param {string} conversationId - The ID of the conversation.
   * @returns {Message | null} The last message in the message list, or null if the message list is empty.
   */
  lastMessageByConversation: (conversationId) =>
    get().messagesByConversation[conversationId].slice(-1)[0] ?? null,
}))

const useMessageListStore = createSelectors(useMessageListStoreBase)

export default useMessageListStore
export { useMessageListStore }
