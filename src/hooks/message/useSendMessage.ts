import { Reference } from '@apollo/client'
import {
  MessageCreateMutationRequest,
  MessageType,
  MessageWithSenderFragmentDoc,
  useCreateMessageMutation,
} from '@generated/graphql'
import { createClientMessageId } from '@helpers/clientMessageId'
import { isFirstMessagePageOf } from '@helpers/messageCache'
import { useAddConversationToList } from '@hooks/conversations/useAddConversationToList'
import {
  draftConversationKey,
  draftUserIdFromKey,
  useDraftConversationStore,
} from '@store/draftConversation'
import { PendingMessage, usePendingMessageStore } from '@store/pendingMessage'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

type MessageListField = {
  data?: { items?: Reference[] } | null
} | null

/** The create request for a pending message. A draft's first message names the recipient. */
const toCreateRequest = (
  pending: PendingMessage,
): MessageCreateMutationRequest => {
  const recipientId = draftUserIdFromKey(pending.conversationId)
  const common = {
    content: pending.content,
    messageType: MessageType.Text,
    clientMessageId: pending.clientMessageId,
  }

  return recipientId
    ? { ...common, receivers: [recipientId] }
    : { ...common, conversationId: pending.conversationId }
}

export const useSendMessage = () => {
  const { conversationId, userId: draftUserId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  // Read the current path after the await, so a user who left the draft isn't moved back.
  const pathnameRef = useRef(location.pathname)
  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  const [value, setValue] = useState('')
  const [createMessageMutation] = useCreateMessageMutation()
  const addPendingMessage = usePendingMessageStore.use.addPendingMessage()
  const setPendingMessageStatus =
    usePendingMessageStore.use.setPendingMessageStatus()
  const movePendingMessage = usePendingMessageStore.use.movePendingMessage()
  const removePendingMessage = usePendingMessageStore.use.removePendingMessage()
  const removeDraft = useDraftConversationStore.use.removeDraft()
  const addConversationToList = useAddConversationToList()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    event,
  ) => {
    setValue(event.target.value)
  }

  /**
   * The draft's first message created the conversation: show the message under the real
   * conversation, drop the draft, put the conversation at the top of the chat list and
   * open it in place of the draft.
   */
  const finishDraft = useCallback(
    async (pending: PendingMessage, recipientId: string, newId: string) => {
      // Keep the message on screen until the conversation's own message list loads it.
      movePendingMessage(pending.clientMessageId, newId)

      // Open the conversation in place of the draft, then drop the draft. `useDraftRoute`
      // keeps the draft route from redirecting home in between.
      if (pathnameRef.current === `/new/${recipientId}`) {
        navigate(`/${newId}`, { replace: true })
      }
      removeDraft(recipientId)

      try {
        await addConversationToList(newId)
      } catch {
        // The chat list refetches on reconnect; opening the conversation still works.
      }
    },
    [addConversationToList, movePendingMessage, navigate, removeDraft],
  )

  const sendPendingMessage = useCallback(
    async (pending: PendingMessage) => {
      try {
        const { data } = await createMessageMutation({
          variables: { request: toCreateRequest(pending) },
          update: (cache, { data }) => {
            const message = data?.createMessage.data
            if (!message) return

            // Add the saved message to the displayed message list. The new message subscription
            // may have added it already, so skip duplicates.
            const messageRef = cache.writeFragment({
              data: message,
              fragment: MessageWithSenderFragmentDoc,
              fragmentName: 'messageWithSender',
            })

            cache.modify({
              fields: {
                getMessagesByConversationId(
                  existingField,
                  { storeFieldName, readField },
                ) {
                  const existing = existingField as MessageListField
                  if (
                    !messageRef ||
                    !existing?.data ||
                    !isFirstMessagePageOf(
                      storeFieldName,
                      message.conversationId,
                    )
                  ) {
                    return existing
                  }

                  const items = existing.data.items ?? []
                  if (
                    items.some((item) => readField('id', item) === message.id)
                  ) {
                    return existing
                  }

                  return {
                    ...existing,
                    data: { ...existing.data, items: [messageRef, ...items] },
                  }
                },
              },
            })
          },
        })

        const saved = data?.createMessage.data
        if (!saved || data.createMessage.error) {
          setPendingMessageStatus(pending.clientMessageId, 'ERROR')
          return
        }

        const recipientId = draftUserIdFromKey(pending.conversationId)
        if (recipientId) {
          await finishDraft(pending, recipientId, saved.conversationId)
          return
        }

        removePendingMessage(pending.clientMessageId)
      } catch {
        setPendingMessageStatus(pending.clientMessageId, 'ERROR')
      }
    },
    [
      createMessageMutation,
      finishDraft,
      removePendingMessage,
      setPendingMessageStatus,
    ],
  )

  const handleSubmit = async (value: string) => {
    const targetId =
      conversationId ??
      (draftUserId ? draftConversationKey(draftUserId) : undefined)
    if (!targetId || !value.trim()) return

    const pending: PendingMessage = {
      clientMessageId: createClientMessageId(),
      conversationId: targetId,
      content: value,
      createdAt: new Date().toISOString(),
      status: 'SENDING',
    }

    addPendingMessage(pending)
    setValue('')
    await sendPendingMessage(pending)
  }

  /** Re-sends a failed message with the same client id, so the server never saves it twice. */
  const retry = useCallback(
    async (clientMessageId: string) => {
      const pending =
        usePendingMessageStore.getState().pendingMessages[clientMessageId]
      if (!pending || pending.status !== 'ERROR') return

      setPendingMessageStatus(clientMessageId, 'SENDING')
      await sendPendingMessage(pending)
    },
    [sendPendingMessage, setPendingMessageStatus],
  )

  return {
    value,
    handleChange,
    handleSubmit,
    retry,
  }
}

export default useSendMessage
