import { DEFAULT_DEBOUNCE_TIME } from '@constants/common'
import { DEFAULT_LIMIT } from '@constants/pagination'
import { ConversationData } from '@data/conversation'
import { useGetMyLatestConversationsQuery } from '@generated/graphql'
import { CursorBasedPagination } from '@interfaces/pagination'
import useConversationListStore from '@store/conversations'
import _debounce from 'lodash/debounce'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useMyLatestConversations = (options: CursorBasedPagination) => {
  const setConversations = useConversationListStore.use.setConversations()
  const setNextCursor = useConversationListStore.use.setNextCursor()
  const cursor = useConversationListStore.use.nextCursor!()
  const conversations = useConversationListStore.use.conversations()

  const initializedRef = useRef(false)

  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { data, error, loading, fetchMore } = useGetMyLatestConversationsQuery({
    variables: {
      options: {
        cursor: options.cursor,
        limit: options.limit || DEFAULT_LIMIT,
      },
    },
  })

  useEffect(() => {
    if (
      !loading &&
      !error &&
      !initializedRef.current &&
      data?.getMyConversations.data?.items.length! > 0
    ) {
      const items = ConversationData.toConversationListDTO(data)
      setConversations(items)
      setNextCursor(data?.getMyConversations.data?.nextCursor ?? null)
      initializedRef.current = true
    }
  }, [data, loading, error, setConversations, setNextCursor])

  const loadMore = useCallback(
    _debounce(async () => {
      if (!cursor || isFetchingMore || loading) return

      setIsFetchingMore(true)

      const { data: moreData } = await fetchMore({
        variables: {
          options: {
            cursor,
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

      const moreItems = ConversationData.toConversationListDTO(moreData)
      const allItems = [...conversations, ...moreItems]

      const uniqueMap = new Map()
      allItems.forEach((item) => uniqueMap.set(item.id, item))
      const uniqueList = Array.from(uniqueMap.values())

      setConversations(uniqueList)
      setNextCursor(moreData?.getMyConversations.data?.nextCursor ?? null)
    }, DEFAULT_DEBOUNCE_TIME),
    [cursor, loading, isFetchingMore],
  )

  return {
    conversations: ConversationData.toConversationListDTO(data),
    loading,
    isFetchingMore,
    error,
    loadMore,
    hasNextPage: !!data?.getMyConversations.data?.nextCursor,
    nextCursor: data?.getMyConversations.data?.nextCursor,
  }
}
