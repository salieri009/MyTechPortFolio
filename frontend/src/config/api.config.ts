/**
 * API Configuration
 * Centralizes all API-related constants to eliminate magic numbers
 * and enable environment-based configuration.
 */

/**
 * Get environment variable with fallback
 */
const getEnvNumber = (key: string, defaultValue: number): number => {
    const value = import.meta.env[key]
    return value ? parseInt(value, 10) : defaultValue
}

export const API_CONFIG = {
    /**
     * Timeout settings (in milliseconds)
     */
    timeout: {
        /** Default API request timeout */
        default: getEnvNumber('VITE_API_TIMEOUT', 30000),
        /** Extended timeout for file uploads */
        upload: 60000,
        /** Extended timeout for file downloads */
        download: 120000
    },

    /**
     * Retry settings for failed requests
     */
    retry: {
        /** Maximum number of retry attempts */
        maxAttempts: getEnvNumber('VITE_API_MAX_RETRIES', 3),
        /** Base delay between retries (ms) */
        baseDelay: 1000,
        /** Maximum delay between retries (ms) */
        maxDelay: 10000,
        /** HTTP status codes that should trigger a retry */
        retryableStatuses: [500, 502, 503, 504] as const
    },

    /**
     * Performance monitoring thresholds
     */
    performance: {
        /** Requests slower than this (ms) will trigger a warning */
        slowRequestThreshold: 2000,
        /** Whether to log slow request warnings */
        warnOnSlowRequest: import.meta.env.DEV
    },

    /**
     * HTTP status code utilities
     */
    status: {
        /** Check if status is a success (2xx) */
        isSuccess: (s: number) => s >= 200 && s < 300,
        /** Check if status is a client error (4xx) */
        isClientError: (s: number) => s >= 400 && s < 500,
        /** Check if status is a server error (5xx) */
        isServerError: (s: number) => s >= 500,
        /** Status codes that shouldn't throw in axios */
        dontThrow: (s: number) => s < 500
    }
} as const

export type ApiConfig = typeof API_CONFIG
export type RetryableStatus = typeof API_CONFIG.retry.retryableStatuses[number]

/**
 * Check if a status code is retryable
 */
export function isRetryableStatus(status: number): status is RetryableStatus {
    return (API_CONFIG.retry.retryableStatuses as readonly number[]).includes(status)
}

/**
 * Calculate exponential backoff delay
 */
export function calculateRetryDelay(attempt: number): number {
    const delay = API_CONFIG.retry.baseDelay * Math.pow(2, attempt - 1)
    return Math.min(delay, API_CONFIG.retry.maxDelay)
}
