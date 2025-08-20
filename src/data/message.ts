import { MessageGroupPosition } from '@constants/enums'
import {
  ConversationType,
  MessageWithConversationDto,
  MessageWithSenderDto,
} from '@generated/graphql'
import { getGroupPosition } from '@helpers/conversation'
import { Message, MessageWithConversation } from '@interfaces/dtos'
import { MessagePosition } from '@interfaces/types'

export class MessageData {
  // Converts a GraphQL message DTO (e.g., from Apollo codegen) to the local Message type
  static toMessageWithSender({
    data,
    position = MessageGroupPosition.start,
  }: {
    data: MessageWithSenderDto
    position?: MessagePosition
  }): Message {
    return {
      id: data.id,
      content: data.content,
      messageType: data.messageType,
      senderId: data.senderId ?? null,
      senderName: data.senderName ?? null,
      senderAvatar: data.senderAvatar ?? null,
      extra: data.extra ?? undefined,
      conversationId: data.conversationId ?? null,
      replyToMessageId: data.replyToMessageId ?? undefined,
      createdAt:
        typeof data.createdAt === 'string'
          ? data.createdAt
          : String(data.createdAt),
      groupPosition: position,
    }
  }

  // Converts an array of GraphQL message DTOs to the local Message type with groupPosition
  static toMessageListWithSender({
    data,
  }: {
    data: MessageWithSenderDto[]
  }): Message[] {
    const reversedData = [...data].reverse()
    return reversedData.map((message, i, arr) => {
      const prev = arr[i - 1] && this.toMessageWithSender({ data: arr[i - 1] })
      const next = arr[i + 1] && this.toMessageWithSender({ data: arr[i + 1] })
      const current = this.toMessageWithSender({ data: message })

      const groupPosition = getGroupPosition(prev, current, next)

      return MessageData.toMessageWithSender({
        data: message,
        position: groupPosition,
      })
    })
  }

  static toMessageWithConversation({
    data,
    position = MessageGroupPosition.start,
  }: {
    data: MessageWithConversationDto
    position?: MessagePosition
  }): MessageWithConversation {
    return {
      id: data.id,
      content: data.content,
      messageType: data.messageType,
      senderId: data.senderId ?? null,
      extra: data.extra ?? undefined,
      conversationId: data.conversationId,
      replyToMessageId: data.replyToMessageId ?? undefined,
      createdAt:
        typeof data.createdAt === 'string'
          ? data.createdAt
          : String(data.createdAt),
      groupPosition: position,
      senderAvatar: data.senderAvatar!,
      senderName: data.senderName!,
      conversation: {
        id: data.conversation.id,
        title: data.conversation.title!,
        avatar: data.conversation.groupAvatar!,
        lastMessage: data.content || 'No messages yet',
        lastMessageTime:
          typeof data.createdAt === 'string'
            ? data.createdAt
            : String(data.createdAt),
        isRead: false,
        numberOfPaticipants: 0,
        isGroup: data.conversation.type === ConversationType.Group,
      },
    }
  }

  static fromMessageWithConversationToMessageWithSender({
    data,
  }: {
    data: MessageWithConversation
  }): MessageWithSenderDto {
    return {
      id: data.id,
      content: data.content,
      messageType: data.messageType,
      senderId: data.senderId ?? null,
      extra: typeof data.extra === 'string' ? JSON.parse(data.extra) : null,
      conversationId: data.conversationId!,
      replyToMessageId: data.replyToMessageId ?? null,
      createdAt: data.createdAt,
      senderAvatar: data.senderAvatar,
      senderName: data.senderName,
    }
  }

  static fromNewMessageSubscriptionToMessageWithSenderDTO({
    data,
  }: {
    data: MessageWithConversationDto
  }): MessageWithSenderDto {
    return {
      ...(data as MessageWithSenderDto),
      __typename: 'MessageWithSenderDTO',
    }
  }
}
