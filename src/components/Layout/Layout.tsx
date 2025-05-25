import React from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen bg-brand-50 flex flex-row min-w-[500px]">{children}</div>
  )
}

export default Layout
