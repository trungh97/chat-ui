import { ApolloProvider } from '@apollo/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AppRoutes from '@routes/AppRoutes'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import apolloClient from './apollo'

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
      >
        <BrowserRouter>
          <React.Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
          </React.Suspense>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ApolloProvider>
  )
}

export default App
