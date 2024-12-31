import React from 'react'
import { Button, Form, FormField, GoogleSignInButton } from 'slack-shared-ui'

import { useAuth } from '@hooks/useAuth'
import ChatIcon from '@assets/icons/ChatIcon'

import { useGoogleLogin } from './hooks'

const Login = () => {
  const { data: authData, loading: authLoading } = useAuth()
  const { handleLogin } = useGoogleLogin()

  const handleLoginCredentials = () => {
    // TODO: Implement login with email and password
  }

  return (
    <>
      {authLoading || (!authLoading && authData?.me.data?.id) ? (
        <div>Loading</div>
      ) : (
        <div className="m-3 flex justify-center items-center flex-col w-[360px] justify-self-center">
          <ChatIcon width={48} height={48} />
          <p className="text-gray-900 text-3xl font-semibold mt-6 mb-3">
            Log in to your account
          </p>
          <span className="text-gray-600">
            Welcome back! Please enter your details.
          </span>

          <Form
            autoComplete="off"
            className="w-full mt-8"
            onSubmit={handleLoginCredentials}
          >
            <FormField
              label="Email"
              name="email"
              placeholder="Email"
              rules={[
                { type: 'required', message: 'Email is required' },
                { type: 'email', message: 'Invalid email' },
              ]}
              autoComplete="off"
              className="m-0"
            />
            <FormField
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              rules={[{ type: 'required', message: 'Password is required' }]}
              autoComplete="off"
            />
            <Button size="lg" label="Sign in" type="submit" />
          </Form>
          <GoogleSignInButton className="w-full mt-3" onClick={handleLogin} />
        </div>
      )}
    </>
  )
}

export default Login
