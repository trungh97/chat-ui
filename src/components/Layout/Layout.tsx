import { ChatBox } from '@components/ChatBox'
import React from 'react'
import { Divider } from 'shared-ui'
import { QuickLaunch } from './QuickLaunch'

export const Layout = () => {
  return (
    <div className="flex h-screen w-full flex-row bg-brand-50">
      <QuickLaunch />
      <Divider orientation="vertical" color="#e9eaeb" />
      <ChatBox />
      <Divider orientation="vertical" color="#e9eaeb" />
    </div>
  )
}

export default Layout
