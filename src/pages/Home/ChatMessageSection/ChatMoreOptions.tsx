import React, { memo } from 'react'
import { MoreIcon, Popover } from 'shared-ui'

export const ChatMoreOptions = memo(() => {
  return (
    <div>
      <Popover
        content={"Add more options here, like 'Settings', 'Help', etc."}
        placement="right"
        trigger="click"
      >
        <div className="hover:cursor-pointer">
          <MoreIcon />
        </div>
      </Popover>
    </div>
  )
})

export default ChatMoreOptions
