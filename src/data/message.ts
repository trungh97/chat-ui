import { MessageWithSenderDto } from '@generated/graphql'
import { getGroupPosition } from '@helpers/conversation'
import { Message } from '@interfaces/dtos'
import { MessageGroupPosition } from '@interfaces/types'

export class MessageData {
  // Converts a GraphQL message DTO (e.g., from Apollo codegen) to the local Message type
  static toMessage(
    dto: MessageWithSenderDto,
    groupPosition: MessageGroupPosition = undefined,
  ): Message {
    return {
      id: dto.id,
      content: dto.content,
      messageType: dto.messageType,
      senderId: dto.senderId ?? null,
      senderName: dto.senderName ?? null,
      senderAvatar: dto.senderAvatar ?? null,
      extra: dto.extra ?? undefined,
      conversationId: dto.conversationId ?? null,
      replyToMessageId: dto.replyToMessageId ?? undefined,
      createdAt:
        typeof dto.createdAt === 'string'
          ? dto.createdAt
          : String(dto.createdAt),
      groupPosition,
    }
  }

  // Converts an array of GraphQL message DTOs to the local Message type with groupPosition
  static toMessageList(dtos: MessageWithSenderDto[]): Message[] {
    const reversedDtos = [...dtos].reverse()
    return reversedDtos.map((message, i, arr) => {
      const prev = arr[i - 1] && this.toMessage(arr[i - 1])
      const next = arr[i + 1] && this.toMessage(arr[i + 1])
      const current = this.toMessage(message)

      const groupPosition = getGroupPosition(prev, current, next)

      return MessageData.toMessage(message, groupPosition)
    })
  }
}
