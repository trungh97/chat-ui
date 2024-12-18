import { useApolloClient } from '@apollo/client'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { MeDocument, MeQuery } from '@generated/graphql'
import { useAuth } from '@hooks/useAuth'

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
  const navigate = useNavigate()
  const client = useApolloClient()
  const { data: authData, loading: authLoading } = useAuth()

  const handleLogin = () => {
    const authorizationEndpoint = process.env.REACT_APP_AUTHORIZATION_ENDPOINT
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI
    const scope = 'email profile'
    const responseType = 'code'

    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(
      scope,
    )}`

    // Redirect user to Google's OAuth 2.0 page
    window.open(authUrl, 'Google Login', 'width=500,height=600')

    const messageListener = (
      event: MessageEvent<{
        type: string
        payload: string
      }>,
    ) => {
      // Receive the message from the callback popup window
      // Then update the apollo client cache with the login user data
      if (event.data && event.data.type === 'LOGIN_SUCCESSFUL') {
        const data = JSON.parse(event.data.payload)

        client.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: {
              data: data?.data,
              error: null,
            },
          },
        })
        navigate('/')
      }
    }

    window.addEventListener('message', messageListener)
  }

  return (
    <>
      {authLoading || (!authLoading && authData?.me.data?.id) ? (
        <div>Loading</div>
      ) : (
        <div className="m-3 flex justify-center items-center gap-3 flex-col w-[360px] justify-self-center">
          <Button className='w-full' label="Sign in" />
          <GoogleSignInButton className="w-full" onClick={handleLogin} />
        </div>
      )}
    </>
  )
}

export default Login
