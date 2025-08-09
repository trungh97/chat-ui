import { useSendMessage } from '@hooks/message'
import React, { memo } from 'react'
import { Input, SendIcon } from 'shared-ui'

export const ChatInput = memo(() => {
  const { value, handleChange, handleSubmit } = useSendMessage()

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center gap-x-2 rounded-b-2xl bg-brand-200 p-3">
      <Input
        wrapperClassName="flex-1"
        onChange={handleChange}
        value={value}
        className="bg-brand-100 focus-within:shadow-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(value)
          }
        }}
        autoFocus
      />
      <div
        onClick={() => handleSubmit(value)}
        className="flex items-center rounded-[50%] p-2 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-brand-100 hover:text-brand-600"
      >
        <SendIcon color="#53389E" />
      </div>
    </div>
  )
})

export default ChatInput
