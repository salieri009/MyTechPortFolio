import React, { useEffect } from 'react'
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
  // 페이지 하단 도달 시 자동 스크롤 기능
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight
      
      // 페이지 하단에 도달했을 때 (98% 지점에서 트리거)
      if (scrollTop + clientHeight >= scrollHeight * 0.98) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 1000) // 1초 후 자동 스크롤
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
