import {
  PRESENCE_FIRST_HEARTBEAT_DELAY_MS,
  PRESENCE_HEARTBEAT_INTERVAL_MS,
} from '@constants/common'
import { useHeartbeatUserPresenceMutation } from '@generated/graphql'
import { useEffect } from 'react'

/**
 * Keeps the current user marked online. The server takes the user from the session, so
 * `userId` only says whether someone is logged in. Heartbeats stop when it is empty or the
 * component unmounts, and start again when a user logs in.
 */
export const useUserPresenceHeartbeat = ({ userId }: { userId: string }) => {
  // Nothing reads the mutation's result, so don't re-render the caller on every beat.
  const [heartbeat] = useHeartbeatUserPresenceMutation({ ignoreResults: true })

  useEffect(() => {
    if (!userId) return undefined

    // A failed heartbeat needs no handling: the next one tries again.
    const beat = () => {
      heartbeat().catch(() => undefined)
    }

    let interval: ReturnType<typeof setInterval> | undefined
    const startTimeout = setTimeout(() => {
      beat()
      interval = setInterval(beat, PRESENCE_HEARTBEAT_INTERVAL_MS)
    }, PRESENCE_FIRST_HEARTBEAT_DELAY_MS)

    return () => {
      clearTimeout(startTimeout)
      clearInterval(interval)
    }
  }, [heartbeat, userId])
}
