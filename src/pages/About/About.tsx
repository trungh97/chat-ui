import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Text as SharedText, VectorIcon } from 'shared-ui'

export const AboutPage = () => {
  const navigate = useNavigate()
  return (
    <div>
      <SharedText />
      <Button
        icon={{
          content: <VectorIcon />,
          position: 'trailing',
        }}
        intent="primary"
        size="2xl"
        label="Click me"
        onClick={() => {
          navigate('/')
        }}
      />
    </div>
  )
}

export default AboutPage
