import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

/**
 * API Client Configuration
 * Handles authentication, error handling, retries, and timeout management.
 */

// Azure 배포를 위한 API 기본 URL 설정
const getApiBaseUrl = () => {
  // 개발 환경에서는 프록시 사용
  if (import.meta.env.DEV) {
    return '/api'
  }
  
  // 프로덕션 환경에서는 환경 변수 사용
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  if (apiBaseUrl) {
    return apiBaseUrl
  }
  
  // 기본값
  return '/api'
}

// API Configuration
const API_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
})

const AUTH_MODE = (import.meta as any).env.VITE_AUTH_MODE || 'demo'

/**
 * Request interceptor for authentication
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add JWT token if available
    if (AUTH_MODE === 'jwt') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: Date.now() }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for error handling and retry logic
 */
api.interceptors.response.use(
  (response) => {
    // Calculate response time
    const config = response.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }
    if (config.metadata?.startTime) {
      const responseTime = Date.now() - config.metadata.startTime
      // Log slow requests (> 2 seconds)
      if (responseTime > 2000) {
        console.warn(`Slow API request: ${config.method?.toUpperCase()} ${config.url} took ${responseTime}ms`)
      }
    }
    
    // Extract data from ApiResponse wrapper if present
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (!response.data.success && response.data.error) {
        // Backend returned an error in the response body
        const error = new Error(response.data.error)
        ;(error as any).response = response
        ;(error as any).isApiError = true
        return Promise.reject(error)
      }
      // Return the data field if wrapped
      if (response.data.data !== undefined) {
        response.data = response.data.data
      }
    }
    
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { 
      _retry?: boolean
      metadata?: { startTime: number }
    }) | undefined
    
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('API Request timeout:', error.config?.url)
        return Promise.reject(new Error('Request timeout. Please check your connection and try again.'))
      }
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('Network error:', error.config?.url)
        return Promise.reject(new Error('Network error. Please check your internet connection.'))
      }
      
      console.error('API Error (no response):', error)
      return Promise.reject(new Error('Unable to connect to server. Please try again later.'))
    }
    
    const status = error.response.status
    const responseData = error.response.data as any
    
    // Extract error message from backend response
    let errorMessage = 'An error occurred'
    if (responseData?.error) {
      errorMessage = responseData.error
    } else if (responseData?.message) {
      errorMessage = responseData.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // Handle specific HTTP status codes
    switch (status) {
      case 401:
        // Unauthorized - clear auth and redirect to login
        if (AUTH_MODE === 'jwt') {
          localStorage.removeItem('token')
          // Don't redirect automatically, let components handle it
          console.warn('Unauthorized - token may be expired')
        }
        return Promise.reject(new Error('Authentication required. Please log in again.'))
      
      case 403:
        return Promise.reject(new Error('Access denied. You do not have permission to perform this action.'))
      
      case 404:
        return Promise.reject(new Error('Resource not found.'))
      
      case 409:
        return Promise.reject(new Error(responseData?.message || 'Conflict: Resource already exists.'))
      
      case 429:
        return Promise.reject(new Error('Too many requests. Please try again later.'))
      
      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - retry logic
        if (originalRequest && !originalRequest._retry) {
          originalRequest._retry = true
          
          // Retry with exponential backoff
          const retryCount = (originalRequest._retryCount || 0) + 1
          if (retryCount <= MAX_RETRIES) {
            originalRequest._retryCount = retryCount
            const delay = RETRY_DELAY * Math.pow(2, retryCount - 1)
            
            console.warn(`Retrying request (${retryCount}/${MAX_RETRIES}) after ${delay}ms:`, originalRequest.url)
            
            await new Promise(resolve => setTimeout(resolve, delay))
            return api(originalRequest)
          }
        }
        return Promise.reject(new Error('Server error. Please try again later.'))
      
      default:
        return Promise.reject(new Error(errorMessage || `Request failed with status ${status}`))
    }
  }
)

/**
 * Helper function to extract error message from API error
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    if (axiosError.message) {
      return axiosError.message
    }
  }
  
  return 'An unexpected error occurred'
}

/**
 * Helper function to check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response && (error.code === 'ERR_NETWORK' || error.message.includes('Network Error'))
  }
  return false
}

/**
 * Helper function to check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout')
  }
  return false
}
