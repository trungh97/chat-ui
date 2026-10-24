import {
  DEFAULT_LANGUAGE,
  getDateLocale,
  isSupportedLanguage,
  Language,
} from '@i18n'
import type { Locale } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export type UseLanguageResult = {
  language: Language
  /** Switches the UI language and remembers the choice. */
  setLanguage: (next: Language) => void
  /** date-fns locale matching `language`. */
  dateLocale: Locale
}

/**
 * The current UI language, a setter that switches it (and remembers the choice), and the
 * matching date-fns locale. Components re-render when the language changes.
 */
export const useLanguage = (): UseLanguageResult => {
  const { i18n } = useTranslation()
  const language: Language = isSupportedLanguage(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : DEFAULT_LANGUAGE

  const setLanguage = useCallback(
    (next: Language) => {
      void i18n.changeLanguage(next)
    },
    [i18n],
  )

  const dateLocale = useMemo(() => getDateLocale(language), [language])

  return { language, setLanguage, dateLocale }
}
