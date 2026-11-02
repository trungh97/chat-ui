import { Menu, MenuItem } from '@components/Menu'
import { useLogoutMenuItem } from '@hooks/auth'
import { useLanguageMenuItem } from '@hooks/common'
import React from 'react'

/** Avatar popover menu. Add a feature by writing a `use<Feature>MenuItem` hook and listing it here. */
export const UserMenu = () => {
  const items: MenuItem[] = [useLanguageMenuItem(), useLogoutMenuItem()]

  return <Menu items={items} />
}

export default UserMenu
