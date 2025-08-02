import { formatRelativeToNow } from '@helpers/date'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar } from 'shared-ui'
import { ChatSummaryProps } from '../types'

export const ChatSummary = ({ data }: { data: ChatSummaryProps }) => {
  const { id, avatar, title, lastMessage, lastMessageTime } = data
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const lastMessageDateTime = formatRelativeToNow(lastMessageTime)
  const isCurrentConversation = conversationId === id

  const handleClick = () => {
    if (!isCurrentConversation) {
      navigate(`/${id}`)
    }
  }

  return (
    <div
      key={id}
      className={`px-6 py-3 ${isCurrentConversation ? 'hover:bg-brand-300' : 'hover:bg-brand-200'} w-full cursor-pointer rounded-xl ${isCurrentConversation ? 'bg-brand-300' : ''}`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="relative">
          <Avatar imageUrl={avatar} size="md" />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`truncate font-medium text-gray-900`}>{title}</h3>
          <div className="flex items-center justify-between">
            <p className={`max-w-[65%] truncate text-sm text-gray-500`}>
              {lastMessage}
            </p>
            <span className="whitespace-nowrap text-xs text-gray-500">
              {'\u2022 '}
              {lastMessageDateTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSummary
