import { useEffect, useRef } from 'react'

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

export { useInfiniteScrollToTop }
