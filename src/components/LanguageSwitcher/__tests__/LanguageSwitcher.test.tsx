import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import i18n, { LANGUAGE_STORAGE_KEY } from '@i18n'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '../LanguageSwitcher'

const TranslatedText = () => {
  const { t } = useTranslation()
  return <p>{t('auth.login.submit')}</p>
}

const renderWithText = () =>
  render(
    <>
      <LanguageSwitcher />
      <TranslatedText />
    </>,
  )

describe('LanguageSwitcher', () => {
  it('marks the current language as pressed', () => {
    renderWithText()

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('switches the language and the rendered text', async () => {
    renderWithText()
    expect(screen.getByText('Sign in')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tiếng Việt' }))

    expect(await screen.findByText('Đăng nhập')).toBeInTheDocument()
    expect(i18n.language).toBe('vi')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('vi')
    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('switches back to English', async () => {
    await i18n.changeLanguage('vi')
    renderWithText()

    fireEvent.click(screen.getByRole('button', { name: 'English' }))

    expect(await screen.findByText('Sign in')).toBeInTheDocument()
  })
})
