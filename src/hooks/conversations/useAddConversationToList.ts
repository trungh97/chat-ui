import { Reference, StoreObject, useApolloClient } from '@apollo/client'
import {
  ExtendConversationDto,
  GetConversationByIdDocument,
  GetConversationByIdQuery,
  GetConversationByIdQueryVariables,
} from '@generated/graphql'
import { useCallback } from 'react'

/** The cached `getMyConversations` field, as a `cache.modify` modifier sees it. */
export type ConversationListField = {
  data?: { items?: Reference[] } | null
} | null

/**
 * Returns the chat list items with `conversation` first, removing any other copy of it.
 * `readId` reads an item's id (the modifier's `readField('id', item)`).
 */
export const moveConversationToTop = (
  items: readonly Reference[],
  conversation: Reference,
  readId: (item: Reference) => unknown,
  conversationId: string,
): Reference[] => [
  conversation,
  ...items.filter((item) => readId(item) !== conversationId),
]

/**
 * Loads a conversation the chat list doesn't have yet (a new 1:1 conversation, or one
 * someone else just started with this user) and puts it at the top of the chat list.
 * Fetching it from the server gives the title and participants as this user sees them.
 * Resolves to the conversation, or `null` when it couldn't be loaded.
 */
export const useAddConversationToList = () => {
  const client = useApolloClient()

  return useCallback(
    async (conversationId: string): Promise<ExtendConversationDto | null> => {
      const { data } = await client.query<
        GetConversationByIdQuery,
        GetConversationByIdQueryVariables
      >({
        query: GetConversationByIdDocument,
        variables: { conversationId },
        fetchPolicy: 'network-only',
      })

      const conversation = data?.getConversationById.data
      if (!conversation) return null

      client.cache.modify({
        fields: {
          getMyConversations(existingField, { readField, toReference }) {
            const existing = existingField as ConversationListField
            const ref = toReference(conversation as StoreObject)
            if (!existing?.data || !ref) return existing

            return {
              ...existing,
              data: {
                ...existing.data,
                items: moveConversationToTop(
                  existing.data.items ?? [],
                  ref,
                  (item) => readField('id', item),
                  conversationId,
                ),
              },
            }
          },
        },
      })

      return conversation
    },
    [client],
  )
}

export default useAddConversationToList
