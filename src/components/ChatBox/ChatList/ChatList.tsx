import { useInfiniteScroll } from '@hooks/common'
import { useMyLatestConversations } from '@hooks/conversations'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from 'shared-ui'
import { ChatListLoading } from './ChatListLoading'
import { ChatListWrapper } from './ChatListWrapper'
import { ChatSummary, ChatSummaryWrapper } from './ChatSummary'
import { ChatSummaryProps } from './types'

export type ChatListProps = {
  data: ChatSummaryProps[]
}

export const ChatList = memo(() => {
  const { t } = useTranslation()
  const { conversations, loadMore, hasNextPage, loading, isFetchingMore } =
    useMyLatestConversations({
      cursor: null,
      limit: 15,
    })

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasNextPage,
    loading,
  })

  if ((!conversations || conversations.length === 0) && !loading) {
    return <div>{t('chat.list.empty')}</div>
  }

  if (loading && conversations.length === 0) {
    return (
      <ChatListWrapper>
        <ChatListLoading />
      </ChatListWrapper>
    )
  }

  return (
    <ChatListWrapper>
      {conversations.map((chat) => (
        <ChatSummaryWrapper key={chat.id}>
          <Skeleton title={false} avatar loading={loading} key={chat.id}>
            <ChatSummary key={chat.id} data={chat} />
          </Skeleton>
        </ChatSummaryWrapper>
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isFetchingMore && <ChatListLoading />}
    </ChatListWrapper>
  )
})

export default ChatList
