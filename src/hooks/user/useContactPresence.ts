import { useUserPresenseSubscription } from '@generated/graphql'
import { useEffect, useState } from 'react'

/**
 * Live online status, keyed by user id, for users whose status changed since the contact
 * list loaded. It overrides the `isOnline` snapshot from `searchUsers`. Cleared when skipped,
 * since a newly opened list loads a fresh snapshot.
 */
export const useContactPresence = ({
  skip = false,
}: { skip?: boolean } = {}) => {
  const [onlineByUserId, setOnlineByUserId] = useState<Record<string, boolean>>(
    {},
  )

  useEffect(() => {
    if (skip) setOnlineByUserId({})
  }, [skip])

  useUserPresenseSubscription({
    skip,
    onData: ({ data: { data } }) => {
      const presence = data?.userPresence.data
      if (!presence) return

      setOnlineByUserId((current) =>
        current[presence.userId] === presence.isOnline
          ? current
          : { ...current, [presence.userId]: presence.isOnline },
      )
    },
  })

  return onlineByUserId
}

export default useContactPresence
