import { DEFAULT_LIMIT } from '@constants/pagination'
import { useGetMyLatestConversationsQuery } from '@generated/graphql'
import { useCallback, useEffect, useRef } from 'react'
import _debounce from 'lodash/debounce'

import { formatConversationList } from '../../data'
import { useConversationListStore } from '../../store'
import { CursorBasedPagination } from '../../types'
import { DEFAULT_DEBOUNCE_TIME } from '@constants/common'

export const useMyLatestConversations = (options: CursorBasedPagination) => {
  const setConversations = useConversationListStore.use.setConversations()
  const setNextCursor = useConversationListStore.use.setNextCursor()
  const cursor = useConversationListStore.use.nextCursor!()
  const conversations = useConversationListStore.use.conversations()

  const initializedRef = useRef(false)

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
      const items = formatConversationList(data)
      setConversations(items)
      setNextCursor(data?.getMyConversations.data?.nextCursor ?? null)
      initializedRef.current = true
    }
  }, [data, loading, error, setConversations, setNextCursor])

  const loadMore = useCallback(
    _debounce(async () => {
      if (!cursor || loading) return

      const { data: moreData } = await fetchMore({
        variables: {
          options: {
            cursor,
            limit: options.limit || DEFAULT_LIMIT,
          },
        },
      })

      const moreItems = formatConversationList(moreData)
      const allItems = [...conversations, ...moreItems]

      const uniqueMap = new Map()
      allItems.forEach((item) => uniqueMap.set(item.id, item))
      const uniqueList = Array.from(uniqueMap.values())

      setConversations(uniqueList)
      setNextCursor(moreData?.getMyConversations.data?.nextCursor ?? null)
    }, DEFAULT_DEBOUNCE_TIME),
    [cursor, loading],
  )

  return {
    conversations: formatConversationList(data),
    loading,
    error,
    loadMore,
    hasNextPage: !!data?.getMyConversations.data?.nextCursor,
    nextCursor: data?.getMyConversations.data?.nextCursor,
  }
}
