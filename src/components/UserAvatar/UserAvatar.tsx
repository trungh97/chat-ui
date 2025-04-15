import React from 'react'
import { Avatar, NameAvatar } from 'shared-ui'

type UserAvatarProps = {
  avatarURL?: string
  firstName?: string
  lastName?: string
}

export const UserAvatar = ({
  avatarURL,
  firstName,
  lastName,
}: UserAvatarProps) => {
  if (avatarURL) {
    return <Avatar imageUrl={avatarURL} />
  }

  return <NameAvatar firstName={firstName!} lastName={lastName!} />
}

export default UserAvatar
