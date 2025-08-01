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
    data: conversationMessages,
    hasNextPage,
    loadMore,
  } = useConversationMessages({
    conversationId: conversationId!,
  })

  const { containerRef, sentinelRef } = useChatScrollManagement({
    conversationId: conversationId!,
    messages: conversationMessages,
    hasNextPage,
    loading,
    loadMore,
  })

  if (!conversationId) {
    return <span>Please select a conversation to view messages.</span>
  }

  const isEmptyConversation =
    !conversationMessages || conversationMessages.length === 0

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
      className="overflow-y-auto max-h-[calc(100vh-157px)] chat-window-scrollbar"
    >
      <div ref={sentinelRef} className="h-1" />
      {conversationMessages.map(
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
