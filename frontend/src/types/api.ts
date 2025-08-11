export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

export interface Page<T> {
  page: number
  size: number
  total: number
  items: T[]
}
