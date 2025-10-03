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

      payload.forEach(({ participantId, messageId }) => {
        client.cache.writeFragment({
          id: client.cache.identify({
            __typename: 'DetailedParticipantDTO',
            id: participantId,
          }),
          fragment: gql`
            fragment UpdateLastReceivedMessageToParticipant on DetailedParticipantDTO {
              lastReceivedMessageId
            }
          `,
          data: {
            lastReceivedMessageId: messageId,
          },
        })
      })
    },
  })
}
