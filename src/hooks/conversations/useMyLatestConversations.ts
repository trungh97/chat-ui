import { DEFAULT_DEBOUNCE_TIME } from '@constants/common'
import { DEFAULT_LIMIT } from '@constants/pagination'
import { ConversationData } from '@data/conversation'
import { useGetMyLatestConversationsQuery } from '@generated/graphql'
import { CursorBasedPagination } from '@interfaces/pagination'
import _debounce from 'lodash/debounce'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const useMyLatestConversations = (options: CursorBasedPagination) => {
  const navigate = useNavigate()
  const { conversationId } = useParams()

  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { data, error, loading, fetchMore } = useGetMyLatestConversationsQuery({
    variables: {
      options: {
        cursor: options.cursor,
        limit: options.limit || DEFAULT_LIMIT,
      },
    },
  })

  const items = data?.getMyConversations.data?.items || []
  const nextCursor = data?.getMyConversations.data?.nextCursor

  // Auto redirect to the first conversation
  useEffect(() => {
    if (items.length > 0 && !conversationId) {
      const firstConversationId = data?.getMyConversations?.data?.items[0].id
      navigate(`/${firstConversationId}`)
    }
  }, [data])

  const loadMore = useCallback(
    _debounce(async () => {
      if (!nextCursor || isFetchingMore || loading) return

      setIsFetchingMore(true)

      await fetchMore({
        variables: {
          options: {
            cursor: nextCursor,
            limit: options.limit || DEFAULT_LIMIT,
          },
        },
        updateQuery: (
          prev,
          {
            fetchMoreResult: {
              getMyConversations: { data, error },
            },
          },
        ) => {
          if (error || !data) return prev

          const prevItems = prev?.getMyConversations?.data?.items || []

          return {
            ...prev,
            getMyConversations: {
              ...prev.getMyConversations,
              data: {
                ...prev.getMyConversations.data,
                items: [...prevItems, ...data.items],
                nextCursor: data.nextCursor,
              },
            },
          }
        },
      }).finally(() => {
        setIsFetchingMore(false)
      })
    }, DEFAULT_DEBOUNCE_TIME),
    [nextCursor, loading, isFetchingMore],
  )

  return {
    conversations: ConversationData.toBaseConversationList(items),
    loading,
    isFetchingMore,
    error,
    loadMore,
    hasNextPage: !!nextCursor,
    nextCursor,
  }
}
