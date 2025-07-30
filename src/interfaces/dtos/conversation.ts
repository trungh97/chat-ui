export interface Conversation {
  id: string
  title: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  isRead: boolean
  numberOfPaticipants: number
  isGroup: boolean
}
