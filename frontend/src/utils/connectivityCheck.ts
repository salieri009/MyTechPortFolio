import { api } from '../services/apiClient'

/**
 * Connectivity check utility.
 * Tests API connectivity and health status.
 */

export interface ConnectivityStatus {
  connected: boolean
  backendHealth: 'healthy' | 'unhealthy' | 'unknown'
  responseTime?: number
  error?: string
  timestamp: string
}

/**
 * Checks backend health endpoint.
 * 
 * @returns Health status
 */
export async function checkBackendHealth(): Promise<ConnectivityStatus> {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  try {
    // Try to reach health endpoint
    const response = await fetch('/api/v1/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout for health check
      signal: AbortSignal.timeout(5000),
    })
    
    const responseTime = Date.now() - startTime
    
    if (response.ok) {
      return {
        connected: true,
        backendHealth: 'healthy',
        responseTime,
        timestamp,
      }
    } else {
      return {
        connected: false,
        backendHealth: 'unhealthy',
        responseTime,
        error: `Health check returned status ${response.status}`,
        timestamp,
      }
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      connected: false,
      backendHealth: 'unknown',
      responseTime,
      error: errorMessage,
      timestamp,
    }
  }
}

/**
 * Tests API connectivity by making a simple request.
 * 
 * @param endpoint API endpoint to test (default: /projects with minimal params)
 * @returns Connectivity status
 */
export async function testApiConnectivity(endpoint = '/projects?page=1&size=1'): Promise<ConnectivityStatus> {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  try {
    const response = await api.get(endpoint, {
      timeout: 10000, // 10 second timeout
    })
    
    const responseTime = Date.now() - startTime
    
    if (response.status >= 200 && response.status < 300) {
      return {
        connected: true,
        backendHealth: 'healthy',
        responseTime,
        timestamp,
      }
    } else {
      return {
        connected: false,
        backendHealth: 'unhealthy',
        responseTime,
        error: `API returned status ${response.status}`,
        timestamp,
      }
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    let errorMessage = 'Unknown error'
    
    if (error.response) {
      errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`
    } else if (error.request) {
      errorMessage = 'No response from server (network error)'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return {
      connected: false,
      backendHealth: 'unknown',
      responseTime,
      error: errorMessage,
      timestamp,
    }
  }
}

/**
 * Comprehensive connectivity check (health + API test).
 * 
 * @returns Combined connectivity status
 */
export async function checkConnectivity(): Promise<{
  health: ConnectivityStatus
  api: ConnectivityStatus
  overall: {
    connected: boolean
    healthy: boolean
  }
}> {
  const [health, apiStatus] = await Promise.allSettled([
    checkBackendHealth(),
    testApiConnectivity(),
  ])
  
  const healthResult = health.status === 'fulfilled' 
    ? health.value 
    : {
        connected: false,
        backendHealth: 'unknown' as const,
        error: health.reason?.message || 'Health check failed',
        timestamp: new Date().toISOString(),
      }
  
  const apiResult = apiStatus.status === 'fulfilled'
    ? apiStatus.value
    : {
        connected: false,
        backendHealth: 'unknown' as const,
        error: apiStatus.reason?.message || 'API test failed',
        timestamp: new Date().toISOString(),
      }
  
  return {
    health: healthResult,
    api: apiResult,
    overall: {
      connected: healthResult.connected || apiResult.connected,
      healthy: healthResult.backendHealth === 'healthy' && apiResult.backendHealth === 'healthy',
    },
  }
}
