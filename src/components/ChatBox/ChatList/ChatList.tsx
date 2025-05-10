import React from 'react'
import { ChatSummaryProps } from './types'
import ChatSummary from './ChatSummary/ChatSummary'

export type ChatListProps = {
  data: ChatSummaryProps[]
}

export const ChatList = ({ data }: ChatListProps) => {
  if (!data || data.length === 0) {
    return <div>No chats available</div>
  }

  return (
    <div className="flex flex-col overflow-y-auto h-full flex-1">
      {data.map((chat) => (
        <div key={chat.id}>
          <ChatSummary data={chat} />
        </div>
      ))}
    </div>
  )
}

export default ChatList
