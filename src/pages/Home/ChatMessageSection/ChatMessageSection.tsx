import { gql } from '@apollo/client'
import { MessageDeliveryStatus } from '@constants/enums'
import { DisplayMessage, MessageData } from '@data/message'
import {
  ConversationType,
  DetailedParticipantFragmentDoc,
} from '@generated/graphql'
import { getMessageStatus, StatusParticipant } from '@helpers/messageStatus'
import { useAuth } from '@hooks/auth'
import { useChatScrollManagement } from '@hooks/common'
import { useConversationInCache } from '@hooks/conversations'
import {
  useConversationMessages,
  useHandleLastReceivedMessageSubscription,
  useSendMessage,
  useSubscribeNewMessage,
} from '@hooks/message'
import {
  useHandleLastSeenMessageSubscription,
  useMarkConversationSeen,
} from '@hooks/participant'
import { usePendingMessageStore } from '@store/pendingMessage'
import React, { memo, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ChatMessage, MessageStatus } from 'shared-ui'

const conversationParticipantsFragment = gql`
  fragment ConversationParticipants on ExtendConversationDTO {
    id
    type
    participants {
      ...detailedParticipant
    }
  }
  ${DetailedParticipantFragmentDoc}
`

const findLast = <T,>(items: T[], predicate: (item: T) => boolean) => {
  for (let i = items.length - 1; i >= 0; i--) {
    if (predicate(items[i])) return items[i]
  }
  return undefined
}

export const ChatMessageSection = memo(() => {
  const { conversationId } = useParams()
  const { data } = useAuth()
  const currentUserId = data?.me.data?.id

  useSubscribeNewMessage()
  useHandleLastReceivedMessageSubscription()
  useHandleLastSeenMessageSubscription()
  const { retry } = useSendMessage()
  const {
    loading,
    data: savedMessages,
    hasNextPage,
    loadMore,
  } = useConversationMessages({
    conversationId: conversationId!,
    limit: 20,
  })

  const { data: conversation } = useConversationInCache({
    conversationId: conversationId!,
    fragment: conversationParticipantsFragment,
    fragmentName: 'ConversationParticipants',
  })
  const participants = useMemo(
    () =>
      (conversation?.participants ?? []).flatMap(
        (participant): StatusParticipant[] =>
          participant?.userId
            ? [
                {
                  userId: participant.userId,
                  name: participant.name ?? '',
                  lastSeenMessageId: participant.lastSeenMessageId,
                  lastSeenMessageAt: participant.lastSeenMessageAt,
                  lastReceivedMessageId: participant.lastReceivedMessageId,
                  lastReceivedMessageAt: participant.lastReceivedMessageAt,
                },
              ]
            : [],
      ),
    [conversation?.participants],
  )
  const isGroup = conversation?.type === ConversationType.Group

  const pendingMessages = usePendingMessageStore.use.pendingMessages()
  const messages: DisplayMessage[] = useMemo(
    () =>
      MessageData.withPendingMessages({
        messages: savedMessages,
        pendingMessages: Object.values(pendingMessages).filter(
          (message) => message.conversationId === conversationId,
        ),
        currentUserId: currentUserId ?? '',
      }),
    [savedMessages, pendingMessages, conversationId, currentUserId],
  )

  const { containerRef, sentinelRef, isScrolledToBottom } =
    useChatScrollManagement({
      conversationId: conversationId!,
      messages,
      hasNextPage,
      loading,
      loadMore,
    })

  const latestOwnMessage = findLast(
    messages,
    (message) => !message.pendingStatus && message.senderId === currentUserId,
  )
  const latestIncomingMessage = findLast(
    messages,
    (message) => !message.pendingStatus && message.senderId !== currentUserId,
  )
  const latestOwnMessageStatus =
    latestOwnMessage && currentUserId
      ? getMessageStatus({
          message: latestOwnMessage,
          participants,
          currentUserId,
          isGroup,
        })
      : undefined

  useMarkConversationSeen({
    conversationId,
    latestIncomingMessage,
    myParticipant: participants.find(
      (participant) => participant.userId === currentUserId,
    ),
    isScrolledToBottom,
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

  const getStatusProps = (message: DisplayMessage) => {
    if (message.pendingStatus) {
      const status =
        message.pendingStatus === 'ERROR'
          ? MessageDeliveryStatus.ERROR
          : MessageDeliveryStatus.SENDING
      return {
        showStatus: true,
        status: MessageStatus[status],
        onRetry:
          message.pendingStatus === 'ERROR'
            ? () => retry(message.id)
            : undefined,
      }
    }

    // Only the latest saved message of the current user shows Sent/Delivered/Seen
    if (latestOwnMessageStatus && message.id === latestOwnMessage?.id) {
      return {
        showStatus: true,
        status: MessageStatus[latestOwnMessageStatus.status],
        statusText: latestOwnMessageStatus.text,
      }
    }

    return { showStatus: false }
  }

  return (
    <div
      ref={containerRef}
      className="chat-window-scrollbar max-h-[calc(100vh-205px)] overflow-y-auto"
    >
      <div ref={sentinelRef} className="h-1" />
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          avatarUrl={message.senderAvatar!}
          senderName={message.senderName!}
          message={message.content}
          timestamp={message.createdAt}
          isOnline
          type={message.senderId === currentUserId ? 'sent' : 'received'}
          groupPosition={message.groupPosition}
          {...getStatusProps(message)}
        />
      ))}
    </div>
  )
})

export default ChatMessageSection
