import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PrivateRoutes } from './PrivateRoutes'
import { PublicRoutes } from './PublicRoutes'

const AboutPage = lazy(() =>
  import('@pages/About').then((module) => ({ default: module.AboutPage })),
)
const LoginPage = lazy(() =>
  import('@pages/Auth').then((module) => ({ default: module.Login })),
)
const CallbackPage = lazy(() =>
  import('@pages/Auth').then((module) => ({ default: module.Callback })),
)
const HomePage = lazy(() =>
  import('@pages/Home').then((module) => ({ default: module.HomePage })),
)

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
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
