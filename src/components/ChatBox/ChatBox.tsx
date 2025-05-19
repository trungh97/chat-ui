import React from 'react'
import { ChatList } from './ChatList'
import { ChatTools, SearchChat } from './ChatTools'

export const ChatBox = () => {
  return (
    <div className="flex flex-col h-full py-2 max-w-[20rem] max-sm:hidden">
      <ChatTools />
      <SearchChat />
      <ChatList />
    </div>
  )
}

export default ChatBox
