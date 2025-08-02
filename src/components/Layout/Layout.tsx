import React, { memo } from 'react'

export const Layout = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full min-w-[500px] flex-row bg-brand-50">
      {children}
    </div>
  )
})

export default Layout
