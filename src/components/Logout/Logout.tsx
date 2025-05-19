import { MyAvatar } from '@components/UserAvatar/MyAvatar'
import { useLogout } from '@hooks/auth'
import React from 'react'
import { Button, Popover } from 'shared-ui'

export const Logout = () => {
  const { onLogout, loading } = useLogout()

  return (
    <Popover
      content={
        <Button
          label="Logout"
          intent="secondary"
          onClick={onLogout}
          disabled={loading}
        />
      }
      placement="right"
      trigger="click"
    >
      <div className="hover:cursor-pointer">
        <MyAvatar />
      </div>
    </Popover>
  )
}

export default Logout
