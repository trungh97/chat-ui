import { MyAvatar } from '@components/UserAvatar/MyAvatar'
import { useLogout } from '@hooks/auth'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Popover } from 'shared-ui'

export const Logout = () => {
  const { onLogout, loading } = useLogout()
  const { t } = useTranslation()

  return (
    <Popover
      content={
        <Button
          label={t('auth.logout')}
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
