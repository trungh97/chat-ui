import React from 'react'
import { Input, SearchIcon } from 'shared-ui'

export const SearchChat = () => {
  return (
    <div>
      <Input variant='leading-icon' placeholder='Search chat' icon={<SearchIcon color='#717680' transform="scale(0.8)" />} />
    </div>
  )
}

export default SearchChat
