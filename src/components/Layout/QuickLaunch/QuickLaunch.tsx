import { Logout } from '@components/Logout'
import React from 'react'
import { NameAvatar } from 'shared-ui'

export const QuickLaunch = () => {
  return (
    <div className="flex flex-col items-center justify-between px-1.5 py-12">
      <div className="flex flex-col items-center justify-center gap-y-4 px-4">
        <NameAvatar size="xl" firstName="John" lastName="Doe" />
        <NameAvatar size="xl" firstName="John" lastName="Doe" />
        <NameAvatar size="xl" firstName="John" lastName="Doe" />
      </div>
      <Logout />
    </div>
  )
}

export default QuickLaunch
