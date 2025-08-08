import { MessageType, useCreateMessageMutation } from '@generated/graphql'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { message } from 'shared-ui'

export const useSendMessage = () => {
  const { conversationId } = useParams()
  const [value, setValue] = useState('')
  const [createMessageMutation] = useCreateMessageMutation()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    event,
  ) => {
    setValue(event.target.value)
  }

  const handleSubmit = async (value: string) => {
    try {
      const { data, errors } = await createMessageMutation({
        variables: {
          request: {
            conversationId: conversationId!,
            content: value,
            messageType: MessageType.Text,
          },
        },
      })

      if (errors?.length || !data?.createMessage.data) {
        message.error('Failed to send message')
        return
      }

      setValue('')
    } catch (error) {
      message.error(
        `Failed to send message due to the following error: ${error}`,
      )
    } finally {
      setValue('')
    }
  }

  return {
    value,
    handleChange,
    handleSubmit,
  }
}

export default useSendMessage
