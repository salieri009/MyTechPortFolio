import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Layout } from '@components/layout/Layout'
import { HomePage } from '@pages/HomePage'
import { ProjectsPage } from '@pages/ProjectsPage'
import { ProjectDetailPage } from '@pages/ProjectDetailPage'
import { AcademicsPage } from '@pages/AcademicsPage'
import { AboutPage } from '@pages/AboutPage'
import { LoginPage } from './pages/LoginPage'
import { lightTheme, darkTheme } from '@styles/theme'
import { useThemeStore } from './stores/themeStore'
import { analytics } from './services/analytics'
import { useAnalytics } from './hooks/useAnalytics'
import './i18n/config'

function App() {
  const { isDark } = useThemeStore()
  const currentTheme = isDark ? darkTheme : lightTheme
  
  // Analytics 초기화
  useEffect(() => {
    analytics.init().catch(error => {
      console.error('Analytics 초기화 실패:', error)
    })
  }, [])

  // Analytics Hook 사용 (페이지 추적 자동화)
  useAnalytics()

  return (
    <ThemeProvider theme={currentTheme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/academics" element={<AcademicsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </ThemeProvider>
  )
}

export default App
