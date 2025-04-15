import { useMeQuery } from '@generated/graphql'
import React from 'react'
import UserAvatar from '../UserAvatar'

export const MyAvatar = () => {
  const { data } = useMeQuery()

  if (!data) {
    return null
  }

  const avatar = data.me.data?.avatar
  const firstName = data.me.data?.firstName
  const lastName = data.me.data?.lastName

  return (
    <UserAvatar avatarURL={avatar} firstName={firstName} lastName={lastName} />
  )
}

export default MyAvatar
