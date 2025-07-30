import React from 'react'
import { useGoogleLogin } from './hooks'
import { GoogleSignInButton } from 'shared-ui'

export const GoogleLogin = () => {
  const { handleLogin } = useGoogleLogin()

  return <GoogleSignInButton className="mt-3 w-full" onClick={handleLogin} />
}

export default GoogleLogin
