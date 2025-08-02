import { useEffect, useRef } from 'react'

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

export { usePreserveScrollOnLoadMore }

