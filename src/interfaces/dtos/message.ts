import { MessagePosition } from '@interfaces/types'
import { Conversation } from './conversation'

export interface Message {
  id: string
  content: string
  messageType: string
  senderId: string | null
  senderName?: string | null
  senderAvatar?: string | null
  extra?: string
  conversationId: string | null
  replyToMessageId?: string
  createdAt: string
  groupPosition: MessagePosition
}

export interface MessageWithConversation extends Message {
  conversation: Conversation
}