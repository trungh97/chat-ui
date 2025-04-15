import React from 'react'
import { Avatar } from 'shared-ui'
import { ChatSummaryProps } from '../types'

export const ChatSummary = ({ data }: { data: ChatSummaryProps }) => {
  return (
    // TODO: check the style carefully
    <article className="flex flex-col justify-center items-center mt-4 w-full min-h-[60px] first:mt-0">
      <div className="flex gap-3 items-center max-w-full min-h-[60px] w-[263px]">
        <div className="flex overflow-hidden relative flex-col justify-end items-end self-stretch px-2.5 pt-9 my-auto w-12 aspect-square">
          {/* TODO: replace with user avatar */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7c940198a368f49e5b6f645005a3623eb0a8df36?placeholderIfAbsent=true&apiKey=db2de4f51c3f4cc2b2e91fd659727a98"
            className="object-cover absolute inset-0 size-full"
            alt="User avatar"
          />
          <div className="flex relative z-10 shrink-0 w-full bg-emerald-500 rounded-md h-[15px] max-md:-mr-0.5" />
        </div>
        <div className="self-stretch my-auto">
          <h3 className="text-base font-semibold text-gray-700">Olivia Rhye</h3>
          <p className="text-sm leading-6 text-gray-600">
            This is the sample message...
          </p>
        </div>
      </div>
    </article>
  )
}

export default ChatSummary
