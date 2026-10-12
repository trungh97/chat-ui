import { MessageGroupPosition } from '@constants/enums'
import {
  ConversationType,
  MessageType,
  MessageWithConversationDto,
  MessageWithSenderDto,
} from '@generated/graphql'
import { getGroupPosition, getGroupPositions } from '@helpers/conversation'
import { Message, MessageWithConversation } from '@interfaces/dtos'
import { MessagePosition } from '@interfaces/types'
import { PendingMessage } from '@store/pendingMessage'

/** A message in the chat window: a saved message, or one of the user's pending messages. */
export type DisplayMessage = Message & {
  /** Set only for messages the server has not saved yet. */
  pendingStatus?: PendingMessage['status']
}

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
      clientMessageId: data.clientMessageId ?? null,
    }
  }

  /**
   * Appends the user's pending messages (oldest first) after the saved messages and recomputes
   * group positions. A pending message the saved list already contains is skipped.
   * @param messages Saved messages, oldest first
   */
  static withPendingMessages({
    messages,
    pendingMessages,
    currentUserId,
  }: {
    messages: Message[]
    pendingMessages: PendingMessage[]
    currentUserId: string
  }): DisplayMessage[] {
    const savedClientIds = new Set(
      messages.map(({ clientMessageId }) => clientMessageId).filter(Boolean),
    )
    const pending: DisplayMessage[] = pendingMessages
      .filter(({ clientMessageId }) => !savedClientIds.has(clientMessageId))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((message) => ({
        id: message.clientMessageId,
        clientMessageId: message.clientMessageId,
        content: message.content,
        messageType: MessageType.Text,
        senderId: currentUserId,
        senderName: null,
        senderAvatar: null,
        conversationId: message.conversationId,
        createdAt: message.createdAt,
        groupPosition: MessageGroupPosition.start,
        pendingStatus: message.status,
      }))

    if (pending.length === 0) return messages

    const combined = [...messages, ...pending]
    const positions = getGroupPositions(combined)
    return combined.map((message, i) => ({
      ...message,
      groupPosition: positions[i],
    }))
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
