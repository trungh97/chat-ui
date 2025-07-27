import { useAuth } from '@hooks/auth'
import { useConversationMessages, useSubscribeNewMessage } from '@hooks/message'
import useMessageListStore from '@store/messages'
import React from 'react'
import { useParams } from 'react-router-dom'
import { ChatMessage } from 'shared-ui'

export const ChatMessageSection = () => {
  const { conversationId } = useParams()

  const { data } = useAuth()
  const currentUserId = data?.me?.data?.id

  if (!conversationId) {
    return <span>Please select a conversation to view messages.</span>
  }

  useSubscribeNewMessage()
  const { loading } = useConversationMessages({
    conversationId,
  })
  const messagesByConversation =
    useMessageListStore.use.messagesByConversation()
  const conversationMessages = messagesByConversation[conversationId] || []

  if (
    (!conversationMessages || conversationMessages.length === 0) &&
    !loading
  ) {
    return <div>No messages available for this conversation.</div>
  }

  if (conversationMessages.length === 0 && loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-157px)] chat-window-scrollbar">
      {conversationMessages.map(
        ({ senderAvatar, id, senderName, content, createdAt, senderId }) => (
          <ChatMessage
            key={id}
            avatarUrl={senderAvatar!}
            senderName={senderName!}
            message={content}
            timestamp={new Date(createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            isOnline
            type={senderId === currentUserId ? 'sent' : 'received'}
          />
        ),
      )}
    </div>
  )
}

export default ChatMessageSection
