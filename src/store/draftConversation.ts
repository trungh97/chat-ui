import { create } from 'zustand'
import { createSelectors } from './utils'

/**
 * A 1:1 conversation the current user opened from the contact list but hasn't sent a message
 * in yet. It is client-only and in memory, so it disappears on reload. The first message
 * creates the real conversation on the server and removes the draft.
 */
export type DraftConversation = {
  /** The other user, which is also the draft's key. */
  userId: string
  name: string
  avatar: string | null
  createdAt: string
}

export interface DraftConversationState {
  /** Keyed by the other user's id: one draft per user. */
  drafts: Record<string, DraftConversation>
  /** Adds a draft, or keeps the existing one for that user. */
  addDraft: (draft: DraftConversation) => void
  removeDraft: (userId: string) => void
}

/** The `conversationId` of pending messages sent from a draft. */
export const draftConversationKey = (userId: string) => `draft:${userId}`

/** The recipient of a draft key, or `null` when the id is a real conversation id. */
export const draftUserIdFromKey = (conversationId: string): string | null =>
  conversationId.startsWith('draft:')
    ? conversationId.slice('draft:'.length)
    : null

const useDraftConversationStoreBase = create<DraftConversationState>((set) => ({
  drafts: {},
  addDraft: (draft) =>
    set((state) =>
      state.drafts[draft.userId]
        ? {}
        : { drafts: { ...state.drafts, [draft.userId]: draft } },
    ),
  removeDraft: (userId) =>
    set((state) => {
      if (!(userId in state.drafts)) return {}

      const drafts = { ...state.drafts }
      delete drafts[userId]
      return { drafts }
    }),
}))

const useDraftConversationStore = createSelectors(useDraftConversationStoreBase)

export default useDraftConversationStore
export { useDraftConversationStore }
