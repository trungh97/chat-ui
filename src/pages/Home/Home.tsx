import { ChatBox } from '@components/ChatBox'
import { Layout } from '@components/Layout'
import { QuickLaunch } from '@components/Layout/QuickLaunch'
import { useMeQuery } from '@generated/graphql'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Divider } from 'shared-ui'
import { ChatMessageSection } from './ChatMessageSection'

const Home = () => {
  const { loading, data } = useMeQuery()
  const navigate = useNavigate()

  if (!loading && !data) {
    navigate('/login')
  }

  return (
    <>
      <Layout>
        <QuickLaunch />
        <Divider orientation="vertical" color="#e9eaeb" />
        <ChatBox />
        <ChatMessageSection />
      </Layout>
    </>
  )
}

export default Home
