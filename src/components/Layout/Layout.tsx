import { ChatBox } from '@components/ChatBox'
import React from 'react'
import { Divider } from 'shared-ui'
import { QuickLaunch } from './QuickLaunch'

export const Layout = () => {
  return (
    <div className="w-full h-screen bg-brand-50 flex flex-row">
      <QuickLaunch />
      <Divider orientation="vertical" color="#e9eaeb" />
      <ChatBox />
      <Divider orientation="vertical" color="#e9eaeb" />
    </div>
  )
}

export default Layout
