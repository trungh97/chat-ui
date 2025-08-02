import { useRef, useEffect } from 'react'
import { useAutoScrollToBottom } from './useAutoScrollToBottom'

/**
 * Handles auto-scroll to bottom of chat container on initial load or when conversation changes.
 * @param conversationId The current conversation id
 * @param messages The message list for the conversation
 * @returns containerRef to attach to the scrollable chat container
 */
function useInitialAutoScroll(conversationId: string, messages: any[]) {
  const isFirstLoadRef = useRef(true)
  const prevConversationIdRef = useRef<string | undefined>()
  const containerRef = useAutoScrollToBottom(isFirstLoadRef.current, [
    conversationId,
    messages,
  ])

  useEffect(() => {
    // Reset scroll on conversation change, only auto-scroll on first load
    if (prevConversationIdRef.current !== conversationId) {
      isFirstLoadRef.current = true
      prevConversationIdRef.current = conversationId
    } else if (messages && messages.length > 0) {
      isFirstLoadRef.current = false
    }
  }, [conversationId, messages])

  return containerRef
}

export { useInitialAutoScroll }
