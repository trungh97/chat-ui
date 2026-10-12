import { useUpdateLastSeenMessageMutation } from '@generated/graphql'
import { isPointerAtOrAfter, StatusParticipant } from '@helpers/messageStatus'
import { useEffect, useRef, useState } from 'react'

/** Wait this long after the conditions are met, so quick scrolling or tab switching is ignored. */
export const MARK_SEEN_DELAY_MS = 500

const isPageActive = () =>
  document.visibilityState === 'visible' && document.hasFocus()

type UseMarkConversationSeenProps = {
  conversationId?: string
  /** The newest saved message in the conversation sent by someone else. */
  latestIncomingMessage?: { id: string; createdAt: string }
  /** The current user's participant in the conversation. */
  myParticipant?: StatusParticipant
  /** Whether the bottom of the message list is in view. */
  isScrolledToBottom: boolean
}

/**
 * Marks the latest incoming message as seen when the user can actually see it: the tab is
 * visible and focused, and the bottom of the message list is in view.
 */
export function useMarkConversationSeen({
  conversationId,
  latestIncomingMessage,
  myParticipant,
  isScrolledToBottom,
}: UseMarkConversationSeenProps) {
  const [updateLastSeenMessage] = useUpdateLastSeenMessageMutation()
  const [isActive, setIsActive] = useState(isPageActive)
  // The message last sent to the server, so it is not re-sent while the seen update is in flight.
  const requestedMessageIdRef = useRef<string | null>(null)

  useEffect(() => {
    const update = () => setIsActive(isPageActive())

    window.addEventListener('focus', update)
    window.addEventListener('blur', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.removeEventListener('focus', update)
      window.removeEventListener('blur', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const messageId = latestIncomingMessage?.id
  const alreadySeen =
    !!latestIncomingMessage &&
    isPointerAtOrAfter(
      myParticipant?.lastSeenMessageId,
      myParticipant?.lastSeenMessageAt,
      latestIncomingMessage,
    )

  useEffect(() => {
    if (
      !conversationId ||
      !messageId ||
      alreadySeen ||
      !isActive ||
      !isScrolledToBottom ||
      requestedMessageIdRef.current === messageId
    ) {
      return
    }

    const timer = setTimeout(() => {
      requestedMessageIdRef.current = messageId
      updateLastSeenMessage({
        variables: { conversationId, messageId },
      }).catch(() => {
        // Allow another attempt the next time the conditions are met
        requestedMessageIdRef.current = null
      })
    }, MARK_SEEN_DELAY_MS)

    return () => clearTimeout(timer)
  }, [
    conversationId,
    messageId,
    alreadySeen,
    isActive,
    isScrolledToBottom,
    updateLastSeenMessage,
  ])
}
