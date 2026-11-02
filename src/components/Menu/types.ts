import type { ReactNode } from 'react'

type MenuItemBase = {
  key: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

/** A plain button. `checked` turns it into a radio item with a ✓. */
export type MenuActionItem = MenuItemBase & {
  type?: 'action'
  onSelect: () => void
  checked?: boolean
}

/** Opens a column with more items next to the current one. */
export type MenuSubmenuItem = MenuItemBase & {
  type: 'submenu'
  children: MenuItem[]
  ariaLabel?: string
}

/** Opens a column with arbitrary content, for items too complex to be a list. */
export type MenuPanelItem = MenuItemBase & {
  type: 'panel'
  render: () => ReactNode
  ariaLabel?: string
}

export type MenuItem = MenuActionItem | MenuSubmenuItem | MenuPanelItem
