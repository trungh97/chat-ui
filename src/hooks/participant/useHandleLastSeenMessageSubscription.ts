import { gql } from '@apollo/client'
import { useUpdateLastSeenMessageSubscriptionSubscription } from '@generated/graphql'

/**
 * Keeps participants' last seen message in the Apollo cache up to date, so message statuses
 * ("Seen", "Seen by …") update in real time.
 */
export function useHandleLastSeenMessageSubscription() {
  useUpdateLastSeenMessageSubscriptionSubscription({
    onData: ({ data, client }) => {
      const payload = data?.data?.updateLastSeenMessageSubscription
      if (!payload) return

      const { participantId, messageId, messageCreatedAt, lastSeenAt } = payload

      client.cache.writeFragment({
        id: client.cache.identify({
          __typename: 'DetailedParticipantDTO',
          id: participantId,
        }),
        fragment: gql`
          fragment UpdateLastSeenMessageToParticipant on DetailedParticipantDTO {
            lastSeenMessageId
            lastSeenMessageAt
            lastSeenAt
          }
        `,
        data: {
          lastSeenMessageId: messageId,
          lastSeenMessageAt: messageCreatedAt,
          lastSeenAt,
        },
      })
    },
  })
}
