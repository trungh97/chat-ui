import { DEFAULT_LIMIT } from '@constants/pagination'
import { MessageData } from '@data/message'
import { useGetMessagesByConversationIdQuery } from '@generated/graphql'
import { useMessageListStore } from '@store/messages'
import { useCallback } from 'react'

interface UseMessageListOptions {
  conversationId: string
  initialCursor?: string
  limit?: number
}

export function useConversationMessages({
  conversationId,
  initialCursor,
  limit = DEFAULT_LIMIT,
}: UseMessageListOptions) {
  const store = useMessageListStore()

  const { loading, fetchMore } = useGetMessagesByConversationIdQuery({
    variables: {
      conversationId,
      options: { cursor: initialCursor, limit },
    },
    onCompleted: (response) => {
      const items = response?.getMessagesByConversationId?.data?.items || []
      const cursor =
        response?.getMessagesByConversationId?.data?.nextCursor || null

      store.setMessages(
        conversationId,
        MessageData.toMessageList({ data: items }),
      )
      store.setNextCursor(conversationId, cursor)
      store.setHasNextPage(conversationId, !!cursor)
    },
    onError: (err) => {
      store.setError(conversationId, err)
    },
    fetchPolicy: 'network-only',
  })

  const hasNextPage = store.hasNextPageByConversation[conversationId] || false
  const nextCursor = store.nextCursorByConversation[conversationId] || null

  const loadMore = useCallback(async () => {
    if (!hasNextPage || !nextCursor) return

    await fetchMore({
      variables: {
        conversationId,
        options: { cursor: nextCursor, limit },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        const result = fetchMoreResult.getMessagesByConversationId?.data
        const prevData = prev.getMessagesByConversationId.data
        const prevItems = prevData?.items || []
        const newItems = result?.items || []
        const newCursor = result?.nextCursor || null

        store.addMessagesToTheBeginning(
          conversationId,
          MessageData.toMessageList({ data: newItems }),
        )
        store.setNextCursor(conversationId, newCursor)
        store.setHasNextPage(conversationId, !!newCursor)

        return {
          ...prev,
          getMessagesByConversationId: {
            ...prev.getMessagesByConversationId,
            data: {
              ...prev.getMessagesByConversationId.data,
              items: [...newItems, ...prevItems],
              nextCursor: newCursor,
            },
          },
        }
      },
    })
  }, [conversationId, nextCursor, hasNextPage, limit, fetchMore, store])

  return {
    data: store.messagesByConversation[conversationId] || [],
    error: store.errorByConversation[conversationId],
    loading,
    hasNextPage,
    nextCursor,
    loadMore,
  }
}
