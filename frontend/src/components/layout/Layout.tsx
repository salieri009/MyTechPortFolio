import React from 'react'
import styled from 'styled-components'
import { Header } from './Header'

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  padding: 40px 0;
`

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <LayoutWrapper>
      <Header />
      <Main>{children}</Main>
    </LayoutWrapper>
  )
}
