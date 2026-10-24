export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'en'

export const LANGUAGE_STORAGE_KEY = 'chat-app.language'

export const isSupportedLanguage = (value: unknown): value is Language =>
  SUPPORTED_LANGUAGES.includes(value as Language)

/**
 * Picks the initial language:
 * 1. the language the user chose before (localStorage),
 * 2. the browser language (`vi*` → `vi`),
 * 3. English.
 */
export const detectLanguage = (): Language => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isSupportedLanguage(stored)) return stored
  } catch {
    // Storage can be blocked (private mode, disabled cookies): fall through to the browser language
  }

  const browserLanguage =
    typeof navigator === 'undefined' ? '' : navigator.language
  return browserLanguage.toLowerCase().startsWith('vi')
    ? 'vi'
    : DEFAULT_LANGUAGE
}

/** Remembers the user's choice. Does nothing if storage is blocked. */
export const persistLanguage = (language: string) => {
  if (!isSupportedLanguage(language)) return

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Storage can be blocked: the choice then lasts only for this page load
  }
}
