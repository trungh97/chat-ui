import { useEffect, useRef, useCallback } from 'react'

export function useInfiniteScroll({
  onLoadMore,
  hasNextPage,
  loading,
}: {
  onLoadMore: () => void
  hasNextPage: boolean
  loading: boolean
}) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (entry.isIntersecting && hasNextPage && !loading) {
        onLoadMore()
      }
    },
    [hasNextPage, loading, onLoadMore],
  )

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    })

    const node = sentinelRef.current
    if (node) observerRef.current.observe(node)

    return () => {
      if (observerRef.current && node) {
        observerRef.current.unobserve(node)
      }
    }
  }, [handleIntersect])

  return { sentinelRef }
}
