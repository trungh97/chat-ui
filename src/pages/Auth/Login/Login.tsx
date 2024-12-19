import React from 'react'

import { useAuth } from '@hooks/useAuth'

import { useGoogleLogin } from './hooks'

const GoogleSignInButton = React.lazy(() =>
  import('ui/SocialButon').then((module) => ({
    default: module.GoogleSignInButton,
  })),
)

const Button = React.lazy(() =>
  import('ui/Button').then((module) => ({
    default: module.Button,
  })),
)

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
        </div>
      )}
    </>
  )
}

export default Login
