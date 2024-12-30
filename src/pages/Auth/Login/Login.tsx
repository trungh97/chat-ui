import React from 'react'
import { Button, GoogleSignInButton, Text } from 'slack-shared-ui'

import { useAuth } from '@hooks/useAuth'

import { useGoogleLogin } from './hooks'

const Login = () => {
  const { data: authData, loading: authLoading } = useAuth()
  const { handleLogin } = useGoogleLogin()

  return (
    <>
      {authLoading || (!authLoading && authData?.me.data?.id) ? (
        <div>Loading</div>
      ) : (
        <div className="m-3 flex justify-center items-center gap-3 flex-col w-[360px] justify-self-center">
          <Button className="w-full" label="Sign in" />
          <GoogleSignInButton className="w-full" onClick={handleLogin} />
          <Text />
        </div>
      )}
    </>
  )
}

export default Login
