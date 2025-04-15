import React from 'react'
import { FilterIcon } from 'shared-ui'

export const FilterChat = () => {
  return (
    <div className="flex items-center hover:bg-brand-100 hover:cursor-pointer hover:rounded-md hover:text-brand-600 p-2 transition-all duration-300 ease-in-out">
      <FilterIcon transform="scale(0.75)" />
    </div>
  )
}

export default FilterChat
