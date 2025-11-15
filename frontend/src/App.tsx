import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Layout } from '@components/layout/Layout'
import { LoadingSpinner } from '@components/ui/LoadingSpinner'
import { lightTheme, darkTheme } from '@styles/theme'
import { useThemeStore } from './stores/themeStore'
import { analytics } from './services/analytics'
import { useAnalytics } from './hooks/useAnalytics'
import './i18n/config'

// Route-based code splitting for better performance
const HomePage = lazy(() => import('@pages/HomePage').then(module => ({ default: module.HomePage })))
const ProjectsPage = lazy(() => import('@pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })))
const AcademicsPage = lazy(() => import('@pages/AcademicsPage').then(module => ({ default: module.AcademicsPage })))
const AboutPage = lazy(() => import('@pages/AboutPage').then(module => ({ default: module.AboutPage })))
const FeedbackPage = lazy(() => import('@pages/FeedbackPage').then(module => ({ default: module.FeedbackPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))

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
      <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <Layout>
              <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailPage />} />
                  <Route path="/academics" element={<AcademicsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                </Routes>
              </Suspense>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
