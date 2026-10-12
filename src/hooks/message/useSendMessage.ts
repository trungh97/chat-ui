import { Reference } from '@apollo/client'
import {
  MessageType,
  MessageWithSenderFragmentDoc,
  useCreateMessageMutation,
} from '@generated/graphql'
import { createClientMessageId } from '@helpers/clientMessageId'
import { isFirstMessagePageOf } from '@helpers/messageCache'
import { PendingMessage, usePendingMessageStore } from '@store/pendingMessage'
import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

type MessageListField = {
  data?: { items?: Reference[] } | null
} | null

export const useSendMessage = () => {
  const { conversationId } = useParams()
  const [value, setValue] = useState('')
  const [createMessageMutation] = useCreateMessageMutation()
  const addPendingMessage = usePendingMessageStore.use.addPendingMessage()
  const setPendingMessageStatus =
    usePendingMessageStore.use.setPendingMessageStatus()
  const removePendingMessage = usePendingMessageStore.use.removePendingMessage()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    event,
  ) => {
    setValue(event.target.value)
  }

  const sendPendingMessage = useCallback(
    async (pending: PendingMessage) => {
      try {
        const { data } = await createMessageMutation({
          variables: {
            request: {
              conversationId: pending.conversationId,
              content: pending.content,
              messageType: MessageType.Text,
              clientMessageId: pending.clientMessageId,
            },
          },
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

        if (!data?.createMessage.data || data.createMessage.error) {
          setPendingMessageStatus(pending.clientMessageId, 'ERROR')
          return
        }

        removePendingMessage(pending.clientMessageId)
      } catch {
        setPendingMessageStatus(pending.clientMessageId, 'ERROR')
      }
    },
    [createMessageMutation, removePendingMessage, setPendingMessageStatus],
  )

  const handleSubmit = async (value: string) => {
    if (!conversationId || !value.trim()) return

    const pending: PendingMessage = {
      clientMessageId: createClientMessageId(),
      conversationId,
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
