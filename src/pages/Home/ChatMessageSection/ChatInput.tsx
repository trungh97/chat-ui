import React, { memo, useState } from 'react'
import { Input, SendIcon } from 'shared-ui'

export const ChatInput = memo(() => {
  const [value, setValue] = useState('')

  const handleChange: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    event,
  ) => {
    setValue(event.target.value)
  }

  const handleSubmit = (value: string) => {
    setValue('')
    console.log(value)
  }

  return (
    <div className="absolute p-3 bottom-0 left-0 right-0 bg-brand-300 flex rounded-b-2xl items-center gap-x-2">
      <Input
        wrapperClassName="flex-1"
        onChange={handleChange}
        value={value}
        className="bg-brand-200"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(value)
          }
        }}
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
