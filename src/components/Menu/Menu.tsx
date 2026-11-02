import React, { Fragment, ReactNode, useState } from 'react'
import type { MenuItem, MenuPanelItem, MenuSubmenuItem } from './types'

export type MenuProps = {
  items: MenuItem[]
  ariaLabel?: string
  className?: string
}

type OpenableItem = MenuSubmenuItem | MenuPanelItem

type Column = {
  key: string
  role: 'menu' | 'dialog'
  ariaLabel?: string
  content: ReactNode
}

const ITEM_CLASS =
  'flex w-full items-center justify-between gap-x-3 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50'

const isOpenable = (item: MenuItem): item is OpenableItem =>
  item.type === 'submenu' || item.type === 'panel'

/**
 * Renders `items` as a menu, with a divider between top-level items. Submenu and panel items open another column to the right;
 * `openPath` holds the key of the open item at each level.
 */
export const Menu = ({ items, ariaLabel, className = '' }: MenuProps) => {
  const [openPath, setOpenPath] = useState<string[]>([])

  const toggle = (level: number, key: string) =>
    setOpenPath((path) =>
      path[level] === key
        ? path.slice(0, level)
        : [...path.slice(0, level), key],
    )

  const renderItem = (item: MenuItem, level: number) => {
    const icon = item.icon && <span aria-hidden="true">{item.icon}</span>

    if (isOpenable(item)) {
      const isOpen = openPath[level] === item.key

      return (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          aria-haspopup={item.type === 'submenu' ? 'menu' : 'dialog'}
          aria-expanded={isOpen}
          disabled={item.disabled}
          onClick={() => toggle(level, item.key)}
          className={`${ITEM_CLASS} ${isOpen ? 'bg-brand-100' : ''}`}
        >
          <span className="flex items-center gap-x-2">
            {icon}
            {item.label}
          </span>
          <span aria-hidden="true">›</span>
        </button>
      )
    }

    const isRadio = item.checked !== undefined

    return (
      <button
        key={item.key}
        type="button"
        role={isRadio ? 'menuitemradio' : 'menuitem'}
        aria-checked={isRadio ? item.checked : undefined}
        disabled={item.disabled}
        onClick={item.onSelect}
        className={`${ITEM_CLASS} ${item.checked ? 'font-medium text-brand-600' : ''}`}
      >
        <span className="flex items-center gap-x-2">
          {icon}
          {item.label}
        </span>
        {isRadio && (
          <span aria-hidden="true" className={item.checked ? '' : 'invisible'}>
            ✓
          </span>
        )}
      </button>
    )
  }

  // Top-level items are separated by dividers; sub-menu lists stay compact.
  const renderItems = (levelItems: MenuItem[], level: number) =>
    levelItems.map((item, index) => (
      <Fragment key={item.key}>
        {level === 0 && index > 0 && (
          <hr role="separator" className="my-1 border-gray-200" />
        )}
        {renderItem(item, level)}
      </Fragment>
    ))

  const columns: Column[] = [
    { key: 'root', role: 'menu', ariaLabel, content: renderItems(items, 0) },
  ]
  let levelItems = items
  for (let level = 0; level < openPath.length; level++) {
    const open = levelItems.find(
      (item): item is OpenableItem =>
        isOpenable(item) && item.key === openPath[level],
    )
    if (!open) break

    if (open.type === 'panel') {
      columns.push({
        key: open.key,
        role: 'dialog',
        ariaLabel: open.ariaLabel,
        content: open.render(),
      })
      break
    }

    columns.push({
      key: open.key,
      role: 'menu',
      ariaLabel: open.ariaLabel,
      content: renderItems(open.children, level + 1),
    })
    levelItems = open.children
  }

  return (
    <div className={`flex ${className}`}>
      {columns.map((column, index) => (
        <div
          key={column.key}
          role={column.role}
          aria-label={column.ariaLabel}
          className={`flex flex-col ${
            index > 0 ? 'ml-2 border-l border-gray-200 pl-2' : ''
          }`}
        >
          {column.content}
        </div>
      ))}
    </div>
  )
}

export default Menu
