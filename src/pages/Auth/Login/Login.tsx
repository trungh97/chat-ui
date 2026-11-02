import React from 'react'
import { useTranslation } from 'react-i18next'

import ChatIcon from '@assets/icons/ChatIcon'
import { LanguageSwitcher } from '@components/LanguageSwitcher'

import { CredentialLogin } from './CredentialLogin'
import { GoogleLogin } from './GoogleLogin'

export const Login = () => {
  const { t } = useTranslation()

  return (
    <>
      <LanguageSwitcher className="fixed right-4 top-4" />
      <div className="m-3 flex w-[360px] flex-col items-center justify-center justify-self-center">
        <ChatIcon width={48} height={48} />
        <p className="mb-3 mt-6 text-3xl font-semibold text-gray-900">
          {t('auth.login.title')}
        </p>
        <span className="text-gray-600">{t('auth.login.subtitle')}</span>

        <CredentialLogin />
        <GoogleLogin />
      </div>
    </>
  )
}

export default Login
