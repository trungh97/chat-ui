import React from 'react'
import { Divider, MessageIcon, StarIcon, UserIcon } from 'shared-ui'

export const ChatTitle = () => {
  return (
    <div>
      <div className="block text-lg font-semibold text-ellipsis">
        Phoenix Baker
      </div>
      <div className="flex items-center text-xs font-medium">
        <StarIcon width={12} height={12} />
        <Divider orientation="vertical" color="#D5D7DA" className="mx-1" />

        <div className="flex items-center hover:cursor-pointer">
          <UserIcon width={12} height={12} />
          <span className="ml-1">10</span>
        </div>

        <Divider orientation="vertical" color="#D5D7DA" className="mx-1" />

        <div className="flex items-center hover:cursor-pointer">
          <MessageIcon style={{ transform: 'scale(0.5)' }} />
          <span className="ml-1">100</span>
        </div>

        <Divider orientation="vertical" color="#D5D7DA" className="mx-1" />
      </div>
    </div>
  )
}

export default ChatTitle
