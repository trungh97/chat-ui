import React from 'react'
import { useNavigate } from 'react-router-dom'

const Button = React.lazy(() =>
  import('ui/Button').then((module) => ({ default: module.Button })),
)

const SharedText = React.lazy(() =>
  import('ui/Text').then((module) => ({ default: module.Text })),
)

const VectorIcon = React.lazy(() =>
  import('ui/Icons').then((module) => ({ default: module.VectorIcon })),
)

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
