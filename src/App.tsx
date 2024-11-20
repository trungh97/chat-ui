import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_ENDPOINT,
  cache: new InMemoryCache(),
  credentials: 'include',
})

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
      >
        {children}
      </GoogleOAuthProvider>
    </ApolloProvider>
  )
}

export default App
