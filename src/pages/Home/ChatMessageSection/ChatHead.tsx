import React, { memo } from 'react'

export const ChatHead = memo(({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between">{children}</div>
})

export default ChatHead
