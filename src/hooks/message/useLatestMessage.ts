import { Message } from '@interfaces/dtos'
import useMessageListStore from '@store/messages'

export const useLatestMessage = (conversationId: string): Message => {
  const messagesByConversation =
    useMessageListStore.use.messagesByConversation()

  return messagesByConversation[conversationId]?.slice(-1)[0]
}
