import { useEffect, useRef } from 'react'

/**
 * Hook to auto-scroll to the bottom of a container when dependencies change.
 * 
 * @param shouldScroll Whether to enable auto-scrolling
 * @param deps Dependency array to trigger scroll (e.g. messages, conversationId)
 * @returns ref to attach to the scrollable container
 */
export function useAutoScrollToBottom(
  shouldScroll?: boolean,
  deps: any[] = [],
) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el && shouldScroll) {
      el.scrollTop = el.scrollHeight
    }
  }, deps)

  return containerRef
}
