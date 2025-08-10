import { MessageGroupPosition } from '@constants/enums'
import { MessageWithSenderDto } from '@generated/graphql'
import { getGroupPosition } from '@helpers/conversation'
import { Message } from '@interfaces/dtos'
import { MessagePosition } from '@interfaces/types'

export class MessageData {
  // Converts a GraphQL message DTO (e.g., from Apollo codegen) to the local Message type
  static toMessage({
    data,
    position = MessageGroupPosition.START,
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
  static toMessageList({ data }: { data: MessageWithSenderDto[] }): Message[] {
    const reversedDtos = [...data].reverse()
    return reversedDtos.map((message, i, arr) => {
      const prev = arr[i - 1] && this.toMessage({ data: arr[i - 1] })
      const next = arr[i + 1] && this.toMessage({ data: arr[i + 1] })
      const current = this.toMessage({ data: message })

      const groupPosition = getGroupPosition(prev, current, next)

      return MessageData.toMessage({ data: message, position: groupPosition })
    })
  }
}
