import React, { memo } from 'react'
import { ChatSummaryWrapper } from './ChatSummary'
import { Skeleton } from 'shared-ui'

export const SkeletonList = memo(({ length }: { length: number }) => {
  return Array.from({ length }).map((_, index) => (
    <ChatSummaryWrapper key={index}>
      <Skeleton title={false} avatar loading key={index} />
    </ChatSummaryWrapper>
  ))
})

export const ChatListLoading = memo(() => {
  return <SkeletonList length={15} />
})

export default ChatListLoading
