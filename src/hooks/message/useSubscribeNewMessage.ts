import { gql } from '@apollo/client'
import {
  ConversationType,
  useNewMessageAddedSubscription,
  useUpdateLastReceivedMessageMutation,
} from '@generated/graphql'
import { useAuth } from '@hooks/auth'
import {
  ConversationListField,
  moveConversationToTop,
  useAddConversationToList,
} from '@hooks/conversations/useAddConversationToList'
import {
  draftConversationKey,
  useDraftConversationStore,
} from '@store/draftConversation'
import { usePendingMessageStore } from '@store/pendingMessage'
import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * Subscribe to new messages and update the chat list from them.
 * @param options Optional: { skip?: boolean }
 */
export function useSubscribeNewMessage(options?: { skip?: boolean }) {
  const { data: meData } = useAuth()
  const currentUserId = meData?.me?.data?.id
  const { userId: draftUserId } = useParams()
  const navigate = useNavigate()
  const removeDraft = useDraftConversationStore.use.removeDraft()
  const movePendingMessage = usePendingMessageStore.use.movePendingMessage()
  const addConversationToList = useAddConversationToList()
  const [updateLastReceivedMessage] = useUpdateLastReceivedMessageMutation()

  // The handler runs later, so read the open draft from a ref rather than a stale closure.
  const openDraftUserIdRef = useRef(draftUserId)
  openDraftUserIdRef.current = draftUserId

  /**
   * A conversation the chat list doesn't have yet, such as a 1:1 someone just started with
   * this user. Load it as this user sees it (title, participants), and if it's the 1:1 with
   * a user this user has a draft for, replace the draft with it.
   */
  const addNewConversation = async (conversationId: string) => {
    const conversation = await addConversationToList(conversationId)
    if (!conversation || conversation.type !== ConversationType.Private) return

    const otherUserId = conversation.participants?.find(
      (participant) => participant?.userId !== currentUserId,
    )?.userId
    if (!otherUserId) return

    // Messages still pending in the draft (e.g. a failed first send) move to the
    // conversation, so they stay visible and a retry sends them there.
    const draftKey = draftConversationKey(otherUserId)
    Object.values(usePendingMessageStore.getState().pendingMessages)
      .filter((pending) => pending.conversationId === draftKey)
      .forEach((pending) =>
        movePendingMessage(pending.clientMessageId, conversationId),
      )

    // Open the conversation in place of the draft, then drop the draft.
    if (openDraftUserIdRef.current === otherUserId) {
      navigate(`/${conversationId}`, { replace: true })
    }
    removeDraft(otherUserId)
  }

  const { error } = useNewMessageAddedSubscription({
    skip: options?.skip,
    onData: ({ data: { data, error, loading }, client }) => {
      if (!data?.newMessageAdded || loading || error) return
      if (typeof data.newMessageAdded.conversationId !== 'string') return
      const { newMessageAdded } = data

      // Move the conversation to the top of the chat list if the list has it.
      let isInList = false
      client.cache.modify({
        fields: {
          getMyConversations(existingField, { readField }) {
            const existing = existingField as ConversationListField
            const existingItems = existing?.data?.items ?? []
            const target = existingItems.find(
              (ref) => readField('id', ref) === newMessageAdded.conversationId,
            )
            if (!target) return existing

            isInList = true
            return {
              ...existing,
              data: {
                ...existing?.data,
                items: moveConversationToTop(
                  existingItems,
                  target,
                  (item) => readField('id', item),
                  newMessageAdded.conversationId,
                ),
              },
            }
          },
        },
      })

      if (isInList) {
        client.cache.writeFragment({
          id: client.cache.identify({
            __typename: 'ExtendConversationDTO',
            id: newMessageAdded.conversationId,
          }),
          fragment: gql`
            fragment UpdateConversation on ExtendConversationDTO {
              lastMessageAt
              messages {
                id
                content
                createdAt
              }
            }
          `,
          data: {
            lastMessageAt: newMessageAdded.createdAt,
            messages: [
              {
                __typename: 'MessageDTO',
                id: newMessageAdded.id,
                content: newMessageAdded.content,
                createdAt: newMessageAdded.createdAt,
              },
            ],
          },
        })
      } else {
        addNewConversation(newMessageAdded.conversationId).catch(() => {
          // The chat list refetches on reconnect, which picks the conversation up.
        })
      }

      if (currentUserId === newMessageAdded.senderId) return

      // Tell the server this user has received the message. It resolves the user's own
      // participant from the session.
      updateLastReceivedMessage({
        variables: {
          conversationId: newMessageAdded.conversationId,
          messageId: newMessageAdded.id,
        },
      }).catch(() => {
        // Best effort: the batch sync on reconnect catches up missed updates.
      })
    },
  })

  return { error }
}
