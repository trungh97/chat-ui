import React from 'react'
import { AddIcon } from 'shared-ui'

export const AddNewChat = React.memo(() => {
  return (
    <div className="flex items-center p-2 transition-all duration-300 ease-in-out hover:cursor-pointer hover:rounded-md hover:bg-brand-100 hover:text-brand-600">
      <AddIcon transform="scale(0.75)" />
    </div>
  )
})

export default AddNewChat
