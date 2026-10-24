import { act, renderHook } from '@testing-library/react'
import { enUS } from 'date-fns/locale/en-US'
import { vi } from 'date-fns/locale/vi'
import i18n from '@i18n'
import { useLanguage } from '../useLanguage'

describe('useLanguage', () => {
  it('returns the current language and its date locale', () => {
    const { result } = renderHook(() => useLanguage())

    expect(result.current.language).toBe('en')
    expect(result.current.dateLocale).toBe(enUS)
  })

  it('switches the language and re-renders', async () => {
    const { result } = renderHook(() => useLanguage())

    await act(async () => {
      result.current.setLanguage('vi')
    })

    expect(i18n.language).toBe('vi')
    expect(result.current.language).toBe('vi')
    expect(result.current.dateLocale).toBe(vi)
  })
})
