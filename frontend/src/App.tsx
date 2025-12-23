import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Layout } from '@components/layout/Layout'
import { LoadingSpinner } from '@components/ui/LoadingSpinner'
import { lightTheme, darkTheme } from '@styles/theme'
import { useThemeStore } from './stores/themeStore'
import { analytics } from './services/analytics'
import { useAnalytics } from './hooks/useAnalytics'
import { FeedbackOverlay } from '@components/feedback/FeedbackOverlay'
import './i18n/config'

// Route-based code splitting for better performance
const HomePage = lazy(() => import('@pages/HomePage').then(module => ({ default: module.HomePage })))
const ProjectsPage = lazy(() => import('@pages/ProjectsPage'))
const ProjectDetailOverlay = lazy(() => import('@components/project/ProjectDetailOverlay').then(module => ({ default: module.ProjectDetailOverlay })))
const ProjectDetailPage = lazy(() => import('@pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })))
const AcademicsPage = lazy(() => import('@pages/AcademicsPage').then(module => ({ default: module.AcademicsPage })))
const AboutPage = lazy(() => import('@pages/AboutPage').then(module => ({ default: module.AboutPage })))
const FeedbackPage = lazy(() => import('@pages/FeedbackPage').then(module => ({ default: module.FeedbackPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const GitHubCallbackPage = lazy(() => import('./pages/GitHubCallbackPage').then(module => ({ default: module.GitHubCallbackPage })))
const AdminLayout = lazy(() => import('@components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })))
const AdminDashboard = lazy(() => import('@pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
const AdminRoute = lazy(() => import('@components/admin/AdminRoute').then(module => ({ default: module.AdminRoute })))
const ProjectsAdminPage = lazy(() => import('@pages/admin/ProjectsAdminPage').then(module => ({ default: module.ProjectsAdminPage })))
const ProjectForm = lazy(() => import('@components/admin/forms/ProjectForm').then(module => ({ default: module.ProjectForm })))
const AcademicsAdminPage = lazy(() => import('@pages/admin/AcademicsAdminPage').then(module => ({ default: module.AcademicsAdminPage })))
const AcademicForm = lazy(() => import('@components/admin/forms/AcademicForm').then(module => ({ default: module.AcademicForm })))
const TestimonialsAdminPage = lazy(() => import('@pages/admin/TestimonialsAdminPage').then(module => ({ default: module.TestimonialsAdminPage })))
const TestimonialForm = lazy(() => import('@components/admin/forms/TestimonialForm').then(module => ({ default: module.TestimonialForm })))
const JourneyMilestonesAdminPage = lazy(() => import('@pages/admin/JourneyMilestonesAdminPage').then(module => ({ default: module.JourneyMilestonesAdminPage })))

// Wrapper components for lazy-loaded forms with props
function ProjectFormWrapper({ mode }: { mode: 'create' | 'edit' }) {
  return <ProjectForm mode={mode} />
}

function AcademicFormWrapper({ mode }: { mode: 'create' | 'edit' }) {
  return <AcademicForm mode={mode} />
}

function TestimonialFormWrapper({ mode }: { mode: 'create' | 'edit' }) {
  return <TestimonialForm mode={mode} />
}

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
      <FeedbackOverlay />
      {/* ProjectDetailOverlay is now rendered as a child route of /projects, not a global component */}
      <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsAdminPage />} />
            <Route path="projects/new" element={<ProjectFormWrapper mode="create" />} />
            <Route path="projects/:id/edit" element={<ProjectFormWrapper mode="edit" />} />
            <Route path="academics" element={<AcademicsAdminPage />} />
            <Route path="academics/new" element={<AcademicFormWrapper mode="create" />} />
            <Route path="academics/:id/edit" element={<AcademicFormWrapper mode="edit" />} />
            <Route path="testimonials" element={<TestimonialsAdminPage />} />
            <Route path="testimonials/new" element={<TestimonialFormWrapper mode="create" />} />
            <Route path="testimonials/:id/edit" element={<TestimonialFormWrapper mode="edit" />} />
            <Route path="milestones" element={<JourneyMilestonesAdminPage />} />
            {/* Additional milestone routes:
                <Route path="milestones/new" element={<MilestoneForm mode="create" />} />
                <Route path="milestones/:id/edit" element={<MilestoneForm mode="edit" />} />
            */}
          </Route>
          <Route path="/*" element={
            <Layout>
              <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  {/* Hybrid Routing: /projects is parent route with <Outlet />, /projects/:id is child route rendering ProjectDetailOverlay */}
                  <Route path="/projects" element={<ProjectsPage />}>
                    <Route path=":id" element={<ProjectDetailOverlay />} />
                  </Route>
                  {/* Legacy route for direct URL access - kept for backward compatibility and SEO */}
                  <Route path="/projects/:id" element={<ProjectDetailPage />} />
                  <Route path="/academics" element={<AcademicsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  {/* LEGACY ROUTE: /feedback - 이 경로는 레거시입니다. 모든 링크는 모달 트리거를 사용해야 합니다. FeedbackOverlay를 사용하세요. */}
                  {/* <Route path="/feedback" element={<FeedbackPage />} /> */}
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
