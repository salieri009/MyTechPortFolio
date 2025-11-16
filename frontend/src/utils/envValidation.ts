/**
 * Environment variable validation utility.
 * Ensures all required environment variables are present at application startup.
 * 
 * @throws Error if required environment variables are missing
 */

interface EnvConfig {
  required: string[]
  optional: string[]
}

const ENV_CONFIG: EnvConfig = {
  required: [
    // API configuration
    'VITE_API_BASE_URL', // Optional in dev (uses proxy), required in prod
  ],
  optional: [
    'VITE_USE_BACKEND_API',
    'VITE_AUTH_MODE',
    'VITE_GOOGLE_CLIENT_ID',
  ]
}

/**
 * Validates environment variables.
 * Throws error if required variables are missing.
 */
export function validateEnvironment(): void {
  const missing: string[] = []
  
  // In development, VITE_API_BASE_URL is optional (uses proxy)
  const isDev = import.meta.env.DEV
  const requiredVars = isDev 
    ? ENV_CONFIG.required.filter(v => v !== 'VITE_API_BASE_URL')
    : ENV_CONFIG.required
  
  requiredVars.forEach((key) => {
    const value = import.meta.env[key]
    if (!value || value.trim() === '') {
      missing.push(key)
    }
  })
  
  if (missing.length > 0) {
    const errorMessage = `
Missing required environment variables:
${missing.map(key => `  - ${key}`).join('\n')}

Please check your .env file or environment configuration.
    `.trim()
    
    console.error(errorMessage)
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  // Log configuration status (development only)
  if (isDev) {
    console.debug('Environment Configuration:', {
      'VITE_USE_BACKEND_API': import.meta.env.VITE_USE_BACKEND_API,
      'VITE_AUTH_MODE': import.meta.env.VITE_AUTH_MODE,
      'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL || 'Using proxy (/api)',
    })
  }
}

/**
 * Gets environment variable with fallback.
 * 
 * @param key Environment variable key
 * @param defaultValue Default value if not set
 * @returns Environment variable value or default
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key]
  return value || defaultValue || ''
}

/**
 * Gets boolean environment variable.
 * 
 * @param key Environment variable key
 * @param defaultValue Default value if not set
 * @returns Boolean value
 */
export function getEnvBoolean(key: string, defaultValue = false): boolean {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

