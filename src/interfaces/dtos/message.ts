import { MessagePosition } from '@interfaces/types'
import { Conversation } from './conversation'
import { MessageType } from '@generated/graphql'

export interface Message {
  id: string
  content: string
  messageType: MessageType
  senderId: string | null
  senderName?: string | null
  senderAvatar?: string | null
  extra?: string
  conversationId: string | null
  replyToMessageId?: string
  createdAt: string
  groupPosition: MessagePosition
}
export interface MessageWithSender extends Message {
  senderName: string | null
  senderAvatar: string | null
}

export interface MessageWithConversation extends MessageWithSender {
  conversation: Conversation
}
