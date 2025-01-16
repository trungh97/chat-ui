import { useMeQuery } from '@generated/graphql'
import React from 'react'
import { Avatar, NameAvatar } from 'shared-ui'

const UserAvatar = () => {
  const { data } = useMeQuery()

  if (!data) {
    return null
  }

  const avatar = data.me.data?.avatar

  if (avatar) {
    return <Avatar imageUrl={avatar} />
  }

  return (
    <NameAvatar
      firstName={data.me.data?.firstName || ''}
      lastName={data.me.data?.lastName || ''}
    />
  )
}

export default UserAvatar
