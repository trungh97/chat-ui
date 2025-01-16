import React from 'react'

import ChatIcon from '@assets/icons/ChatIcon'

import { CredentialLogin } from './CredentialLogin'
import { GoogleLogin } from './GoogleLogin'

export const Login = () => {
  return (
    <>
      <div className="m-3 flex justify-center items-center flex-col w-[360px] justify-self-center">
        <ChatIcon width={48} height={48} />
        <p className="text-gray-900 text-3xl font-semibold mt-6 mb-3">
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
