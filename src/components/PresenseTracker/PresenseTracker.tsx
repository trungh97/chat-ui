import { useMeQuery, useUserPresenseSubscription } from '@generated/graphql'
import { useUserPresenceHeartbeat } from '@hooks/user'
import React, { useContext, useMemo } from 'react'

interface PresenseTrackerContextValue {
  isOnline: boolean
}

const PresenseTrackerContext = React.createContext<PresenseTrackerContextValue>(
  {
    isOnline: false,
  },
)

export const PresenseTrackerProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  console.log('presense tracker')
  const { data: meData } = useMeQuery({ fetchPolicy: 'cache-first' })
  const currentUserId = meData?.me?.data?.id

  useUserPresenceHeartbeat({ userId: currentUserId || '' })

  const { data: presenseData } = useUserPresenseSubscription()

  const value = useMemo(() => {
    return {
      isOnline: !!presenseData?.userPresence.data?.isOnline,
    }
  }, [presenseData])

  return (
    <PresenseTrackerContext.Provider value={value}>
      {children}
    </PresenseTrackerContext.Provider>
  )
}

export function useOnlineStatus() {
  const context = useContext(PresenseTrackerContext)
  if (context === undefined) {
    throw new Error(
      'useOnlineStatus must be used within an OnlineStatusProvider',
    )
  }
  return context
}

export default PresenseTrackerProvider
