import { useApolloClient } from '@apollo/client'
import {
  MeDocument,
  MeQuery,
  useCredentialBasedLoginMutation,
} from '@generated/graphql'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { message } from 'shared-ui'
import { useUserStore } from '@store/user'

export const useCredentialLogin = () => {
  const [credentialBasedLogin] = useCredentialBasedLoginMutation()
  const client = useApolloClient()
  const navigate = useNavigate()
  const setCurrentUser = useUserStore.use.setCurrentUser()
  const { t } = useTranslation()

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
        message.success(t('auth.login.success'))
        navigate('/')
      }
    } catch (error) {
      message.error(t('auth.login.genericError'))
      return
    }
  }

  return {
    handleLogin,
  }
}
