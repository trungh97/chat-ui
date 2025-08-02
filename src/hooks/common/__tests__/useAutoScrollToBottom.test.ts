import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useAutoScrollToBottom } from '../useAutoScrollToBottom'

// Helper to create a div with scrollable content
function createScrollableDiv(height = 100, contentHeight = 500) {
  const div = document.createElement('div')
  div.style.height = `${height}px`
  div.style.overflowY = 'auto'
  div.style.width = '100px'
  div.innerHTML = `<div style="height:${contentHeight}px;"></div>`
  document.body.appendChild(div)
  return div
}

describe('useAutoScrollToBottom', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should not scroll if shouldScroll is false', () => {
    const { result } = renderHook(() => useAutoScrollToBottom(false, []))
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {
      // Simulate effect
    })
    expect(div.scrollTop).toBe(0)
  })

  it('should scroll to bottom if shouldScroll is true', () => {
    const { result, rerender } = renderHook(
      ({ shouldScroll, deps }: { shouldScroll: boolean; deps: number[] }) =>
        useAutoScrollToBottom(shouldScroll, deps),
      {
        initialProps: { shouldScroll: true, deps: [] as any[] },
      },
    )
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {
      // Simulate effect
      rerender({ shouldScroll: true, deps: [1] })
    })
    expect(div.scrollTop).toBe(div.scrollHeight)
  })

  it('should scroll when deps change and shouldScroll is true', () => {
    const { result, rerender } = renderHook(
      ({ shouldScroll, deps }: { shouldScroll: boolean; deps: number[] }) =>
        useAutoScrollToBottom(shouldScroll, deps),
      {
        initialProps: { shouldScroll: true, deps: [0] },
      },
    )
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {
      rerender({ shouldScroll: true, deps: [1] })
    })
    expect(div.scrollTop).toBe(div.scrollHeight)
  })

  it('should scroll to bottom with default deps (no deps argument)', () => {
    const { result } = renderHook(() => useAutoScrollToBottom(true))
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {})
    expect(div.scrollTop).toBe(div.scrollHeight)
  })
})
