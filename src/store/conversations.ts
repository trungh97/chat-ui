import { create } from 'zustand'
import { Conversation } from '../types'
import { createSelectors } from './utils'

// Define the shape of the store
interface ConversationGlobalState {
  conversations: Conversation[]
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  removeConversation: (conversationId: string) => void
  updateConversation: (updatedConversation: Conversation) => void
}

const useConversationListStoreBase = create<ConversationGlobalState>()(
  (set) => ({
    conversations: [],
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

// This is a custom hook that allows you to access the store's state and actions
const useConversationListStore = createSelectors(useConversationListStoreBase)

export default useConversationListStore

export { useConversationListStore }
