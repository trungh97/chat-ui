import React from 'react'

import ChatIcon from '@assets/icons/ChatIcon'

import { CredentialLogin } from './CredentialLogin'
import { GoogleLogin } from './GoogleLogin'

export const Login = () => {
  return (
    <>
      <div className="m-3 flex w-[360px] flex-col items-center justify-center justify-self-center">
        <ChatIcon width={48} height={48} />
        <p className="mb-3 mt-6 text-3xl font-semibold text-gray-900">
          Log in to your account
        </p>
        <span className="text-gray-600">
          Welcome back! Please enter your details.
        </span>

        <CredentialLogin />
        <GoogleLogin />
      </div>
    </>
  )
}

export default Login
