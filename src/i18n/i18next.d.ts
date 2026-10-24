import 'i18next'
import common from './locales/en/common.json'

// English is the source of truth: `t()` only accepts keys that exist in en/common.json
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
    }
  }
}
