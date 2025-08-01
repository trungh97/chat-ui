import { useRef, useEffect } from 'react'
import { useAutoScrollToBottom } from '@hooks/common'

type useChatScrollManagementProps = {
  conversationId: string
  messages: any[]
  hasNextPage: boolean
  loading: boolean
  loadMore: () => void
}

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

/**
 * Preserves scroll position when loading more messages at the top of the chat.
 * Wraps loadMore to record scroll position before loading, and restores after new messages are prepended.
 * @param containerRef Ref to the scrollable chat container
 * @param messages The message list for the conversation
 * @param loadMore Function to load more messages
 * @returns wrappedLoadMore function
 */
function usePreserveScrollOnLoadMore(
  containerRef: React.RefObject<HTMLDivElement>,
  messages: any[],
  loadMore: () => void,
) {
  const prevScrollHeightRef = useRef<number>(0)
  const prevScrollTopRef = useRef<number>(0)
  const loadingMoreRef = useRef(false)

  const preserveScrollPosition = () => {
    const el = containerRef.current
    if (el) {
      // Record scroll position before loading more
      prevScrollHeightRef.current = el.scrollHeight
      prevScrollTopRef.current = el.scrollTop
      loadingMoreRef.current = true
    }
  }

  const restoreScrollPosition = () => {
    const el = containerRef.current
    if (el && loadingMoreRef.current) {
      const newScrollHeight = el.scrollHeight
      el.scrollTop =
        newScrollHeight - prevScrollHeightRef.current + prevScrollTopRef.current
      loadingMoreRef.current = false
    }
  }

  /**
   * Call this instead of loadMore to preserve scroll position.
   */
  const preserveScrollPositionAndLoadingMore = () => {
    preserveScrollPosition()
    loadMore()
  }

  useEffect(() => {
    // Restore scroll position after loading more messages
    restoreScrollPosition()
  }, [messages])

  return preserveScrollPositionAndLoadingMore
}

/**
 * Triggers loadMore when user scrolls to the top of the chat container (infinite scroll).
 * @param containerRef Ref to the scrollable chat container
 * @param onLoadMore Function to call when top is reached
 * @param hasNextPage Whether there are more messages to load
 * @param loading Loading state for messages
 * @returns sentinelRef (for compatibility, not used)
 */
function useInfiniteScrollToTop(
  containerRef: React.RefObject<HTMLDivElement>,
  onLoadMore: () => void,
  hasNextPage: boolean,
  loading: boolean,
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    /**
     * Scroll event handler: triggers loadMore when scrolled to top.
     */
    function handleScroll() {
      if (!hasNextPage || loading || !el) return
      if (el.scrollTop === 0) {
        onLoadMore()
      }
    }

    el.addEventListener('scroll', handleScroll)
    return () => {
      el.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, hasNextPage, loading, onLoadMore])

  return sentinelRef
}

/**
 * Centralized chat scroll management hook for chat windows.
 * Composes initial auto-scroll, scroll position preservation, and infinite scroll-to-top.
 * @param conversationId The current conversation id
 * @param messages The message list for the conversation
 * @param hasNextPage Whether there are more messages to load
 * @param loading Loading state for messages
 * @param loadMore Function to load more messages
 * @returns { containerRef, sentinelRef }
 */
export function useChatScrollManagement({
  conversationId,
  messages,
  hasNextPage,
  loading,
  loadMore,
}: useChatScrollManagementProps) {
  // 1. Initial auto-scroll to bottom
  const containerRef = useInitialAutoScroll(conversationId, messages)

  // 2. Preserve scroll position when loading more
  const preserveScrollPositionAndLoadingMore = usePreserveScrollOnLoadMore(
    containerRef,
    messages,
    loadMore,
  )

  // 3. Infinite scroll to top
  const sentinelRef = useInfiniteScrollToTop(
    containerRef,
    preserveScrollPositionAndLoadingMore,
    hasNextPage,
    loading,
  )
  return { containerRef, sentinelRef }
}
