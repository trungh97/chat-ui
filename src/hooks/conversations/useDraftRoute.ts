import {
  DraftConversation,
  useDraftConversationStore,
} from '@store/draftConversation'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'

/**
 * The draft shown by the `/new/:userId` route.
 *
 * `isMissing` is true only when the draft was already gone when this route opened, which is
 * what happens after a reload (drafts live in memory). A draft removed while its route is
 * open is being replaced by the real conversation, and the route changes right after: the
 * draft removal can render before that navigation, so it must not redirect.
 */
export const useDraftRoute = (): {
  draftUserId?: string
  draft?: DraftConversation
  isMissing: boolean
} => {
  const { userId: draftUserId } = useParams()
  const drafts = useDraftConversationStore.use.drafts()
  const draft = draftUserId ? drafts[draftUserId] : undefined

  const opened = useRef<{ userId?: string; missing: boolean }>({
    missing: false,
  })
  if (opened.current.userId !== draftUserId) {
    opened.current = { userId: draftUserId, missing: !!draftUserId && !draft }
  }

  return { draftUserId, draft, isMissing: opened.current.missing }
}

export default useDraftRoute
