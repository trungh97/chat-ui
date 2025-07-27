import { MessageData } from '@data/message'
import { useNewMessageAddedSubscription } from '@generated/graphql'
import { useMessageListStore } from '@store/messages'

/**
 * Subscribe to new messages and update the store based on the message's conversationId.
 * @param options Optional: { skip?: boolean, onData?: (data) => void }
 */
export function useSubscribeNewMessage(options?: {
  skip?: boolean
  onData?: (data: any) => void
}) {
  const store = useMessageListStore()

  const { error } = useNewMessageAddedSubscription({
    skip: options?.skip,
    onData: ({ data: { data, error, loading } }) => {
      if (data && data.newMessageAdded && !loading && !error) {
        const message = MessageData.toMessage(data.newMessageAdded)
        if (typeof message.conversationId === 'string') {
          store.addMessages(message.conversationId, [message])
        }
      }
    },
  })

  return { error }
}
