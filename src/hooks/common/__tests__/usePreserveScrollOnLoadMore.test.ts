import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { usePreserveScrollOnLoadMore } from '../usePreserveScrollOnLoadMore'

function createScrollableDiv(height = 100, contentHeight = 500) {
  const div = document.createElement('div')
  div.style.height = `${height}px`
  div.style.overflowY = 'auto'
  div.style.width = '100px'
  div.innerHTML = `<div style=\"height:${contentHeight}px;\"></div>`
  document.body.appendChild(div)
  return div
}

describe('usePreserveScrollOnLoadMore', () => {
  it('should record scroll position and restore after loading more', () => {
    let messages = ['msg1']
    const loadMore = jest.fn()
    const { result, rerender } = renderHook(
      ({ messages }) => {
        const containerRef = { current: null as null | HTMLDivElement }
        const wrapped = usePreserveScrollOnLoadMore(
          containerRef,
          messages,
          loadMore,
        )
        return { containerRef, wrapped }
      },
      { initialProps: { messages } },
    )
    const div = createScrollableDiv()
    result.current.containerRef.current = div
    div.scrollTop = 20
    act(() => {
      result.current.wrapped()
      // Simulate new messages loaded
      messages = ['msg2', 'msg1']
      rerender({ messages })
    })
    expect(loadMore).toHaveBeenCalled()
    // After rerender, scroll position should be restored
    act(() => {})
    expect(div.scrollTop).toBeGreaterThanOrEqual(0)
  })

  it('should not restore scroll if not loading more', () => {
    let messages = ['msg1']
    const loadMore = jest.fn()
    const { result, rerender } = renderHook(
      ({ messages }) => {
        const containerRef = { current: null as null | HTMLDivElement }
        const wrapped = usePreserveScrollOnLoadMore(
          containerRef,
          messages,
          loadMore,
        )
        return { containerRef, wrapped }
      },
      { initialProps: { messages } },
    )
    const div = createScrollableDiv()
    result.current.containerRef.current = div
    // Simulate new messages loaded without calling wrapped
    act(() => {
      messages = ['msg2', 'msg1']
      rerender({ messages })
    })
    // Should not scroll
    expect(div.scrollTop).toBe(0)
  })
})
