import React from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet } from 'react-router-dom'

import { useMeQuery } from '@generated/graphql'

export const PublicRoutes = () => {
  const { data, loading } = useMeQuery({ fetchPolicy: 'cache-first' })
  const { t } = useTranslation()

  if (loading) {
    return <span>{t('common.loading')}</span>
  }

  if (!data?.me.data?.id && !loading) {
    return <Outlet />
  }

  return <Navigate to="/" />
}
