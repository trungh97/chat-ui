import { useApolloClient } from '@apollo/client'
import {
  MeDocument,
  MeQuery,
  useCredentialBasedLoginMutation,
} from '@generated/graphql'
import { useNavigate } from 'react-router-dom'
import { message } from 'shared-ui'
import { useUserStore } from '@store/user'

export const useCredentialLogin = () => {
  const [credentialBasedLogin] = useCredentialBasedLoginMutation()
  const client = useApolloClient()
  const navigate = useNavigate()
  const setCurrentUser = useUserStore.use.setCurrentUser()

  const handleLogin = async (values: Record<string, any>) => {
    if (!values.email || !values.password) {
      return
    }

    try {
      const response = await credentialBasedLogin({
        variables: {
          request: {
            email: values.email,
            password: values.password,
          },
        },
      })

      if (response.data?.loginCredentialBasedUser.error) {
        message.error(response.data.loginCredentialBasedUser.error)
        return
      }

      const data = response?.data?.loginCredentialBasedUser.data

      if (data?.id) {
        client.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: {
              data,
              error: null,
            },
          },
        })
        setCurrentUser(data)
        message.success('Logged in successfully')
        navigate('/')
      }
    } catch (error) {
      message.error('Something went wrong')
      return
    }
  }

  return {
    handleLogin,
  }
}
