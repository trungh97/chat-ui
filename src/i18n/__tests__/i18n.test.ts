import i18n, {
  DEFAULT_LANGUAGE,
  detectLanguage,
  getDateLocale,
  LANGUAGE_STORAGE_KEY,
} from '@i18n'
import { enUS } from 'date-fns/locale/en-US'
import { vi as viLocale } from 'date-fns/locale/vi'
import en from '../locales/en/common.json'
import vi from '../locales/vi/common.json'

type Translations = { [key: string]: string | Translations }

const flattenKeys = (translations: Translations, prefix = ''): string[] =>
  Object.entries(translations).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'string' ? [path] : flattenKeys(value, path)
  })

// Lets a test look up a key that is not in the typed resources
const translate = (key: string) => (i18n.t as (key: string) => string)(key)

const mockNavigatorLanguage = (language: string) =>
  jest.spyOn(window.navigator, 'language', 'get').mockReturnValue(language)

describe('translation resources', () => {
  it('has the same keys in Vietnamese as in English', () => {
    expect(flattenKeys(vi).sort()).toEqual(flattenKeys(en).sort())
  })

  it('has no empty Vietnamese translations', () => {
    const empty = flattenKeys(vi).filter((key) => {
      const value = key
        .split('.')
        .reduce<
          Translations | string
        >((node, part) => (node as Translations)[part], vi)
      return value === ''
    })
    expect(empty).toEqual([])
  })
})

describe('i18n instance', () => {
  afterEach(() => {
    i18n.removeResourceBundle('en', 'test')
  })

  it('translates the current language', async () => {
    expect(i18n.t('common.loading')).toBe('Loading...')

    await i18n.changeLanguage('vi')
    expect(i18n.t('common.loading')).toBe('Đang tải...')
  })

  it('falls back to English when a key is missing in Vietnamese', async () => {
    // A separate namespace keeps the real resources untouched
    i18n.addResource('en', 'test', 'onlyInEnglish', 'Only in English')
    await i18n.changeLanguage('vi')

    expect(translate('test:onlyInEnglish')).toBe('Only in English')
  })

  it('falls back to English for an unsupported language', async () => {
    await i18n.changeLanguage('fr')
    expect(i18n.t('common.loading')).toBe('Loading...')
  })

  it('remembers the chosen language and updates <html lang>', async () => {
    await i18n.changeLanguage('vi')

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('vi')
    expect(document.documentElement.lang).toBe('vi')
  })
})

describe('detectLanguage', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('uses the stored language first', () => {
    mockNavigatorLanguage('en-US')
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'vi')

    expect(detectLanguage()).toBe('vi')
  })

  it('ignores an unsupported stored value', () => {
    mockNavigatorLanguage('en-US')
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr')

    expect(detectLanguage()).toBe(DEFAULT_LANGUAGE)
  })

  it('uses Vietnamese for a Vietnamese browser', () => {
    mockNavigatorLanguage('vi-VN')

    expect(detectLanguage()).toBe('vi')
  })

  it('defaults to English for other browser languages', () => {
    mockNavigatorLanguage('fr-FR')

    expect(detectLanguage()).toBe('en')
  })

  it('falls back to the browser language when storage is blocked', () => {
    mockNavigatorLanguage('vi')
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    expect(detectLanguage()).toBe('vi')
  })
})

describe('getDateLocale', () => {
  it('maps languages to date-fns locales', () => {
    expect(getDateLocale('en')).toBe(enUS)
    expect(getDateLocale('vi')).toBe(viLocale)
    expect(getDateLocale('fr')).toBe(enUS)
    expect(getDateLocale(undefined)).toBe(enUS)
  })
})
