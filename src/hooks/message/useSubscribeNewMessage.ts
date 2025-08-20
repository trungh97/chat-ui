import { gql } from '@apollo/client'
import { ConversationData } from '@data/conversation'
import { useNewMessageAddedSubscription } from '@generated/graphql'

/**
 * Subscribe to new messages and update the store based on the message's conversationId.
 * @param options Optional: { skip?: boolean, onData?: (data) => void }
 */
export function useSubscribeNewMessage(options?: {
  skip?: boolean
  onData?: (data: any) => void
}) {
  const { error } = useNewMessageAddedSubscription({
    skip: options?.skip,
    onData: ({ data: { data, error, loading }, client }) => {
      if (data && data.newMessageAdded && !loading && !error) {
        if (typeof data.newMessageAdded.conversationId !== 'string') return
        const { newMessageAdded } = data

        client.cache.modify({
          fields: {
            getMyConversations(existing = [], { readField }) {
              const existingItems = existing.data.items || []
              // 1. Find if the conversation exists in the cache
              const idx = existingItems.findIndex((ref: any) => {
                return readField('id', ref) === newMessageAdded.conversationId
              })

              // 2. If found, remove it from the current list
              let updated = [...existingItems]
              let target
              if (idx !== -1) {
                target = updated.splice(idx, 1)[0]
              } else {
                // If not found, add it to the beginning
                target =
                  ConversationData.fromMessageWithConversationDTOToExtendedConversationDTO(
                    {
                      data: newMessageAdded,
                    },
                  )
              }

              // 3. Put it all at the beginning
              return {
                ...existing,
                data: {
                  ...existing.data,
                  items: [target, ...updated],
                },
              }
            },
          },
        })

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
      }
    },
  })

  return { error }
}
