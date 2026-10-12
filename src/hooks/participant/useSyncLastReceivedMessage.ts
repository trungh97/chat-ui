import {
  ExtendConversationDto,
  useBatchUpdateLastReceivedMessagesMutation,
} from '@generated/graphql'
import { useAuth } from '@hooks/auth'

export function useSyncLastReceivedMessage() {
  const meData = useAuth()
  const [batchUpdateLastReceivedMessageRequest] =
    useBatchUpdateLastReceivedMessagesMutation()

  const sync = (items: ExtendConversationDto[]) => {
    if (!meData.data?.me) return
    const userId = meData.data.me.data?.id
    // The server resolves the user's own participant in each conversation from the session.
    const request = items
      .filter(
        (conversation) =>
          conversation.messages.length > 0 &&
          conversation.participants.some(
            (participant) => participant.userId === userId,
          ),
      )
      .map((conversation) => ({
        conversationId: conversation.id,
        messageId: conversation.messages[0].id,
      }))
    if (request.length > 0) {
      batchUpdateLastReceivedMessageRequest({
        variables: {
          request,
        },
      })
    }
  }

  return sync
}
