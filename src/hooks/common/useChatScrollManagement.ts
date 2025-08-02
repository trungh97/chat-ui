import { useInfiniteScrollToTop } from './useInfiniteScrollToTop'
import { useInitialAutoScroll } from './useInitialAutoScroll'
import { usePreserveScrollOnLoadMore } from './usePreserveScrollOnLoadMore'

type useChatScrollManagementProps = {
  conversationId: string
  messages: any[]
  hasNextPage: boolean
  loading: boolean
  loadMore: () => void
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
