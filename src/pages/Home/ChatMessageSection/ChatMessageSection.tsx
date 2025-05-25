import React from 'react'
import Wrapper from './Wrapper'
import ChatHead from './ChatHead'
import ChatTitle from './ChatTitle'
import ChatMoreOptions from './ChatMoreOptions'
import { Divider } from 'shared-ui'

export const ChatMessageSection = () => {
  return (
    <Wrapper>
      <ChatHead>
        <ChatTitle />
        <ChatMoreOptions />
      </ChatHead>
      <Divider className='my-3' color='#D5D7DA' />
    </Wrapper>
  )
}

export default ChatMessageSection
 