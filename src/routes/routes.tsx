import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { CallbackPage, LoginPage } from '@pages/Auth'
import { HomePage } from '@pages/Home'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/callback/google',
    element: <CallbackPage />,
  },
])
