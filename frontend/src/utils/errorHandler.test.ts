import { describe, it, expect } from 'vitest'
import { AxiosError } from 'axios'
import { analyzeError, getUserFriendlyErrorMessage, isRetryableError } from './errorHandler'

describe('Error Handler Utilities', () => {
  it('TC-FU-012: should analyze network errors correctly', () => {
    const networkError = new Error('Network Error')
    const errorInfo = analyzeError(networkError)
    
    expect(errorInfo.type).toBe('unknown')
    expect(errorInfo.message).toBe('Network Error')
  })

  it('TC-FU-013: should analyze 401 authentication errors', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: { error: 'Unauthorized' }
      }
    } as AxiosError
    
    const errorInfo = analyzeError(axiosError)
    
    expect(errorInfo.type).toBe('auth')
    expect(errorInfo.statusCode).toBe(401)
    expect(errorInfo.retryable).toBe(false)
  })

  it('TC-FU-014: should analyze 400 validation errors', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: 'Invalid input' }
      }
    } as AxiosError
    
    const errorInfo = analyzeError(axiosError)
    
    expect(errorInfo.type).toBe('validation')
    expect(errorInfo.statusCode).toBe(400)
    expect(errorInfo.retryable).toBe(false)
  })

  it('TC-FU-015: should analyze 500 server errors as retryable', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: { error: 'Internal Server Error' }
      }
    } as AxiosError
    
    const errorInfo = analyzeError(axiosError)
    
    expect(errorInfo.type).toBe('server')
    expect(errorInfo.statusCode).toBe(500)
    expect(errorInfo.retryable).toBe(true)
  })

  it('TC-FU-016: should return user-friendly error message', () => {
    const error = new Error('Technical error message')
    const message = getUserFriendlyErrorMessage(error)
    
    expect(message).toBe('Technical error message')
  })

  it('TC-FU-017: should correctly identify retryable errors', () => {
    const retryableError = {
      isAxiosError: true,
      response: { status: 500 }
    } as AxiosError
    
    const nonRetryableError = {
      isAxiosError: true,
      response: { status: 400 }
    } as AxiosError
    
    expect(isRetryableError(retryableError)).toBe(true)
    expect(isRetryableError(nonRetryableError)).toBe(false)
  })
})

