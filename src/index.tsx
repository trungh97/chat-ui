import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

const App = () => (
  <h1 className="text-3xl font-bold text-red-600">Hello World</h1>
)
const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<App />)
