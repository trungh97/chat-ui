import {
  ConversationType,
  GetMyLatestConversationsQuery
} from '@generated/graphql'
import { Conversation } from '@interfaces/dtos'

export class ConversationData {
  /**
   * Transform the raw data received from the server into a list of Conversation DTOs.
   *
   * @param {GetMyLatestConversationsQuery | undefined} data - The raw data received from the server.
   * @return {Conversation[]} An array of Conversation DTOs.
   */
  static toConversationListDTO(
    data: GetMyLatestConversationsQuery | undefined,
  ): Conversation[] {
    return (data?.getMyConversations.data?.items || []).map((conversation) => ({
      id: conversation.id,
      title: conversation.title!,
      avatar:
        conversation.groupAvatar || conversation.defaultGroupAvatars?.[0] || '',
      lastMessage: conversation.messages[0]?.content || 'No messages yet',
      lastMessageTime:
        conversation.messages[0]?.createdAt || new Date().toISOString(),
      isRead: false,
      numberOfPaticipants: conversation.participants.length,
      isGroup: conversation.type === ConversationType.Group,
    }))
  }
}
