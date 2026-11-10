import {
  DraftConversation,
  draftConversationKey,
  draftUserIdFromKey,
  useDraftConversationStore,
} from '../draftConversation'

const draft: DraftConversation = {
  userId: 'u2',
  name: 'Ann Lee',
  avatar: null,
  createdAt: '2026-11-08T10:00:00.000Z',
}

const state = () => useDraftConversationStore.getState()

describe('useDraftConversationStore', () => {
  beforeEach(() => {
    useDraftConversationStore.setState({ drafts: {} })
  })

  it('adds a draft keyed by the other user', () => {
    state().addDraft(draft)

    expect(state().drafts).toEqual({ u2: draft })
  })

  it('keeps one draft per user: adding again keeps the first one', () => {
    state().addDraft(draft)
    state().addDraft({ ...draft, createdAt: '2026-11-08T11:00:00.000Z' })

    expect(state().drafts).toEqual({ u2: draft })
  })

  it('removes a draft and ignores an unknown user', () => {
    state().addDraft(draft)
    state().addDraft({ ...draft, userId: 'u3' })

    state().removeDraft('u2')
    state().removeDraft('nobody')

    expect(Object.keys(state().drafts)).toEqual(['u3'])
  })
})

describe('draft keys', () => {
  it('round-trips a user id through the pending-message key', () => {
    expect(draftConversationKey('u2')).toBe('draft:u2')
    expect(draftUserIdFromKey('draft:u2')).toBe('u2')
  })

  it('treats any other id as a real conversation', () => {
    expect(draftUserIdFromKey('c1')).toBeNull()
  })
})
