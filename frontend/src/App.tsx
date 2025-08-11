import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Layout } from '@components/layout/Layout'
import { HomePage } from '@pages/HomePage'
import { ProjectsPage } from '@pages/ProjectsPage'
import { ProjectDetailPage } from '@pages/ProjectDetailPage'
import { AcademicsPage } from '@pages/AcademicsPage'
import { AboutPage } from '@pages/AboutPage'
import { theme } from '@styles/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
