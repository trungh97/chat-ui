import { Layout } from '@components/Layout'
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from '@generated/graphql'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { loading, data, error } = useMeQuery()
  const [logout, { loading: logoutLoading }] = useLogoutMutation()
  const navigate = useNavigate()

  if (!loading && !data) {
    navigate('/login')
  }

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

  const hasError = Boolean(error || data?.me.error)

  return (
    <>
      <Layout />
      {/* <div className="text-3xl text-blue-700">Welcome</div>
      {hasError && (
        <div className="text-red-600">
          Error: {error?.message || data?.me.error}
        </div>
      )}
      {data && data.me.data?.id && (
        <div>
          {data.me.data.firstName} {data.me.data.lastName} {data.me.data.email}
        </div>
      )}

      {hasError && (
        <button
          className="px-6 py-2 mx-3 bg-green-200 rounded border-black"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      )}

      
      <Button
      label="Go to About Page"
      onClick={() => navigate('/about')}
      size="sm"
      /> */}
      {/* {data && data.me.data?.id && (
        <button
          onClick={onLogout}
          disabled={logoutLoading}
          className="mt-[100px] px-6 py-2 bg-slate-500 rounded border-black"
        >
          Logout
        </button>
      )} */}
    </>
  )
}

export default Home
