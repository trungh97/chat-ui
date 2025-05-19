import { useMyLatestConversations } from '@hooks/conversations'
import useConversationListStore from '@store/conversations'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import ChatSummary from './ChatSummary/ChatSummary'
import { ChatSummaryProps } from './types'

export type ChatListProps = {
  data: ChatSummaryProps[]
}

export const ChatList = memo(() => {
  const conversations = useConversationListStore.use.conversations()

  const { loadMore, hasNextPage, loading } = useMyLatestConversations({
    cursor: null,
    limit: 15,
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (entry.isIntersecting && hasNextPage && !loading) {
        loadMore()
      }
    },
    [hasNextPage, loadMore, loading],
  )

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 1.0,
    })

    const node = sentinelRef.current
    if (node) observerRef.current.observe(node)

    return () => {
      if (observerRef.current && node) {
        observerRef.current.unobserve(node)
      }
    }
  }, [handleIntersect])

  if ((!conversations || conversations.length === 0) && !loading) {
    return <div>No chats available</div>
  }

  if (loading && conversations.length === 0) {
    return (
      <div className="text-center py-2 text-sm text-gray-500">
        Loading chats...
      </div>
    )
  }

  return (
    <div className="flex flex-col pr-2 overflow-y-auto h-full flex-1 ml-2 chatlist-scrollbar">
      {conversations.map((chat) => (
        <ChatSummary key={chat.id} data={chat} />
      ))}

      <div ref={sentinelRef} className="h-1" />

      {loading && (
        <div className="text-center py-2 text-sm text-gray-500">
          Loading more...
        </div>
      )}
    </div>
  )
})

export default ChatList
