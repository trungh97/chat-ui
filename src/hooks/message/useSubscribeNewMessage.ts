import { MessageData } from '@data/message'
import { useNewMessageAddedSubscription } from '@generated/graphql'
import { getGroupPosition } from '@helpers/conversation'
import { getTimeDifference } from '@helpers/date'
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
          const lastMessage = existingMessages[existingMessages.length - 1]
          const newMessage = MessageData.toMessage(data.newMessageAdded)

          // Determine the group position for the new message
          const newMessageGroupPosition = getGroupPosition(
            lastMessage,
            newMessage,
            undefined,
          )

          // If the last message is from the same sender and within 5 minutes, update its group position
          // to 'middle' if it was previously 'end'
          let lastMessageWithNewPosition = lastMessage
          if (
            lastMessage &&
            lastMessage.senderId === newMessage.senderId &&
            lastMessage.groupPosition === 'end' &&
            getTimeDifference(
              lastMessage.createdAt,
              newMessage.createdAt,
              'minutes',
            ) < 5
          ) {
            lastMessageWithNewPosition = {
              ...lastMessage,
              groupPosition: 'middle',
            }
            messageStore.updateMessage(
              conversationId,
              lastMessageWithNewPosition,
            )
          }

          // Convert the new message to the local Message type with group position
          const newMessageWithPosition = MessageData.toMessage(
            data.newMessageAdded,
            newMessageGroupPosition,
          )

          // Add the new message to the store
          messageStore.addMessages(conversationId, [newMessageWithPosition])

          // If the conversation exists in the store, update it with the latest message
          const currentConversation = conversationStore.conversations.find(
            (c) => c.id === conversationId,
          )

          if (currentConversation) {
            conversationStore.updateConversation({
              ...currentConversation,
              lastMessage: newMessageWithPosition.content,
              lastMessageTime: newMessageWithPosition.createdAt,
            })
          }
        }
      }
    },
  })

  return { error }
}
