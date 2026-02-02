/**
 * Centralized error handling utilities.
 * Provides consistent error handling across the application.
 */

import axios, { AxiosError } from 'axios'
import { getApiErrorMessage, isNetworkError, isTimeoutError } from '@services/apiClient'

export interface ErrorInfo {
  message: string
  type: 'network' | 'timeout' | 'auth' | 'validation' | 'server' | 'unknown'
  statusCode?: number
  retryable: boolean
}

/**
 * Analyzes an error and returns structured error information.
 * 
 * @param error The error to analyze
 * @returns Structured error information
 */
export function analyzeError(error: unknown): ErrorInfo {
  // Network errors
  if (isNetworkError(error)) {
    return {
      message: 'Network connection error. Please check your internet connection.',
      type: 'network',
      retryable: true,
    }
  }

  // Timeout errors
  if (isTimeoutError(error)) {
    return {
      message: 'Request timed out. Please try again.',
      type: 'timeout',
      retryable: true,
    }
  }

  // Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string; errorCode?: string }>
    const status = axiosError.response?.status
    const responseData = axiosError.response?.data

    // Authentication errors
    if (status === 401) {
      return {
        message: 'Your session has expired. Please log in again.',
        type: 'auth',
        statusCode: 401,
        retryable: false,
      }
    }

    // Authorization errors
    if (status === 403) {
      return {
        message: 'You do not have permission to perform this action.',
        type: 'auth',
        statusCode: 403,
        retryable: false,
      }
    }

    // Validation errors
    if (status === 400 || status === 422) {
      const message = responseData?.error || responseData?.message || 'Invalid request. Please check your input.'
      return {
        message,
        type: 'validation',
        statusCode: status,
        retryable: false,
      }
    }

    // Not found
    if (status === 404) {
      return {
        message: 'The requested resource was not found.',
        type: 'unknown',
        statusCode: 404,
        retryable: false,
      }
    }

    // Rate limiting
    if (status === 429) {
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        type: 'server',
        statusCode: 429,
        retryable: true,
      }
    }

    // Server errors
    if (status && status >= 500) {
      return {
        message: responseData?.error || responseData?.message || 'Server error. Please try again later.',
        type: 'server',
        statusCode: status,
        retryable: true,
      }
    }

    // Other HTTP errors
    return {
      message: getApiErrorMessage(error),
      type: 'unknown',
      statusCode: status,
      retryable: (status && status >= 500) || false,
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      message: error.message,
      type: 'unknown',
      retryable: false,
    }
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'unknown',
    retryable: false,
  }
}

/**
 * Gets user-friendly error message.
 * 
 * @param error The error
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  return analyzeError(error).message
}

/**
 * Checks if an error is retryable.
 * 
 * @param error The error to check
 * @returns true if the error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  return analyzeError(error).retryable
}

