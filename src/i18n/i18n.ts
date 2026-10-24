import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  detectLanguage,
  persistLanguage,
  SUPPORTED_LANGUAGES,
} from './language'
import en from './locales/en/common.json'
import vi from './locales/vi/common.json'

export const DEFAULT_NAMESPACE = 'common'

export const resources = {
  en: { [DEFAULT_NAMESPACE]: en },
  vi: { [DEFAULT_NAMESPACE]: vi },
} as const

i18n.on('languageChanged', (language) => {
  persistLanguage(language)
  document.documentElement.lang = language
})

// Resources are bundled, so init is synchronous and the first render is already translated
void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: [DEFAULT_NAMESPACE],
  defaultNS: DEFAULT_NAMESPACE,
  interpolation: {
    // React already escapes rendered strings
    escapeValue: false,
  },
  initAsync: false,
})

export default i18n
