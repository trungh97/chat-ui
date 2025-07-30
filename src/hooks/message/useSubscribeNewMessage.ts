import { MessageData } from '@data/message'
import { useNewMessageAddedSubscription } from '@generated/graphql'
import { getGroupPosition } from '@helpers/conversation'
import useConversationListStore from '@store/conversations'
import { useMessageListStore } from '@store/messages'

/**
 * Subscribe to new messages and update the store based on the message's conversationId.
 * @param options Optional: { skip?: boolean, onData?: (data) => void }
 */
export function useSubscribeNewMessage(options?: {
  skip?: boolean
  onData?: (data: any) => void
}) {
  const messageStore = useMessageListStore()
  const conversationStore = useConversationListStore()

  const { error } = useNewMessageAddedSubscription({
    skip: options?.skip,
    onData: ({ data: { data, error, loading } }) => {
      if (data && data.newMessageAdded && !loading && !error) {
        if (typeof data.newMessageAdded.conversationId === 'string') {
          const conversationId = data.newMessageAdded.conversationId
          const existingMessages =
            messageStore.messagesByConversation[conversationId] || []

          // Determine the group position for the new message
          const newMessageGroupPosition = getGroupPosition(
            existingMessages[existingMessages.length - 1],
            MessageData.toMessage(data.newMessageAdded, undefined),
            undefined,
          )

          // Convert the new message to the local Message type with group position
          const updatedMessage = MessageData.toMessage(
            data.newMessageAdded,
            newMessageGroupPosition,
          )

          // Add the new message to the store
          messageStore.addMessages(conversationId, [updatedMessage])

          // If the conversation exists in the store, update it with the latest message
          const currentConversation = conversationStore.conversations.find(
            (c) => c.id === conversationId,
          )

          if (currentConversation) {
            conversationStore.updateConversation({
              ...currentConversation,
              lastMessage: updatedMessage.content,
              lastMessageTime: updatedMessage.createdAt,
            })
          }
        }
      }
    },
  })

  return { error }
}
