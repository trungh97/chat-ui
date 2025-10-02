import {
  ExtendConversationDto,
  useBatchUpdateLastReceivedMessageRequestMutation,
} from '@generated/graphql'
import { useAuth } from '@hooks/auth'

export function useSyncLastReceivedMessage() {
  const meData = useAuth()
  const [batchUpdateLastReceivedMessageRequest] =
    useBatchUpdateLastReceivedMessageRequestMutation()

  const sync = (items: ExtendConversationDto[]) => {
    if (!meData.data?.me) return
    const userId = meData.data.me.data?.id
    const updates = items
      .map((conversation) => {
        const participant = conversation.participants.find(
          (participant) => participant.userId === userId,
        )
        if (!participant) return null
        return {
          participantId: participant.id,
          messageId: conversation.messages[0].id,
        }
      })
      .filter(Boolean) as { participantId: string; messageId: string }[]
    if (updates.length > 0) {
      batchUpdateLastReceivedMessageRequest({
        variables: {
          updates,
        },
      })
    }
  }

  return sync
}
