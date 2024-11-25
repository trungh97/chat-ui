import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { CallbackPage, LoginPage } from '@pages/Auth'
import { HomePage } from '@pages/Home'

import { PrivateRoutes } from './PrivateRoutes'
import { PublicRoutes } from './PublicRoutes'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback/google" element={<CallbackPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
