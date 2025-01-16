import React from 'react'
import { useGoogleLogin } from './hooks'
import { GoogleSignInButton } from 'shared-ui'

export const GoogleLogin = () => {
  const { handleLogin } = useGoogleLogin()

  return <GoogleSignInButton className="w-full mt-3" onClick={handleLogin} />
}

export default GoogleLogin
