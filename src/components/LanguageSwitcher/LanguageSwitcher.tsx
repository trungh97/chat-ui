import { useLanguage } from '@hooks/common'
import { Language, SUPPORTED_LANGUAGES } from '@i18n'
import React from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGE_CODES: Record<Language, string> = {
  en: 'EN',
  vi: 'VI',
}

export type LanguageSwitcherProps = {
  className?: string
}

export const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t('language.switcherLabel')}
      className={`flex overflow-hidden rounded-lg border border-brand-300 text-xs font-medium ${className}`}
    >
      {SUPPORTED_LANGUAGES.map((code) => {
        const isActive = code === language

        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={t(`language.${code}`)}
            aria-pressed={isActive}
            onClick={() => setLanguage(code)}
            className={`px-2 py-1 transition-colors ${
              isActive
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-700 hover:bg-brand-100'
            }`}
          >
            {LANGUAGE_CODES[code]}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
