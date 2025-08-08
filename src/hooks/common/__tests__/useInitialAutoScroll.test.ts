import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useInitialAutoScroll } from '../useInitialAutoScroll'

function createScrollableDiv(height = 100, contentHeight = 500) {
  const div = document.createElement('div')
  div.style.height = `${height}px`
  div.style.overflowY = 'auto'
  div.style.width = '100px'
  div.innerHTML = `<div style="height:${contentHeight}px;"></div>`
  document.body.appendChild(div)
  return div
}

describe('useInitialAutoScroll', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should auto-scroll to bottom on first load', () => {
    const { result } = renderHook(() => useInitialAutoScroll('1', ['msg1']))
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {})
    expect(div.scrollTop).toBe(div.scrollHeight)
  })

  it('should auto-scroll to bottom when conversationId changes', () => {
    let conversationId = '1'
    let messages = ['msg1']
    const { result, rerender } = renderHook(
      ({ conversationId, messages }) =>
        useInitialAutoScroll(conversationId, messages),
      { initialProps: { conversationId, messages } },
    )
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {
      conversationId = '2'
      messages = ['msg2']
      rerender({ conversationId, messages })
    })
    expect(div.scrollTop).toBe(div.scrollHeight)
  })

  it('should not auto-scroll after first load if conversationId does not change', () => {
    let conversationId = '1'
    let messages = ['msg1']
    const { result, rerender } = renderHook(
      ({ conversationId, messages }) =>
        useInitialAutoScroll(conversationId, messages),
      { initialProps: { conversationId, messages } },
    )
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {
      messages = ['msg1', 'msg2']
      rerender({ conversationId, messages })
    })
    // Should not scroll again (remains at 0)
    expect(div.scrollTop).toBe(0)
  })

  it('should auto-scroll if the new message comes', () => {
    let conversationId = '1'
    let messages = [{ id: '1', content: 'msg1' }]
    const { result, rerender } = renderHook(
      ({ conversationId, messages }) =>
        useInitialAutoScroll(conversationId, messages),
      { initialProps: { conversationId, messages } },
    )
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {
      messages = [
        { id: '1', content: 'msg1' },
        { id: '2', content: 'msg2' },
      ]
      rerender({ conversationId, messages })
    })
    expect(div.scrollTop).toBe(div.scrollHeight)
  })

  it('should not auto-scroll if the new message id is invalid', () => {
    let conversationId = '1'
    let messages = [{ id: '1', content: 'msg1' }]
    const { result, rerender } = renderHook(
      ({ conversationId, messages }) =>
        useInitialAutoScroll(conversationId, messages),
      { initialProps: { conversationId, messages } },
    )
    const div = createScrollableDiv()
    result.current.current = div
    act(() => {
      messages = [
        { id: '1', content: 'msg1' },
        { id: '', content: 'msg2' },
      ]
      rerender({ conversationId, messages })
    })
    expect(div.scrollTop).toBe(0)
  })
})
