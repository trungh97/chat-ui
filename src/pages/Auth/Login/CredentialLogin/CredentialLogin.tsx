import React from 'react'
import { Button, Form, FormField } from 'shared-ui'
import { useCredentialLogin } from './hooks'

export const CredentialLogin = () => {
  const { handleLogin } = useCredentialLogin()

  return (
    <Form autoComplete="off" className="mt-8 w-full" onSubmit={handleLogin}>
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
  )
}

export default CredentialLogin
