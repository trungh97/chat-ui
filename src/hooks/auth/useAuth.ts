import { useMeQuery } from '@generated/graphql'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { data, loading } = useMeQuery()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isAuthenticated = Boolean(data?.me?.data?.id)

  useEffect(() => {
    if (
      !loading &&
      isAuthenticated &&
      ['/login', '/register'].includes(pathname)
    ) {
      navigate('/', { replace: true })
    }
  }, [data, loading])

  return { data, loading }
}
