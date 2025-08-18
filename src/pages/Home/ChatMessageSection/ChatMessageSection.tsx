import { useAuth } from '@hooks/auth'
import { useChatScrollManagement } from '@hooks/common'
import { useConversationMessages, useSubscribeNewMessage } from '@hooks/message'
import React, { memo } from 'react'
import { useParams } from 'react-router-dom'
import { ChatMessage } from 'shared-ui'

export const ChatMessageSection = memo(() => {
  const { conversationId } = useParams()
  const { data } = useAuth()
  const currentUserId = data?.me.data?.id

  useSubscribeNewMessage()
  const {
    loading,
    data: messages,
    hasNextPage,
    loadMore,
  } = useConversationMessages({
    conversationId: conversationId!,
    limit: 20,
  })

  const { containerRef, sentinelRef } = useChatScrollManagement({
    conversationId: conversationId!,
    messages,
    hasNextPage,
    loading,
    loadMore,
  })

  if (!conversationId) {
    return <span>Please select a conversation to view messages.</span>
  }

  const isEmptyConversation = !messages || messages.length === 0

  if (isEmptyConversation) {
    return loading ? (
      <div>Loading...</div>
    ) : (
      <div>No messages available for this conversation.</div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="chat-window-scrollbar max-h-[calc(100vh-205px)] overflow-y-auto"
    >
      <div ref={sentinelRef} className="h-1" />
      {messages.map(
        ({
          senderAvatar,
          id,
          senderName,
          content,
          createdAt,
          senderId,
          groupPosition,
        }) => (
          <ChatMessage
            key={id}
            avatarUrl={senderAvatar!}
            senderName={senderName!}
            message={content}
            timestamp={createdAt}
            isOnline
            type={senderId === currentUserId ? 'sent' : 'received'}
            groupPosition={groupPosition}
          />
        ),
      )}
    </div>
  )
})

export default ChatMessageSection
