import { MyAvatar } from '@components/UserAvatar/MyAvatar'
import React from 'react'
import { Popover } from 'shared-ui'
import { UserMenu } from './UserMenu'

/** The current user's avatar; clicking it opens the user menu. */
export const UserMenuPopover = () => {
  return (
    <Popover content={<UserMenu />} placement="right" trigger="click">
      <div className="hover:cursor-pointer">
        <MyAvatar />
      </div>
    </Popover>
  )
}

export default UserMenuPopover
