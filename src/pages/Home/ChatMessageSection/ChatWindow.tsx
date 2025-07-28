import React, { memo } from 'react'
import { Divider } from 'shared-ui'
import ChatHead from './ChatHead'
import ChatMessageSection from './ChatMessageSection'
import ChatMoreOptions from './ChatMoreOptions'
import ChatTitle from './ChatTitle'
import Wrapper from './Wrapper'

const ChatWindow = memo(() => {
  return (
    <Wrapper>
      <ChatHead>
        <ChatTitle />
        <ChatMoreOptions />
      </ChatHead>
      <Divider className="my-3" color="#D5D7DA" />
      <ChatMessageSection />
    </Wrapper>
  )
})

export default ChatWindow
