import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@routes/AppRoutes'

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_ENDPOINT,
  cache: new InMemoryCache(),
  credentials: 'include',
})

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ApolloProvider>
  )
}

export default App
