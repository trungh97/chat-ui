import React, { memo } from 'react'

export const ChatListWrapper = memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="chatlist-scrollbar ml-2 flex h-full flex-1 flex-col overflow-y-auto pr-2">
        {children}
      </div>
    )
  },
)

export default ChatListWrapper
