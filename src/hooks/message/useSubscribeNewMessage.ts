import { MessageData } from '@data/message'
import { useNewMessageAddedSubscription } from '@generated/graphql'
import { getGroupPosition } from '@helpers/conversation'
import { getTimeDifference } from '@helpers/date'
import { Message } from '@interfaces/dtos'
import useConversationListStore, {
  ConversationGlobalState,
} from '@store/conversations'
import { useMessageListStore } from '@store/messages'

// Helper: update the last message's group position if needed
function updateLastMessageGroupPosition({
  conversationId,
  lastMessage,
  newMessage,
  updateMessage,
}: {
  conversationId: string
  lastMessage: Message
  newMessage: Message
  updateMessage: ReturnType<typeof useMessageListStore.use.updateMessage>
}) {
  let lastMessageWithNewPosition = lastMessage
  if (
    lastMessage &&
    lastMessage.senderId === newMessage.senderId &&
    lastMessage.groupPosition === 'end' &&
    getTimeDifference(lastMessage.createdAt, newMessage.createdAt, 'minutes') <
      5
  ) {
    lastMessageWithNewPosition.groupPosition = 'middle'
    updateMessage(conversationId, lastMessageWithNewPosition)
  }
}

// Helper: update the conversation with the latest message
function updateConversationLatestMessageQuickView({
  conversationId,
  latestMessage,
  conversationStore,
}: {
  conversationId: string
  latestMessage: Message
  conversationStore: ConversationGlobalState
}) {
  const currentConversation = conversationStore.conversations.find(
    (c) => c.id === conversationId,
  )
  if (currentConversation) {
    conversationStore.updateConversation({
      ...currentConversation,
      lastMessage: latestMessage.content,
      lastMessageTime: latestMessage.createdAt,
    })
  }
}

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
        if (typeof data.newMessageAdded.conversationId !== 'string') return

        const conversationId = data.newMessageAdded.conversationId
        const latestMessageFromStore =
          messageStore.messagesByConversation[conversationId]?.slice(-1)[0]
          
        const newMessage = MessageData.toMessage(data.newMessageAdded)

        const newMessageWithPosition = MessageData.toMessage(
          data.newMessageAdded,
          getGroupPosition(latestMessageFromStore, newMessage, undefined),
        )

        updateLastMessageGroupPosition({
          conversationId,
          lastMessage: latestMessageFromStore,
          newMessage,
          updateMessage: messageStore.updateMessage,
        })

        messageStore.addMessagesToTheEnd(conversationId, [
          newMessageWithPosition,
        ])

        updateConversationLatestMessageQuickView({
          conversationId,
          latestMessage: newMessage,
          conversationStore,
        })
      }
    },
  })

  return { error }
}
