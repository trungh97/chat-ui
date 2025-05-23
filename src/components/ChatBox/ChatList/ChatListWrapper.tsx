import React, { memo } from 'react'

export const ChatListWrapper = memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="flex flex-col pr-2 overflow-y-auto h-full flex-1 ml-2 chatlist-scrollbar">
        {children}
      </div>
    )
  },
)

export default ChatListWrapper
