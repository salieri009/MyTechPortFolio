import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { validateEnvironment } from './utils/envValidation'

// Validate environment variables on startup
try {
  validateEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
  // In development, continue anyway (may use proxy)
  if (!import.meta.env.DEV) {
    throw error
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
