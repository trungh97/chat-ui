import { SearchUsersQuery, useSearchUsersQuery } from '@generated/graphql'
import { act, renderHook } from '@testing-library/react'
import {
  ContactUser,
  mergeSearchUsersPage,
  SEARCH_USERS_DEBOUNCE_MS,
  useSearchUsers,
} from '../useSearchUsers'

jest.mock('@generated/graphql', () => ({
  ...jest.requireActual('@generated/graphql'),
  useSearchUsersQuery: jest.fn(),
}))

const mockedUseSearchUsersQuery = jest.mocked(useSearchUsersQuery)

const user = (id: string): ContactUser => ({
  __typename: 'UserContactDTO',
  id,
  email: `${id}@example.com`,
  firstName: id,
  lastName: 'Tester',
  avatar: null,
  isOnline: false,
})

const page = (
  ids: string[],
  nextCursor: string | null,
  error: string | null = null,
): SearchUsersQuery => ({
  searchUsers: {
    __typename: 'UserContactListGlobalResponse',
    statusCode: 200,
    message: null,
    error,
    data: error
      ? null
      : {
          __typename: 'UserContactListResponse',
          items: ids.map(user),
          nextCursor,
        },
  },
})

describe('mergeSearchUsersPage', () => {
  it('appends the next page and takes its cursor', () => {
    const merged = mergeSearchUsersPage(page(['a', 'b'], 'b'), {
      fetchMoreResult: page(['c'], null),
    })

    expect(merged.searchUsers.data?.items.map(({ id }) => id)).toEqual([
      'a',
      'b',
      'c',
    ])
    expect(merged.searchUsers.data?.nextCursor).toBeNull()
  })

  it('skips users already in the list', () => {
    const merged = mergeSearchUsersPage(page(['a', 'b'], 'b'), {
      fetchMoreResult: page(['b', 'c'], 'c'),
    })

    expect(merged.searchUsers.data?.items.map(({ id }) => id)).toEqual([
      'a',
      'b',
      'c',
    ])
    expect(merged.searchUsers.data?.nextCursor).toBe('c')
  })

  it('keeps the current list when the next page failed or is missing', () => {
    const prev = page(['a'], 'a')

    expect(
      mergeSearchUsersPage(prev, { fetchMoreResult: page([], null, 'boom') }),
    ).toBe(prev)
    expect(mergeSearchUsersPage(prev, {})).toBe(prev)
  })
})

describe('useSearchUsers', () => {
  const fetchMore = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    fetchMore.mockReset().mockResolvedValue({})
    mockedUseSearchUsersQuery.mockReturnValue({
      data: page(['a'], 'a'),
      loading: false,
      error: undefined,
      fetchMore,
    } as unknown as ReturnType<typeof useSearchUsersQuery>)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const lastSearch = () =>
    mockedUseSearchUsersQuery.mock.lastCall?.[0]?.variables?.search

  it('searches only after typing stops, and trims the term', () => {
    const { rerender } = renderHook(
      ({ search }) => useSearchUsers({ search }),
      { initialProps: { search: '' } },
    )
    expect(lastSearch()).toBeUndefined()

    rerender({ search: ' an' })
    act(() => {
      jest.advanceTimersByTime(SEARCH_USERS_DEBOUNCE_MS - 1)
    })
    expect(lastSearch()).toBeUndefined()

    rerender({ search: ' ann ' })
    act(() => {
      jest.advanceTimersByTime(SEARCH_USERS_DEBOUNCE_MS)
    })
    expect(lastSearch()).toBe('ann')
  })

  it('loads the next page from the cursor with the merge function', async () => {
    const { result } = renderHook(() => useSearchUsers({ search: '' }))

    expect(result.current.hasNextPage).toBe(true)
    await act(() => result.current.loadMore())

    expect(fetchMore).toHaveBeenCalledWith({
      variables: { search: undefined, options: { cursor: 'a', limit: 20 } },
      updateQuery: mergeSearchUsersPage,
    })
  })
})
