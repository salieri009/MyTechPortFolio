import { api } from '../apiClient'

export interface PageResponse<T> {
  page: number
  size: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  items: T[]
}

const API_BASE = '/api/v1/academics'

export interface Academic {
  id: string
  name: string
  semester: string
  grade?: string
  description?: string
  relatedProjects?: Array<{
    id: string
    title: string
  }>
}

export interface AcademicCreateRequest {
  name: string
  semester: string
  grade?: string
  description?: string
}

export interface AcademicUpdateRequest extends Partial<AcademicCreateRequest> {}

export interface AcademicFilters {
  semester?: string
}

/**
 * Academics API service for admin operations
 */
export const academicsApi = {
  /**
   * Get all academics with pagination and filters
   */
  async getAll(
    page: number = 1,
    size: number = 10,
    filters?: AcademicFilters
  ): Promise<PageResponse<Academic>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (filters?.semester) {
      params.append('semester', filters.semester)
    }
    
    const response = await api.get(`/api/v1/academics?${params.toString()}`)
    return response.data.data
  },

  /**
   * Get academic by ID
   */
  async getById(id: string): Promise<Academic> {
    const response = await api.get(`/api/v1/academics/${id}`)
    return response.data.data
  },

  /**
   * Create new academic
   */
  async create(data: AcademicCreateRequest): Promise<Academic> {
    const response = await api.post(`/api/v1/academics`, data)
    return response.data.data
  },

  /**
   * Update academic
   */
  async update(id: string, data: AcademicUpdateRequest): Promise<Academic> {
    const response = await api.put(`/api/v1/academics/${id}`, data)
    return response.data.data
  },

  /**
   * Delete academic
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/academics/${id}`)
  }
}

