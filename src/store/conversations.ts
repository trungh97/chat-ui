import { Conversation } from '@interfaces/dtos'
import { create } from 'zustand'
import { createSelectors } from './utils'

// Define the shape of the store
export interface ConversationGlobalState {
  conversations: Conversation[]
  nextCursor?: string | null
  loading: boolean
  error?: Error
  activeConversation: string | null
  setActiveConversation: (conversationId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | undefined) => void
  setNextCursor: (nextCursor?: string | null) => void
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  removeConversation: (conversationId: string) => void
  updateConversation: (updatedConversation: Conversation) => void
}

const useConversationListStoreBase = create<ConversationGlobalState>()(
  (set) => ({
    conversations: [],
    loading: false,
    error: undefined,
    nextCursor: undefined,
    activeConversation: null,
    setActiveConversation: (conversationId: string) =>
      set({ activeConversation: conversationId }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: Error | undefined) => set({ error }),
    setNextCursor: (nextCursor?: string | null) => set({ nextCursor }),
    setConversations: (conversations: Conversation[]) => set({ conversations }),
    addConversation: (conversation: Conversation) =>
      set((state: ConversationGlobalState) => ({
        conversations: [...state.conversations, conversation],
      })),
    removeConversation: (conversationId: string) =>
      set((state: ConversationGlobalState) => ({
        conversations: state.conversations.filter(
          (conversation) => conversation.id !== conversationId,
        ),
      })),
    updateConversation: (updatedConversation: Conversation) =>
      set((state: ConversationGlobalState) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === updatedConversation.id
            ? updatedConversation
            : conversation,
        ),
      })),
  }),
)

useConversationListStoreBase.subscribe((state) => {
  const activeConversation = state.activeConversation
  if (activeConversation) {
    const conversation = state.conversations.find(
      (conversation) => conversation.id === activeConversation,
    )
    if (conversation && conversation.id) {
      document.title = conversation.title
    }
  }
})

// This is a custom hook that allows you to access the store's state and actions
const useConversationListStore = createSelectors(useConversationListStoreBase)

export default useConversationListStore

export { useConversationListStore }
