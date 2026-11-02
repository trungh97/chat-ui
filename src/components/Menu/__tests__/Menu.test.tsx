import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Menu } from '../Menu'
import { MenuItem } from '../types'

const openItem = (name: string) =>
  fireEvent.click(screen.getByRole('menuitem', { name: new RegExp(name) }))

describe('Menu', () => {
  it('renders actions with a divider between each and calls onSelect', () => {
    const onSelect = jest.fn()
    render(
      <Menu
        items={[
          { key: 'a', label: 'Profile', onSelect },
          { key: 'b', label: 'Status', onSelect: jest.fn() },
          { key: 'c', label: 'Logout', onSelect: jest.fn() },
        ]}
      />,
    )

    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(screen.getAllByRole('separator')).toHaveLength(2)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not call onSelect for a disabled item', () => {
    const onSelect = jest.fn()
    render(
      <Menu
        items={[{ key: 'a', label: 'Logout', onSelect, disabled: true }]}
      />,
    )

    const item = screen.getByRole('menuitem', { name: 'Logout' })
    expect(item).toBeDisabled()
    fireEvent.click(item)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('opens and closes a submenu with radio items', () => {
    render(
      <Menu
        items={[
          {
            key: 'size',
            type: 'submenu',
            label: 'Size',
            ariaLabel: 'Sizes',
            children: [
              { key: 's', label: 'Small', checked: true, onSelect: jest.fn() },
              { key: 'l', label: 'Large', checked: false, onSelect: jest.fn() },
            ],
          },
        ]}
      />,
    )

    const trigger = screen.getByRole('menuitem', { name: /Size/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('menu', { name: 'Sizes' }),
    ).not.toBeInTheDocument()

    openItem('Size')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu', { name: 'Sizes' })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitemradio', { name: /Small/ }),
    ).toHaveAttribute('aria-checked', 'true')
    expect(
      screen.getByRole('menuitemradio', { name: /Large/ }),
    ).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()

    openItem('Size')
    expect(
      screen.queryByRole('menu', { name: 'Sizes' }),
    ).not.toBeInTheDocument()
  })

  it('closes a sibling submenu when another one opens', () => {
    const items: MenuItem[] = [
      {
        key: 'one',
        type: 'submenu',
        label: 'One',
        ariaLabel: 'One list',
        children: [{ key: 'x', label: 'X', onSelect: jest.fn() }],
      },
      {
        key: 'two',
        type: 'submenu',
        label: 'Two',
        ariaLabel: 'Two list',
        children: [{ key: 'y', label: 'Y', onSelect: jest.fn() }],
      },
    ]
    render(<Menu items={items} />)

    openItem('One')
    openItem('Two')

    expect(
      screen.queryByRole('menu', { name: 'One list' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('menu', { name: 'Two list' })).toBeInTheDocument()
  })

  it('opens nested submenus as extra columns', () => {
    render(
      <Menu
        items={[
          {
            key: 'outer',
            type: 'submenu',
            label: 'Outer',
            children: [
              {
                key: 'inner',
                type: 'submenu',
                label: 'Inner',
                ariaLabel: 'Inner list',
                children: [{ key: 'deep', label: 'Deep', onSelect: jest.fn() }],
              },
            ],
          },
        ]}
      />,
    )

    openItem('Outer')
    openItem('Inner')

    expect(screen.getAllByRole('menu')).toHaveLength(3)
    expect(screen.getByRole('menuitem', { name: 'Deep' })).toBeInTheDocument()
  })

  it('renders a panel item content in the next column', () => {
    render(
      <Menu
        items={[
          {
            key: 'status',
            type: 'panel',
            label: 'Status',
            ariaLabel: 'Status editor',
            render: () => <input aria-label="Status text" />,
          },
        ]}
      />,
    )

    expect(screen.queryByLabelText('Status text')).not.toBeInTheDocument()

    openItem('Status')

    expect(
      screen.getByRole('dialog', { name: 'Status editor' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Status text')).toBeInTheDocument()
  })
})
