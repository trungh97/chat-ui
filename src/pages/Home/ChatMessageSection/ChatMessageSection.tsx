import { gql } from '@apollo/client'
import { MessageDeliveryStatus } from '@constants/enums'
import { DisplayMessage, MessageData } from '@data/message'
import {
  ConversationType,
  DetailedParticipantFragmentDoc,
} from '@generated/graphql'
import { getMessageStatus, StatusParticipant } from '@helpers/messageStatus'
import { useAuth } from '@hooks/auth'
import { useChatScrollManagement, useLanguage } from '@hooks/common'
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
import {
  draftConversationKey,
  useDraftConversationStore,
} from '@store/draftConversation'
import { usePendingMessageStore } from '@store/pendingMessage'
import React, { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { conversationId, userId: draftUserId } = useParams()
  const draft = useDraftConversationStore.use.drafts()[draftUserId ?? '']
  // Pending messages of a draft are keyed by the draft until the server creates it.
  const viewKey =
    conversationId ?? (draft ? draftConversationKey(draft.userId) : undefined)
  const { data } = useAuth()
  const currentUserId = data?.me.data?.id
  const { t } = useTranslation()
  const { dateLocale } = useLanguage()

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
    conversationId: conversationId ?? '',
    limit: 20,
    skip: !conversationId,
  })

  const { data: conversation } = useConversationInCache({
    conversationId: conversationId ?? '',
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
  const removePendingMessage = usePendingMessageStore.use.removePendingMessage()
  const messages: DisplayMessage[] = useMemo(
    () =>
      MessageData.withPendingMessages({
        messages: savedMessages,
        pendingMessages: Object.values(pendingMessages).filter(
          (message) => message.conversationId === viewKey,
        ),
        currentUserId: currentUserId ?? '',
      }),
    [savedMessages, pendingMessages, viewKey, currentUserId],
  )

  // A draft's first message stays pending after it's saved, so it shows while the new
  // conversation's messages load. Drop it once the loaded list has it.
  useEffect(() => {
    const savedClientIds = new Set(
      savedMessages.map(({ clientMessageId }) => clientMessageId),
    )
    Object.values(pendingMessages).forEach(({ clientMessageId }) => {
      if (savedClientIds.has(clientMessageId)) {
        removePendingMessage(clientMessageId)
      }
    })
  }, [savedMessages, pendingMessages, removePendingMessage])

  const { containerRef, sentinelRef, isScrolledToBottom } =
    useChatScrollManagement({
      conversationId: viewKey ?? '',
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
          t,
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

  if (!viewKey) {
    return <span>{t('chat.window.selectConversation')}</span>
  }

  const isEmptyConversation = !messages || messages.length === 0

  if (isEmptyConversation) {
    if (draft) {
      return <div>{t('chat.window.draftEmpty', { name: draft.name })}</div>
    }

    return loading ? (
      <div>{t('common.loading')}</div>
    ) : (
      <div>{t('chat.window.empty')}</div>
    )
  }

  const getStatusProps = (message: DisplayMessage) => {
    if (message.pendingStatus) {
      const isError = message.pendingStatus === 'ERROR'
      const status = isError
        ? MessageDeliveryStatus.ERROR
        : MessageDeliveryStatus.SENDING
      return {
        showStatus: true,
        status: MessageStatus[status],
        statusText: t(
          isError ? 'message.status.error' : 'message.status.sending',
        ),
        onRetry: isError ? () => retry(message.id) : undefined,
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
          selfLabel={t('message.you')}
          retryLabel={t('message.retry')}
          locale={dateLocale}
          {...getStatusProps(message)}
        />
      ))}
    </div>
  )
})

export default ChatMessageSection
