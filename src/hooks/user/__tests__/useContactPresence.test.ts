import { useUserPresenseSubscription } from '@generated/graphql'
import { act, renderHook } from '@testing-library/react'
import { useContactPresence } from '../useContactPresence'

jest.mock('@generated/graphql', () => ({
  ...jest.requireActual('@generated/graphql'),
  useUserPresenseSubscription: jest.fn(),
}))

describe('useContactPresence', () => {
  let onData: (args: unknown) => void

  beforeEach(() => {
    jest.mocked(useUserPresenseSubscription).mockImplementation((options) => {
      onData = options?.onData as (args: unknown) => void
      return {} as ReturnType<typeof useUserPresenseSubscription>
    })
  })

  const presence = (userId: string, isOnline: boolean) =>
    act(() => {
      onData({
        data: {
          data: {
            userPresence: { data: { userId, isOnline, lastSeenAt: null } },
          },
        },
      })
    })

  it('records live status changes by user', () => {
    const { result } = renderHook(() => useContactPresence())

    presence('u2', true)
    presence('u3', false)
    presence('u2', false)

    expect(result.current).toEqual({ u2: false, u3: false })
  })

  it('clears the overrides when skipped, and skips the subscription', () => {
    const { result, rerender } = renderHook(
      ({ skip }) => useContactPresence({ skip }),
      { initialProps: { skip: false } },
    )
    presence('u2', true)

    rerender({ skip: true })

    expect(result.current).toEqual({})
    expect(jest.mocked(useUserPresenseSubscription)).toHaveBeenLastCalledWith(
      expect.objectContaining({ skip: true }),
    )
  })
})
