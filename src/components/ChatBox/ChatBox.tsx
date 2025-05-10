import { useMyLatestConversations } from '@hooks/useMyLatestConversations'
import React from 'react'
import { ChatList } from './ChatList'
import { AddNewChat, FilterChat, SearchChat } from './ChatTools'

export const ChatBox = () => {
  const { conversations, loading, error } = useMyLatestConversations({
    cursor: null,
  })

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        Error: {error.message}
      </div>
    )

  if (!conversations)
    return (
      <div className="flex justify-center items-center h-full">No data</div>
    )

  if (!conversations.length)
    return (
      <div className="flex justify-center items-center h-full">
        No conversations
      </div>
    )

  return (
    <div className="flex flex-col h-full py-[2rem] max-w-[20rem] max-sm:hidden">
      {/* Chat Title and Tools */}
      <div className="flex items-center justify-between px-[1.5rem]">
        <h3 className="text-[1.5rem] font-bold">Chats</h3>
        <div className="flex flex-row gap-4 gap-x-1">
          <AddNewChat />
          <FilterChat />
        </div>
      </div>

      {/* Search Bar */}
      <div className="my-6 px-[1.5rem]">
        <SearchChat />
      </div>

      {/* Chat List */}
      <ChatList data={conversations} />
    </div>
  )
}

export default ChatBox
