import { MyAvatar } from '@components/UserAvatar/MyAvatar'
import { MeDocument, MeQuery, useLogoutMutation } from '@generated/graphql'
import React from 'react'
import { Button, NameAvatar, Popover } from 'shared-ui'

export const QuickLaunch = () => {
  const [logout, { loading: logoutLoading }] = useLogoutMutation()

  const onLogout = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                statusCode: 401,
                message: 'User is not authenticated!',
                data: null,
                error: 'User is not authenticated!',
              },
            },
          })
        }
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-between px-1.5 py-12">
      <div className="flex flex-col items-center justify-center gap-y-4 px-4">
        <NameAvatar size="xl" firstName="John" lastName="Doe" />
        <NameAvatar size="xl" firstName="John" lastName="Doe" />
        <NameAvatar size="xl" firstName="John" lastName="Doe" />
      </div>
      <div>
        <Popover
          content={
            <Button
              label="Logout"
              intent='secondary'
              onClick={onLogout}
              disabled={logoutLoading}
            />
          }
          placement="right"
          trigger="click"
        >
          <div className='hover:cursor-pointer'>
            <MyAvatar />
          </div>
        </Popover>
      </div>
    </div>
  )
}

export default QuickLaunch
