import React, { memo } from 'react'
import { ChatList } from './ChatList'
import { ChatTools, SearchChat } from './ChatTools'

export const ChatBox = memo(() => {
  return (
    <div className="flex h-full max-w-[20rem] flex-col py-2 max-sm:hidden">
      <ChatTools />
      <SearchChat />
      <ChatList />
    </div>
  )
})

export default ChatBox
