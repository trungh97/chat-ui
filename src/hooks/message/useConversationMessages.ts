import { DEFAULT_LIMIT } from '@constants/pagination'
import { MessageData } from '@data/message'
import {
  NewMessageAddedDocument,
  NewMessageAddedSubscription,
  useGetMessagesByConversationIdQuery,
} from '@generated/graphql'
import { useCallback, useEffect } from 'react'

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
  const { loading, fetchMore, data, error, subscribeToMore } =
    useGetMessagesByConversationIdQuery({
      variables: {
        conversationId,
        options: { cursor: initialCursor, limit },
      },
      fetchPolicy: 'network-only',
    })

  const nextCursor = data?.getMessagesByConversationId?.data?.nextCursor
  const items = data?.getMessagesByConversationId?.data?.items || []
  const hasNextPage = !!nextCursor

  const loadMore = useCallback(async () => {
    if (!hasNextPage || !nextCursor) return

    await fetchMore({
      variables: {
        conversationId,
        options: { cursor: nextCursor, limit },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        const prevItems = prev.getMessagesByConversationId.data?.items || []
        const { items: newItems = [], nextCursor: newNextCursor = null } =
          fetchMoreResult.getMessagesByConversationId?.data || {}

        return {
          ...prev,
          getMessagesByConversationId: {
            ...prev.getMessagesByConversationId,
            data: {
              ...prev.getMessagesByConversationId.data,
              items: [...prevItems, ...newItems],
              nextCursor: newNextCursor,
            },
          },
        }
      },
    })
  }, [conversationId, nextCursor, hasNextPage, limit, fetchMore])

  useEffect(() => {
    // This assumes you want to wait to start the subscription
    // after the query has loaded.
    if (data) {
      const unsubscribe = subscribeToMore<NewMessageAddedSubscription>({
        document: NewMessageAddedDocument,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { newMessageAdded },
            },
          },
        ) => {
          if (!newMessageAdded) return prev

          // Append only if this is the same conversation
          if (newMessageAdded.conversationId !== conversationId) {
            return prev
          }

          const prevMessages =
            prev.getMessagesByConversationId.data?.items || []
          const normalizedNewMessage =
            MessageData.fromNewMessageSubscriptionToMessageWithSenderDTO({
              data: newMessageAdded,
            })

          return {
            ...prev,
            getMessagesByConversationId: {
              ...prev.getMessagesByConversationId,
              data: {
                ...prev.getMessagesByConversationId.data,
                items: [normalizedNewMessage, ...prevMessages],
              },
            },
          }
        },
      })

      return () => {
        unsubscribe()
      }
    }
  }, [data, conversationId, subscribeToMore])

  return {
    data: MessageData.toMessageListWithSender({ data: items }),
    error,
    loading,
    hasNextPage,
    nextCursor,
    loadMore,
  }
}
