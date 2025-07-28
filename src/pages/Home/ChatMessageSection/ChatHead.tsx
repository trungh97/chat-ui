import React, { memo } from 'react'

export const ChatHead = memo(({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-between items-center">{children}</div>
})

export default ChatHead
