import { gql } from '@apollo/client'
import { useUpdateLastReceivedMessageSubscriptionSubscription } from '@generated/graphql'

/**
 * Hook to handle last received message subscription and update Apollo cache.
 */
export function useHandleLastReceivedMessageSubscription() {
  useUpdateLastReceivedMessageSubscriptionSubscription({
    onData: ({ data, client }) => {
      const payload = data?.data?.updateLastReceivedMessageSubscription
      if (!payload) return

      client.cache.writeFragment({
        id: client.cache.identify({
          __typename: 'DetailedParticipantDTO',
          id: payload.participantId,
        }),
        fragment: gql`
          fragment UpdateLastReceivedMessageToParticipant on DetailedParticipantDTO {
            lastReceivedMessageId
          }
        `,
        data: {
          lastReceivedMessageId: payload.messageId,
        },
      })
    },
  })
}
