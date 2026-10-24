import type { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import { vi } from 'date-fns/locale/vi'
import { DEFAULT_LANGUAGE, isSupportedLanguage, Language } from './language'

const DATE_LOCALES: Record<Language, Locale> = {
  en: enUS,
  vi,
}

/** The date-fns locale for an i18next language, falling back to English. */
export const getDateLocale = (language: string | undefined): Locale =>
  isSupportedLanguage(language)
    ? DATE_LOCALES[language]
    : DATE_LOCALES[DEFAULT_LANGUAGE]
