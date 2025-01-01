import { useApolloClient } from '@apollo/client'
import {
  MeDocument,
  MeQuery,
  useCredentialBasedLoginMutation,
} from '@generated/graphql'
import { useNavigate } from 'react-router-dom'

export const useCredentialLogin = () => {
  const [credentialBasedLogin] = useCredentialBasedLoginMutation()
  const client = useApolloClient()
  const navigate = useNavigate()

  const handleLogin = async (values: Record<string, any>) => {
    console.log(values);
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
        console.log('Error:', response.data.loginCredentialBasedUser.error)
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
        navigate('/')
      }
    } catch (error) {
      console.log('Error:', error)
      return
    }
  }

  return {
    handleLogin,
  }
}
