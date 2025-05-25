import React from 'react'

export const ChatHead = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-between items-center">{children}</div>
}

export default ChatHead
