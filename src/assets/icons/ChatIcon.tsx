import React from 'react'

const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 800}
      height={props.height || 800}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="#1C274C" d="M22 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path
        fill="#1C274C"
        d="M15.235 2.535A9.987 9.987 0 0 0 12 2C6.477 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.591l2.226-.595a1.634 1.634 0 0 1 1.149.133A9.958 9.958 0 0 0 12 22c5.523 0 10-4.477 10-10 0-1.132-.188-2.22-.535-3.235a4.5 4.5 0 0 1-6.23-6.23Z"
        opacity={0.5}
      />
    </svg>
  )
}

export default ChatIcon
