export type ChatSummaryProps = {
  id: string
  /** The route that opens it. Defaults to `/<id>`; drafts open `/new/<userId>`. */
  path?: string
  title: string
  lastMessage: string
  lastMessageTime: string
  isRead: boolean
  avatar: string
}
