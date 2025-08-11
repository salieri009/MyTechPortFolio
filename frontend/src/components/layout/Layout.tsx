import React from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { GlobalStyle } from '@styles/GlobalStyle'

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`

const Main = styled.main`
  flex: 1;
  padding: 40px 0;
  background-color: ${props => props.theme.colors.background};
`

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <GlobalStyle />
      <LayoutWrapper>
        <Header />
        <Main>{children}</Main>
      </LayoutWrapper>
    </>
  )
}
