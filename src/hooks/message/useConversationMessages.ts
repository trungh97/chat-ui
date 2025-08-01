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

  const { loading, refetch } = useGetMessagesByConversationIdQuery({
    variables: {
      conversationId,
      options: { cursor: initialCursor, limit },
    },
    onCompleted: (response) => {
      const items = response?.getMessagesByConversationId?.data?.items || []
      const cursor =
        response?.getMessagesByConversationId?.data?.nextCursor || null

      store.setMessages(conversationId, MessageData.toMessageList(items))
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

    const response = await refetch({
      conversationId,
      options: { cursor: nextCursor, limit },
    })

    const items = response?.data?.getMessagesByConversationId?.data?.items || []
    const cursor =
      response?.data?.getMessagesByConversationId?.data?.nextCursor || null

    store.addMessages(conversationId, MessageData.toMessageList(items))
    store.setNextCursor(conversationId, cursor)
    store.setHasNextPage(conversationId, !!cursor)
  }, [conversationId, nextCursor, hasNextPage, limit, refetch, store])

  return {
    data: store.messagesByConversation[conversationId] || [],
    error: store.errorByConversation[conversationId],
    loading,
    hasNextPage,
    nextCursor,
    loadMore,
  }
}
