import { RefObject, useEffect, useState } from 'react'

/** Distance in px from the bottom that still counts as "at the bottom". */
const BOTTOM_THRESHOLD = 40

/**
 * Tracks whether a scrollable container is scrolled to (or near) the bottom.
 * @param containerRef The scrollable container
 * @param contentKey Changes whenever the content changes (e.g. the message list), so the
 * position is re-checked after the container appears or grows
 * @returns true when the bottom of the content is in view
 */
export function useIsScrolledToBottom(
  containerRef: RefObject<HTMLElement | null>,
  contentKey: unknown,
) {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      setIsScrolledToBottom(
        el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD,
      )
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [containerRef, contentKey])

  return isScrolledToBottom
}
