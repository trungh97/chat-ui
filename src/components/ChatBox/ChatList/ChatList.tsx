import React from 'react'
import { ChatSummaryProps } from './types'
import ChatSummary from './ChatSummary/ChatSummary'

export type ChatListProps = {
  data: ChatSummaryProps[]
}

export const ChatList = ({ data }: ChatListProps) => {
  // if (!data || data.length === 0) {
  //   return <div>No chats available</div>
  // }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full">
      {[...Array(10)].map((chat, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
        >
          <ChatSummary data={chat} />
        </div>
      ))}
    </div>
  )
}

export default ChatList
