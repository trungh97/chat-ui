import type { MenuSubmenuItem } from '@components/Menu'
import { SUPPORTED_LANGUAGES } from '@i18n'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from './useLanguage'

/** "Change language" menu item with a sub-menu of the supported languages. */
export const useLanguageMenuItem = (): MenuSubmenuItem => {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()

  return {
    key: 'language',
    type: 'submenu',
    label: t('language.change'),
    ariaLabel: t('language.switcherLabel'),
    children: SUPPORTED_LANGUAGES.map((code) => ({
      key: code,
      label: <span lang={code}>{t(`language.${code}`)}</span>,
      checked: code === language,
      onSelect: () => setLanguage(code),
    })),
  }
}
