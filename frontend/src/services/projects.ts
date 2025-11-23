import { api } from './apiClient'
import type { ApiResponse, Page } from '../types/api'
import type { ProjectDetail, ProjectSummary, ProjectCreateRequest, ProjectUpdateRequest } from '../types/domain'
import * as dataService from '../mocks/projects'
import { getEnv } from '../utils/env'

/**
 * Get paginated list of projects
 */
export async function getProjects(params: {
  page?: number
  size?: number
  sort?: string // endDate,desc
  techStacks?: string[]
  year?: number
}): Promise<ApiResponse<Page<ProjectSummary>>> {
  const useBackend = getEnv('VITE_USE_BACKEND_API') === 'true'

  if (useBackend) {
    const res = await api.get<ApiResponse<Page<ProjectSummary>>>('/projects', {
      params: {
        page: params.page, size: params.size, sort: params.sort,
        techStacks: params.techStacks?.join(','), year: params.year,
      },
    })
    return res.data
  }
  // 기본적으로 실제 GitHub 기반 데이터 사용
  return dataService.getProjects(params)
}

/**
 * Get a single project by ID
 */
export async function getProject(id: number | string): Promise<ApiResponse<ProjectDetail>> {
  const useBackend = getEnv('VITE_USE_BACKEND_API') === 'true'

  if (useBackend) {
    const res = await api.get<ApiResponse<ProjectDetail>>(`/projects/${id}`)
    return res.data
  }
  // 기본적으로 실제 프로젝트 데이터 사용
  return dataService.getProject(id)
}

/**
 * Create a new project
 */
export async function createProject(request: ProjectCreateRequest): Promise<ApiResponse<ProjectDetail>> {
  const useBackend = getEnv('VITE_USE_BACKEND_API') === 'true'

  if (useBackend) {
    const res = await api.post<ApiResponse<ProjectDetail>>('/projects', request)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for creating projects')
}

/**
 * Update an existing project
 */
export async function updateProject(id: number | string, request: ProjectUpdateRequest): Promise<ApiResponse<ProjectDetail>> {
  const useBackend = getEnv('VITE_USE_BACKEND_API') === 'true'

  if (useBackend) {
    const res = await api.put<ApiResponse<ProjectDetail>>(`/projects/${id}`, request)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for updating projects')
}

/**
 * Delete a project
 */
export async function deleteProject(id: number | string): Promise<ApiResponse<void>> {
  const useBackend = getEnv('VITE_USE_BACKEND_API') === 'true'

  if (useBackend) {
    const res = await api.delete<ApiResponse<void>>(`/projects/${id}`)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for deleting projects')
}
