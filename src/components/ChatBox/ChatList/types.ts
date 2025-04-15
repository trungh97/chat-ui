import { ReactElement } from 'react'

export type ChatSummaryProps = {
  id: string
  title: string
  lastMessage: string
  status: ReactElement
  lastMessageTime: string
  isRead: boolean
  avatar: string
}
