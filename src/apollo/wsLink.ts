import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const reconnectListeners = new Set<() => void>()
let hasConnected = false

/**
 * Registers a listener called whenever the WebSocket reconnects after a drop, so data that
 * changed while disconnected (and whose events were missed) can be refetched.
 * @returns A function that removes the listener
 */
export const onWsReconnected = (listener: () => void) => {
  reconnectListeners.add(listener)
  return () => {
    reconnectListeners.delete(listener)
  }
}

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_WS_ENDPOINT || 'ws://localhost:4000/graphql',
    shouldRetry: () => true,
    connectionParams: async () => ({
      credentials: 'include',
    }),
    on: {
      connected: () => {
        if (hasConnected) {
          reconnectListeners.forEach((listener) => listener())
        }
        hasConnected = true
      },
    },
  }),
)

export default wsLink
