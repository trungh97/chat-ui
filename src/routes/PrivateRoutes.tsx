import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useMeQuery } from '@generated/graphql'

export const PrivateRoutes = () => {
  const { data, loading } = useMeQuery()

  if (loading) {
    return <span>Loading</span>
  }

  if (data?.me.data?.id) {
    return <Outlet />
  }

  return <Navigate to="/login" />
}
