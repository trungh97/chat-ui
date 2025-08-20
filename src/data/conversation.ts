import {
  ConversationType,
  ExtendConversationDto,
  MessageWithConversationDto,
} from '@generated/graphql'
import { Conversation } from '@interfaces/dtos'

export class ConversationData {
  static toBaseConversation(data: ExtendConversationDto): Conversation {
    const { participants = [], messages = [] } = data
    return {
      id: data.id,
      title: data.title!,
      avatar: data.groupAvatar || data.defaultGroupAvatars?.[0] || '',
      lastMessage: messages?.[0]?.content || 'No messages yet',
      lastMessageTime:
        data.messages?.[0]?.createdAt || new Date().toISOString(),
      isRead: false,
      numberOfPaticipants: participants.length || 0,
      isGroup: data.type === ConversationType.Group,
    }
  }

  /**
   * Transform the raw data received from the server into a list of Conversation DTOs.
   *
   * @param {GetMyLatestConversationsQuery | undefined} data - The raw data received from the server.
   * @return {Conversation[]} An array of Conversation DTOs.
   */
  static toBaseConversationList(data: ExtendConversationDto[]): Conversation[] {
    return data.map(this.toBaseConversation)
  }

  /**
   * Maps a MessageWithConversation DTO to an ExtendConversation DTO.
   *
   * @param {{ data: MessageWithConversationDto }} - The MessageWithConversation DTO to be mapped.
   * @return {ExtendConversationDto} The mapped ExtendConversation DTO.
   */
  static fromMessageWithConversationDTOToExtendedConversationDTO({
    data,
  }: {
    data: MessageWithConversationDto
  }): ExtendConversationDto {
    const conversation = data.conversation
    return {
      __typename: 'ExtendConversationDTO',
      id: conversation.id,
      creatorId: conversation.creatorId,
      isArchived: conversation.isArchived,
      deletedAt: conversation.deletedAt,
      type: conversation.type,
      groupAvatar: conversation.groupAvatar,
      lastMessageAt: conversation.lastMessageAt,
      messages: [
        {
          __typename: 'MessageDTO',
          id: data.id,
          content: data.content,
          createdAt: data.createdAt,
          messageType: data.messageType,
          senderId: data.senderId,
          extra: data.extra,
          conversationId: data.conversationId,
          replyToMessageId: data.replyToMessageId,
        },
      ],
      participants: [],
      title: conversation.title,
    }
  }
}
