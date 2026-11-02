import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import i18n, { LANGUAGE_STORAGE_KEY } from '@i18n'
import { useLogout } from '@hooks/auth/useLogout'
import React from 'react'
import { UserMenu } from '../UserMenu'

jest.mock('@hooks/auth/useLogout')

const renderMenu = (loggingOut = false) => {
  const onLogout = jest.fn()
  jest.mocked(useLogout).mockReturnValue({ onLogout, loading: loggingOut })
  render(<UserMenu />)
  return { onLogout }
}

describe('UserMenu', () => {
  it('shows Change language above Logout with the language list closed', () => {
    renderMenu()

    const items = screen.getAllByRole('menuitem')
    expect(items.map((item) => item.textContent)).toEqual([
      'Change language›',
      'Logout',
    ])
    expect(items[0]).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menuitemradio')).not.toBeInTheDocument()
  })

  it('opens the language sub-menu with the current language checked', () => {
    renderMenu()

    fireEvent.click(screen.getByRole('menuitem', { name: /Change language/ }))

    expect(
      screen.getByRole('menuitem', { name: /Change language/ }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu', { name: 'Language' })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitemradio', { name: /English/ }),
    ).toHaveAttribute('aria-checked', 'true')
    expect(
      screen.getByRole('menuitemradio', { name: /Tiếng Việt/ }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('switches the language from the sub-menu', async () => {
    renderMenu()

    fireEvent.click(screen.getByRole('menuitem', { name: /Change language/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /Tiếng Việt/ }))

    expect(
      await screen.findByRole('menuitem', { name: /Đổi ngôn ngữ/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: 'Đăng xuất' }),
    ).toBeInTheDocument()
    expect(i18n.language).toBe('vi')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('vi')
    expect(
      screen.getByRole('menuitemradio', { name: /Tiếng Việt/ }),
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onLogout when Logout is clicked', async () => {
    await i18n.changeLanguage('en')
    const { onLogout } = renderMenu()

    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('disables Logout while logging out', async () => {
    await i18n.changeLanguage('en')
    renderMenu(true)

    expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeDisabled()
  })
})
