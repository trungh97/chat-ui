import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Text as SharedText, VectorIcon } from 'slack-shared-ui'

const About = () => {
  const navigate = useNavigate()
  return (
    <div>
      <SharedText />
      <Button
        icon={<VectorIcon />}
        iconPosition="trailing"
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

export default About
