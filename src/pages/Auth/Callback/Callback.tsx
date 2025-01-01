import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGoogleLoginMutation } from '@generated/graphql'

export const Callback = () => {
  const [googleLogin] = useGoogleLoginMutation()
  const navigate = useNavigate()

  const urlParams = new URLSearchParams(window.location.search)
  const authorizationCode = urlParams.get('code')

  if (!authorizationCode) {
    navigate('/login')
  }

  useEffect(() => {
    const loginWithGraphQL = async () => {
      try {
        if (!authorizationCode) {
          return
        }

        const response = await googleLogin({
          variables: { code: authorizationCode },
        })

        if (response?.data?.googleLogin?.data?.id) {
          window.opener.postMessage(
            {
              // TODO: use constant
              type: 'LOGIN_SUCCESSFUL',
              payload: JSON.stringify(response.data.googleLogin.data),
            },
            'http://localhost:3000',
          )
          window.close()
          return
        }
      } catch (error) {
        return
      }
    }

    loginWithGraphQL()
  }, [])

  return <></>
}

export default Callback
