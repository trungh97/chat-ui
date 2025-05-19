import { MeDocument, MeQuery, useLogoutMutation } from '@generated/graphql'

export const useLogout = () => {
  const [logout, { loading }] = useLogoutMutation()

  const onLogout = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                statusCode: 401,
                message: 'User is not authenticated!',
                data: null,
                error: 'User is not authenticated!',
              },
            },
          })
        }
      },
    })
  }

  return {
    onLogout,
    loading,
  }
}
