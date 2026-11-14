import {
  PRESENCE_FIRST_HEARTBEAT_DELAY_MS,
  PRESENCE_HEARTBEAT_INTERVAL_MS,
} from '@constants/common'
import { useHeartbeatUserPresenceMutation } from '@generated/graphql'
import { renderHook } from '@testing-library/react'
import { useUserPresenceHeartbeat } from '../useUserPresenseHeartbeat'

jest.mock('@generated/graphql', () => ({
  ...jest.requireActual('@generated/graphql'),
  useHeartbeatUserPresenceMutation: jest.fn(),
}))

describe('useUserPresenceHeartbeat', () => {
  const heartbeat = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    heartbeat.mockReset().mockResolvedValue({})
    jest
      .mocked(useHeartbeatUserPresenceMutation)
      .mockReturnValue([heartbeat] as unknown as ReturnType<
        typeof useHeartbeatUserPresenceMutation
      >)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderHeartbeat = (userId: string) =>
    renderHook((props) => useUserPresenceHeartbeat(props), {
      initialProps: { userId },
    })

  it('sends nothing while no user is logged in', () => {
    renderHeartbeat('')

    jest.advanceTimersByTime(
      PRESENCE_FIRST_HEARTBEAT_DELAY_MS + PRESENCE_HEARTBEAT_INTERVAL_MS * 3,
    )

    expect(heartbeat).not.toHaveBeenCalled()
  })

  it('sends the first heartbeat after the delay, then one per interval', () => {
    renderHeartbeat('u1')

    jest.advanceTimersByTime(PRESENCE_FIRST_HEARTBEAT_DELAY_MS - 1)
    expect(heartbeat).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(heartbeat).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(PRESENCE_HEARTBEAT_INTERVAL_MS * 2)
    expect(heartbeat).toHaveBeenCalledTimes(3)
  })

  it('keeps the interval below the 90s offline threshold of the backend', () => {
    expect(PRESENCE_HEARTBEAT_INTERVAL_MS).toBeLessThan(90_000)
  })

  it('stops when the component unmounts', () => {
    const { unmount } = renderHeartbeat('u1')
    jest.advanceTimersByTime(PRESENCE_FIRST_HEARTBEAT_DELAY_MS)
    expect(heartbeat).toHaveBeenCalledTimes(1)

    unmount()
    jest.advanceTimersByTime(PRESENCE_HEARTBEAT_INTERVAL_MS * 3)

    expect(heartbeat).toHaveBeenCalledTimes(1)
  })

  it('stops before the first heartbeat when unmounted during the delay', () => {
    const { unmount } = renderHeartbeat('u1')

    unmount()
    jest.advanceTimersByTime(
      PRESENCE_FIRST_HEARTBEAT_DELAY_MS + PRESENCE_HEARTBEAT_INTERVAL_MS,
    )

    expect(heartbeat).not.toHaveBeenCalled()
  })

  it('stops on logout and starts again on the next login', () => {
    const { rerender } = renderHeartbeat('u1')
    jest.advanceTimersByTime(PRESENCE_FIRST_HEARTBEAT_DELAY_MS)
    expect(heartbeat).toHaveBeenCalledTimes(1)

    rerender({ userId: '' })
    jest.advanceTimersByTime(PRESENCE_HEARTBEAT_INTERVAL_MS * 3)
    expect(heartbeat).toHaveBeenCalledTimes(1)

    rerender({ userId: 'u2' })
    jest.advanceTimersByTime(PRESENCE_FIRST_HEARTBEAT_DELAY_MS)
    expect(heartbeat).toHaveBeenCalledTimes(2)
  })

  it('handles a failed heartbeat and keeps beating', () => {
    const failed = Promise.reject(new Error('network down'))
    const handled = jest.spyOn(failed, 'catch')
    heartbeat.mockReturnValueOnce(failed)
    renderHeartbeat('u1')

    jest.advanceTimersByTime(PRESENCE_FIRST_HEARTBEAT_DELAY_MS)
    // Without a handler the rejection would surface as an unhandled promise rejection.
    expect(handled).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(PRESENCE_HEARTBEAT_INTERVAL_MS)
    expect(heartbeat).toHaveBeenCalledTimes(2)
  })

  it('asks Apollo not to keep the result, so a beat does not re-render the caller', () => {
    renderHeartbeat('u1')

    expect(useHeartbeatUserPresenceMutation).toHaveBeenCalledWith({
      ignoreResults: true,
    })
  })
})
