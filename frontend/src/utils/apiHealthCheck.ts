/**
 * API Health Check Utility
 * Checks backend connectivity and health status.
 */

import { api } from '@services/apiClient'

export interface HealthStatus {
  isHealthy: boolean
  responseTime: number
  timestamp: Date
  error?: string
}

/**
 * Checks API health by calling the health endpoint.
 * 
 * @returns Health status
 */
export async function checkApiHealth(): Promise<HealthStatus> {
  const startTime = Date.now()
  
  try {
    const response = await api.get('/actuator/health', {
      timeout: 5000, // 5 second timeout for health check
    })
    
    const responseTime = Date.now() - startTime
    const isHealthy = response.status === 200
    
    return {
      isHealthy,
      responseTime,
      timestamp: new Date(),
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    return {
      isHealthy: false,
      responseTime,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Checks if API is reachable.
 * 
 * @returns true if API is reachable
 */
export async function isApiReachable(): Promise<boolean> {
  try {
    const health = await checkApiHealth()
    return health.isHealthy
  } catch {
    return false
  }
}

