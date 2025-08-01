import React, { memo } from 'react'

const Wrapper = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 m-6 p-4 bg-brand-100 rounded-2xl w-full max-sm:min-w-[400px]">
      {children}
    </div>
  )
})

export default Wrapper
