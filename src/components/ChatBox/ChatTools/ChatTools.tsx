import React from 'react'
import { AddNewChat } from './AddNewChat'
import { FilterChat } from './FilterChat'

export const ChatTools = React.memo(() => {
  return (
    <div className="flex items-center justify-between px-[1.5rem]">
      <h3 className="text-[1.5rem] font-bold">Chats</h3>
      <div className="flex flex-row gap-4 gap-x-1">
        <AddNewChat />
        <FilterChat />
      </div>
    </div>
  )
})

export default ChatTools
