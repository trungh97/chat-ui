import { act, renderHook } from '@testing-library/react'
import { useUpdateLastSeenMessageMutation } from '@generated/graphql'
import {
  MARK_SEEN_DELAY_MS,
  useMarkConversationSeen,
} from '../useMarkConversationSeen'

jest.mock('@generated/graphql', () => ({
  useUpdateLastSeenMessageMutation: jest.fn(),
}))

const mockedUseUpdateLastSeenMessageMutation = jest.mocked(
  useUpdateLastSeenMessageMutation,
)

const latestIncomingMessage = {
  id: 'm2',
  createdAt: '2026-10-01T10:00:00.000Z',
}

describe('useMarkConversationSeen', () => {
  let updateLastSeenMessage: jest.Mock
  let hasFocus: jest.SpyInstance

  beforeEach(() => {
    jest.useFakeTimers()
    updateLastSeenMessage = jest.fn().mockResolvedValue({})
    mockedUseUpdateLastSeenMessageMutation.mockReturnValue([
      updateLastSeenMessage,
    ] as unknown as ReturnType<typeof useUpdateLastSeenMessageMutation>)
    hasFocus = jest.spyOn(document, 'hasFocus').mockReturnValue(true)
  })

  afterEach(() => {
    jest.useRealTimers()
    hasFocus.mockRestore()
  })

  const render = (
    props: Partial<Parameters<typeof useMarkConversationSeen>[0]> = {},
  ) =>
    renderHook(() =>
      useMarkConversationSeen({
        conversationId: 'c1',
        latestIncomingMessage,
        myParticipant: { userId: 'me', name: 'Me' },
        isScrolledToBottom: true,
        ...props,
      }),
    )

  it('marks the latest incoming message as seen after a short delay', () => {
    render()

    expect(updateLastSeenMessage).not.toHaveBeenCalled()
    act(() => {
      jest.advanceTimersByTime(MARK_SEEN_DELAY_MS)
    })

    expect(updateLastSeenMessage).toHaveBeenCalledWith({
      variables: { conversationId: 'c1', messageId: 'm2' },
    })
  })

  it('waits until the bottom of the list is in view', () => {
    render({ isScrolledToBottom: false })

    act(() => {
      jest.advanceTimersByTime(MARK_SEEN_DELAY_MS)
    })

    expect(updateLastSeenMessage).not.toHaveBeenCalled()
  })

  it('waits while the window is not focused', () => {
    hasFocus.mockReturnValue(false)
    render()

    act(() => {
      jest.advanceTimersByTime(MARK_SEEN_DELAY_MS)
    })

    expect(updateLastSeenMessage).not.toHaveBeenCalled()
  })

  it('does nothing when the user has already seen the message', () => {
    render({
      myParticipant: {
        userId: 'me',
        name: 'Me',
        lastSeenMessageId: 'm2',
        lastSeenMessageAt: latestIncomingMessage.createdAt,
      },
    })

    act(() => {
      jest.advanceTimersByTime(MARK_SEEN_DELAY_MS)
    })

    expect(updateLastSeenMessage).not.toHaveBeenCalled()
  })

  it('sends each message only once', () => {
    const { rerender } = render()

    act(() => {
      jest.advanceTimersByTime(MARK_SEEN_DELAY_MS)
    })
    rerender()
    act(() => {
      jest.advanceTimersByTime(MARK_SEEN_DELAY_MS)
    })

    expect(updateLastSeenMessage).toHaveBeenCalledTimes(1)
  })
})
