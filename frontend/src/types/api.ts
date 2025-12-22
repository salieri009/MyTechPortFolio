export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error: string | null
  errorCode?: string
  errors?: Record<string, string> // For validation errors
  metadata?: ResponseMetadata
}

export interface ResponseMetadata {
  timestamp: string
  version: string
  requestId?: string
}

export interface Page<T> {
  page: number
  size: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  items: T[]
}
