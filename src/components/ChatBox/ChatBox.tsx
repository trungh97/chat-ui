import React from 'react'
import { AddNewChat, FilterChat, SearchChat } from './ChatTools'
import { useGetMyLatestConversationsQuery } from '@generated/graphql'
import { ChatList } from './ChatList'

export const ChatBox = () => {
  const { data, error, loading } = useGetMyLatestConversationsQuery({
    variables: {
      options: {
        cursor: null,
        limit: 10,
      },
    },
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
  if (!data)
    return (
      <div className="flex justify-center items-center h-full">No data</div>
    )
  if (!data.getMyConversations.data?.length)
    return (
      <div className="flex justify-center items-center h-full">
        No conversations
      </div>
    )

  if (data.getMyConversations.data.length === 0)
    return (
      <div className="flex justify-center items-center h-full">
        No conversations
      </div>
    )

  // const conversations = data.getMyConversations.data.map((conversation) => ({
  //   id: conversation.id,
  //   title: conversation.title,
  //   status: 'active',
  //   isRead: false,
  //   avatar: conversation.
  // }))

  return (
    <div className="flex flex-col h-full px-[1.5rem] py-[2rem]">
      <div className="flex items-center justify-between">
        <h3 className="text- [1.25rem] font-bold">Chats</h3>
        <div className="flex flex-row gap-4 gap-x-1">
          <AddNewChat />
          <FilterChat />
        </div>
      </div>
      <div className="my-6">
        <SearchChat />
      </div>
      {/* TODO: Replace with chat list */}
      <ChatList data={[]} />
    </div>
  )
}

export default ChatBox
