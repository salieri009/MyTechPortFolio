import { api } from '../apiClient'
import type { Page } from '../../types/api'

export interface PageResponse<T> {
  page: number
  size: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  items: T[]
}

const API_BASE = '/api/v1/projects'

export interface Project {
  id: string
  title: string
  summary: string
  description: string
  startDate: string
  endDate: string
  githubUrl?: string
  demoUrl?: string
  repositoryName?: string
  isFeatured: boolean
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  viewCount: number
  techStackIds: string[]
  relatedAcademicIds: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ProjectCreateRequest {
  title: string
  summary: string
  description: string
  startDate: string
  endDate: string
  githubUrl?: string
  demoUrl?: string
  techStackIds: string[]
  academicIds?: string[]
  isFeatured?: boolean
  status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
}

export interface ProjectUpdateRequest extends Partial<ProjectCreateRequest> {}

export interface ProjectFilters {
  techStacks?: string
  year?: number
  status?: string
}

/**
 * Projects API service for admin operations
 */
export const projectsApi = {
  /**
   * Get all projects with pagination and filters
   */
  async getAll(
    page: number = 1,
    size: number = 10,
    filters?: ProjectFilters
  ): Promise<PageResponse<Project>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (filters?.techStacks) {
      params.append('techStacks', filters.techStacks)
    }
    if (filters?.year) {
      params.append('year', filters.year.toString())
    }
    
    const response = await api.get(`/api/v1/projects?${params.toString()}`)
    return response.data.data
  },

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<Project> {
    const response = await api.get(`/api/v1/projects/${id}`)
    return response.data.data
  },

  /**
   * Create new project
   */
  async create(data: ProjectCreateRequest): Promise<Project> {
    const response = await api.post(`/api/v1/projects`, data)
    return response.data.data
  },

  /**
   * Update project
   */
  async update(id: string, data: ProjectUpdateRequest): Promise<Project> {
    const response = await api.put(`/api/v1/projects/${id}`, data)
    return response.data.data
  },

  /**
   * Delete project
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/projects/${id}`)
  }
}

