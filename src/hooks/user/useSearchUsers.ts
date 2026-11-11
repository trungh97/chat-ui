import { SearchUsersQuery, useSearchUsersQuery } from '@generated/graphql'
import { useCallback, useEffect, useState } from 'react'

/** Wait this long after typing stops before searching. */
export const SEARCH_USERS_DEBOUNCE_MS = 300
export const SEARCH_USERS_PAGE_LIMIT = 20

export type ContactUser = NonNullable<
  SearchUsersQuery['searchUsers']['data']
>['items'][number]

/**
 * `updateQuery` for loading the next page: appends the new users, skipping any already in
 * the list (a user can move between pages when someone is renamed), and takes the new cursor.
 */
export const mergeSearchUsersPage = (
  prev: SearchUsersQuery,
  { fetchMoreResult }: { fetchMoreResult?: SearchUsersQuery },
): SearchUsersQuery => {
  const next = fetchMoreResult?.searchUsers.data
  if (!next || fetchMoreResult?.searchUsers.error) return prev

  const prevItems = prev.searchUsers.data?.items ?? []
  const seen = new Set(prevItems.map(({ id }) => id))

  return {
    ...prev,
    searchUsers: {
      ...prev.searchUsers,
      data: {
        ...prev.searchUsers.data,
        items: [...prevItems, ...next.items.filter(({ id }) => !seen.has(id))],
        nextCursor: next.nextCursor ?? null,
      },
    },
  }
}

/**
 * Active users other than the current user, sorted by name, filtered by `search` once the
 * user stops typing, and loaded a page at a time.
 */
export const useSearchUsers = ({
  search,
  skip = false,
  limit = SEARCH_USERS_PAGE_LIMIT,
}: {
  search: string
  skip?: boolean
  limit?: number
}) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim())
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_USERS_DEBOUNCE_MS,
    )
    return () => clearTimeout(timeout)
  }, [search])

  const searchVariable = debouncedSearch || undefined
  const { data, loading, error, fetchMore } = useSearchUsersQuery({
    variables: { search: searchVariable, options: { limit } },
    skip,
    fetchPolicy: 'network-only',
  })

  const response = data?.searchUsers
  const nextCursor = response?.data?.nextCursor

  const loadMore = useCallback(async () => {
    if (!nextCursor || isFetchingMore) return

    setIsFetchingMore(true)
    try {
      await fetchMore({
        variables: {
          search: searchVariable,
          options: { cursor: nextCursor, limit },
        },
        updateQuery: mergeSearchUsersPage,
      })
    } catch {
      // Keep the users already shown; scrolling to the end again retries.
    } finally {
      setIsFetchingMore(false)
    }
  }, [fetchMore, isFetchingMore, limit, nextCursor, searchVariable])

  return {
    users: response?.data?.items ?? [],
    loading,
    isFetchingMore,
    hasNextPage: !!nextCursor,
    loadMore,
    error: response?.error ?? error?.message,
  }
}

export default useSearchUsers
