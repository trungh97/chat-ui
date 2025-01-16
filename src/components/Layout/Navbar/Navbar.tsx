import { Logo } from '@components/Icons'
import React from 'react'
import { Button, SampleIcon } from 'shared-ui'
import UserAvatar from './UserAvatar'

export const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 left-0 right-0 h-16 bg-brand-50 flex justify-between items-center px-4">
      <div className="flex items-center flex-row gap-x-4">
        <Logo />
        <Button
          icon={{
            content: <SampleIcon />,
            iconOnly: true,
          }}
        />
        <Button
          icon={{
            content: <SampleIcon />,
            iconOnly: true,
          }}
        />
        <Button
          icon={{
            content: <SampleIcon />,
            iconOnly: true,
          }}
        />
        <Button
          icon={{
            content: <SampleIcon />,
            iconOnly: true,
          }}
        />
        <Button
          icon={{
            content: <SampleIcon />,
            iconOnly: true,
          }}
        />
      </div>
      <div className="flex items-center">
        <UserAvatar />
      </div>
    </nav>
  )
}

export default Navbar
