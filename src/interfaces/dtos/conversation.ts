export interface Conversation {
  id: string
  /** The route that opens it. Defaults to `/<id>`; drafts open `/new/<userId>`. */
  path?: string
  title: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  isRead: boolean
  numberOfPaticipants: number
  isGroup: boolean
}
