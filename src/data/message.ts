import { MessageDto } from '@generated/graphql'
import { Message } from '../types'

export class MessageData {
  // Converts a GraphQL message DTO (e.g., from Apollo codegen) to the local Message type
  static toMessage(dto: MessageDto): Message {
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
    }
  }
}
