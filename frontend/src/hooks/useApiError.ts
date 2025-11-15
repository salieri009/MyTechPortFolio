import { useState, useCallback } from 'react'
import { AxiosError } from 'axios'
import { getApiErrorMessage, isNetworkError, isTimeoutError } from '@services/apiClient'

/**
 * Custom hook for handling API errors.
 * Provides error state management and helper functions.
 * 
 * Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 */
export function useApiError() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleError = useCallback((error: unknown) => {
    let errorMessage = getApiErrorMessage(error)
    
    // Provide user-friendly messages for common errors
    if (isNetworkError(error)) {
      errorMessage = 'Network connection error. Please check your internet connection and try again.'
    } else if (isTimeoutError(error)) {
      errorMessage = 'Request timed out. Please try again.'
    } else if (error instanceof AxiosError) {
      const status = error.response?.status
      if (status === 401) {
        errorMessage = 'Your session has expired. Please log in again.'
      } else if (status === 403) {
        errorMessage = 'You do not have permission to perform this action.'
      } else if (status === 404) {
        errorMessage = 'The requested resource was not found.'
      } else if (status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      }
    }
    
    setError(errorMessage)
    console.error('API Error:', error)
    return errorMessage
  }, [])
  
  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  const executeWithErrorHandling = useCallback(async <T,>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true)
    clearError()
    
    try {
      const result = await apiCall()
      return result
    } catch (error) {
      handleError(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [handleError, clearError])
  
  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  }
}

