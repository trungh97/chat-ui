import React, { memo } from 'react'

export const ChatSummaryWrapper = memo(
  ({ children }: { children: React.ReactNode }) => {
    return <div className="w-[290px]">{children}</div>
  },
)

export default ChatSummaryWrapper
