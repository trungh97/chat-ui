import {
  ConversationType,
  GetMyLatestConversationsQuery,
} from '@generated/graphql'
import { Conversation } from '@interfaces/dtos'

export const formatConversationList = (
  data: GetMyLatestConversationsQuery | undefined,
): Conversation[] => {
  return (data?.getMyConversations.data?.items || []).map((conversation) => ({
    id: conversation.id,
    title: conversation.title!,
    avatar:
      conversation.groupAvatar || conversation.defaultGroupAvatar?.[0] || '',
    lastMessage: conversation.messages[0]?.content || 'No messages yet',
    lastMessageTime:
      conversation.messages[0]?.createdAt || new Date().toISOString(),
    isRead: false,
    numberOfPaticipants: conversation.participants.length,
    isGroup: conversation.type === ConversationType.Group,
  }))
}
