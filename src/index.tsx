import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { routes } from './routes/routes'
import './index.css'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <App>
    <RouterProvider router={routes} />
  </App>,
)
