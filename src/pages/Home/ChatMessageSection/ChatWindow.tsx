import { useDraftRoute } from '@hooks/conversations/useDraftRoute'
import React, { memo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Divider } from 'shared-ui'
import ChatHead from './ChatHead'
import ChatInput from './ChatInput'
import ChatMessageSection from './ChatMessageSection'
import ChatMoreOptions from './ChatMoreOptions'
import ChatTitle from './ChatTitle'
import Wrapper from './Wrapper'

const ChatWindow = memo(() => {
  const { conversationId } = useParams()
  const { draftUserId, draft, isMissing } = useDraftRoute()

  if (isMissing) {
    // Drafts live in memory only, so after a reload there is nothing to show.
    return <Navigate to="/" replace />
  }

  // A draft that was just replaced by its conversation: the route is about to change.
  if (draftUserId && !draft) {
    return null
  }

  if (!conversationId && !draftUserId) {
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
