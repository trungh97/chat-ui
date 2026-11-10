import { ConversationData } from '@data/conversation'
import { useInfiniteScroll } from '@hooks/common'
import { useMyLatestConversations } from '@hooks/conversations'
import { useDraftConversationStore } from '@store/draftConversation'
import React, { memo, useMemo } from 'react'
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

  const drafts = useDraftConversationStore.use.drafts()
  // Drafts come first, newest first.
  const draftItems = useMemo(
    () =>
      Object.values(drafts)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(ConversationData.fromDraft),
    [drafts],
  )

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasNextPage,
    loading,
  })

  const isEmpty = conversations.length === 0 && draftItems.length === 0

  if (isEmpty && !loading) {
    return <div>{t('chat.list.empty')}</div>
  }

  if (loading && isEmpty) {
    return (
      <ChatListWrapper>
        <ChatListLoading />
      </ChatListWrapper>
    )
  }

  return (
    <ChatListWrapper>
      {draftItems.map((draft) => (
        <ChatSummaryWrapper key={draft.id}>
          <ChatSummary data={draft} />
        </ChatSummaryWrapper>
      ))}
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
