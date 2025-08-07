import React, { memo } from 'react'
import { useParams } from 'react-router-dom'
import { Divider } from 'shared-ui'
import ChatHead from './ChatHead'
import ChatInput from './ChatInput'
import ChatMessageSection from './ChatMessageSection'
import ChatMoreOptions from './ChatMoreOptions'
import ChatTitle from './ChatTitle'
import Wrapper from './Wrapper'

const ChatWindow = memo(() => {
  const { conversationId } = useParams()

  if (!conversationId) {
    return null
  }

  return (
    <Wrapper>
      <ChatHead>
        <ChatTitle />
        <ChatMoreOptions />
      </ChatHead>
      <Divider className="my-3" color="#D5D7DA" />
      <ChatMessageSection />
      <ChatInput />
    </Wrapper>
  )
})

export default ChatWindow
