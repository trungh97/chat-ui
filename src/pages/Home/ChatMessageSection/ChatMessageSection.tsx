import { useAuth } from '@hooks/auth'
import { useConversationMessages, useSubscribeNewMessage } from '@hooks/message'
import React, { memo } from 'react'
import { useParams } from 'react-router-dom'
import { ChatMessage } from 'shared-ui'

export const ChatMessageSection = memo(() => {
  const { conversationId } = useParams()
  const { data } = useAuth()
  const currentUserId = data?.me.data?.id

  useSubscribeNewMessage()
  const { loading, data: conversationMessages } = useConversationMessages({
    conversationId: conversationId!,
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
    <div className="overflow-y-auto max-h-[calc(100vh-157px)] chat-window-scrollbar">
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
