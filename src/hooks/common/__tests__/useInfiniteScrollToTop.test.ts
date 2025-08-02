import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useInfiniteScrollToTop } from '../useInfiniteScrollToTop'

describe('useInfiniteScrollToTop', () => {
  function createScrollableDiv({ scrollTop = 10 } = {}) {
    const div = document.createElement('div')
    div.style.height = '100px'
    div.style.overflowY = 'auto'
    div.style.width = '100px'
    div.scrollTop = scrollTop
    document.body.appendChild(div)
    return div
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('calls onLoadMore when scrolled to top and hasNextPage is true and not loading', () => {
    const onLoadMore = jest.fn()
    const div = createScrollableDiv({ scrollTop: 10 })
    const containerRef = { current: div as HTMLDivElement }
    renderHook(() =>
      useInfiniteScrollToTop(containerRef, onLoadMore, true, false),
    )
    // Simulate scroll to top
    act(() => {
      div.scrollTop = 0
      div.dispatchEvent(new Event('scroll'))
    })
    expect(onLoadMore).toHaveBeenCalled()
  })

  it('does not call onLoadMore if hasNextPage is false', () => {
    const onLoadMore = jest.fn()
    const div = createScrollableDiv({ scrollTop: 0 })
    const containerRef = { current: div as HTMLDivElement }
    renderHook(() =>
      useInfiniteScrollToTop(containerRef, onLoadMore, false, false),
    )
    act(() => {
      div.dispatchEvent(new Event('scroll'))
    })
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('does not call onLoadMore if loading is true', () => {
    const onLoadMore = jest.fn()
    const containerRef = { current: null as null | HTMLDivElement }
    renderHook(() =>
      useInfiniteScrollToTop(containerRef, onLoadMore, true, true),
    )
    const div = createScrollableDiv({ scrollTop: 0 })
    containerRef.current = div
    act(() => {
      div.dispatchEvent(new Event('scroll'))
    })
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('does not call onLoadMore if not scrolled to top', () => {
    const onLoadMore = jest.fn()
    const div = createScrollableDiv({ scrollTop: 50 })
    const containerRef = { current: div as HTMLDivElement }
    renderHook(() =>
      useInfiniteScrollToTop(containerRef, onLoadMore, true, false),
    )
    act(() => {
      div.dispatchEvent(new Event('scroll'))
    })
    expect(onLoadMore).not.toHaveBeenCalled()
  })
})
