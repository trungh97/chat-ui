import { useLanguage } from '@hooks/common'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, FormField } from 'shared-ui'
import { useCredentialLogin } from './hooks'

export const CredentialLogin = () => {
  const { handleLogin } = useCredentialLogin()
  const { t } = useTranslation()
  const { language } = useLanguage()

  // shared-ui's Form registers validation messages once on mount, so remount it on a language change
  return (
    <Form
      key={language}
      autoComplete="off"
      className="mt-8 w-full"
      onSubmit={handleLogin}
    >
      <FormField
        label={t('auth.login.emailLabel')}
        name="email"
        placeholder={t('auth.login.emailPlaceholder')}
        rules={[
          { type: 'required', message: t('auth.login.emailRequired') },
          { type: 'email', message: t('auth.login.emailInvalid') },
        ]}
        autoComplete="off"
        className="m-0"
      />
      <FormField
        label={t('auth.login.passwordLabel')}
        type="password"
        name="password"
        placeholder={t('auth.login.passwordPlaceholder')}
        rules={[
          { type: 'required', message: t('auth.login.passwordRequired') },
        ]}
        autoComplete="off"
      />
      <Button size="lg" label={t('auth.login.submit')} type="submit" />
    </Form>
  )
}

export default CredentialLogin
