import React, { memo } from 'react'

const Wrapper = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative m-6 w-full flex-1 rounded-2xl bg-brand-100 p-4 max-sm:min-w-[400px]">
      {children}
    </div>
  )
})

export default Wrapper
