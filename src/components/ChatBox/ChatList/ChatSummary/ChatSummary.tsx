import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar } from 'shared-ui'
import { ChatSummaryProps } from '../types'

export const ChatSummary = ({ data }: { data: ChatSummaryProps }) => {
  const { id, avatar, title, lastMessage, lastMessageTime } = data
  const navigate = useNavigate()
  const { conversationId } = useParams()

  const handleClick = () => {
    if (conversationId !== id) {
      navigate(`/${id}`)
    }
  }

  return (
    <div
      key={id}
      className={`py-3 px-6 hover:bg-brand-200 cursor-pointer w-full rounded-xl ${conversationId === id ? 'bg-brand-300' : ''}`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="relative">
          <Avatar imageUrl={avatar} size="md" />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-900 truncate`}>{title}</h3>
          <div className="flex justify-between items-center">
            <p className={`text-sm text-gray-500 truncate max-w-[65%]`}>
              {lastMessage}
            </p>
            <span className="text-xs text-gray-500">
              {new Date(lastMessageTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSummary
