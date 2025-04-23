import React from 'react'
import { Avatar } from 'shared-ui'
import { ChatSummaryProps } from '../types'

export const ChatSummary = ({
  data: { id, avatar, title, lastMessage, lastMessageTime, isRead },
}: {
  data: ChatSummaryProps
}) => {
  return (
    <div
      key={id}
      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${!isRead ? 'bg-gray-50' : ''}`}
    >
      <div className="flex gap-3">
        <div className="relative">
          <Avatar imageUrl={avatar} size="md" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3
              className={`font-medium text-gray-900 truncate ${!isRead ? 'font-semibold' : ''}`}
            >
              {title}
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(lastMessageTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p
            className={`text-sm text-gray-500 truncate ${!isRead ? 'font-medium text-gray-900' : ''}`}
          >
            {lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatSummary
