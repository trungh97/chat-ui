import { gql } from '@apollo/client'
import {
  ConversationType,
  DetailedParticipantFragmentDoc,
} from '@generated/graphql'
import { useConversationInCache } from '@hooks/conversations'
import React, { memo } from 'react'
import { useParams } from 'react-router-dom'
import { Divider, StarIcon, UserIcon } from 'shared-ui'

export const ChatTitle = memo(() => {
  const { conversationId } = useParams()
  const fragment = gql`
    fragment ConversationTitle on ExtendConversationDTO {
      id
      title
      type
      participants {
        ...detailedParticipant
      }
    }
    ${DetailedParticipantFragmentDoc}
  `
  const { data } = useConversationInCache({
    conversationId: conversationId!,
    fragment,
    fragmentName: 'ConversationTitle',
  })

  if (!conversationId || !data) {
    return null
  }

  const { title, type, participants = [] } = data
  const isGroup = type === ConversationType.Group

  return (
    <div>
      <div className="block text-ellipsis text-lg font-semibold">{title}</div>
      <div className="flex items-center text-xs font-medium">
        <StarIcon width={12} height={12} />
        {isGroup && (
          <Divider orientation="vertical" color="#D5D7DA" className="mx-1" />
        )}

        {isGroup && (
          <div className="flex items-center hover:cursor-pointer">
            <UserIcon width={12} height={12} />
            <span className="ml-1">{participants.length}</span>
          </div>
        )}

        {isGroup && (
          <Divider orientation="vertical" color="#D5D7DA" className="mx-1" />
        )}

        {/* <div className="flex items-center hover:cursor-pointer">
          <MessageIcon style={{ transform: 'scale(0.5)' }} />
          <span className="ml-1">100</span>
        </div> */}

        {/* <Divider orientation="vertical" color="#D5D7DA" className="mx-1" /> */}
      </div>
    </div>
  )
})

export default ChatTitle
