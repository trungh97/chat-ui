import { useHeartbeatUserPresenceMutation } from '@generated/graphql'
import { useEffect, useRef } from 'react'

/**
 * Keeps the current user marked online. The server takes the user from the session, so
 * `userId` only says whether someone is logged in yet.
 */
export const useUserPresenceHeartbeat = ({ userId }: { userId: string }) => {
  const [heartbeat] = useHeartbeatUserPresenceMutation()
  const initialized = useRef(false)

  useEffect(() => {
    if (!userId) return
    if (initialized.current) return
    initialized.current = true

    // delay 10s before first heartbeat
    const startTimeout = setTimeout(() => {
      console.log('💗 first heartbeat')
      heartbeat()

      // send heartbeat every 15s
      const interval = setInterval(() => {
        console.log('💗 beat')
        heartbeat()
      }, 180000)

      // cleanup on unmount
      return () => clearInterval(interval)
    }, 10000)

    return () => clearTimeout(startTimeout)
  }, [heartbeat, userId])
}
