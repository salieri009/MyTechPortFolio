import { api } from './apiClient'
import type { ApiResponse, Page } from '../types/api'
import type { ProjectDetail, ProjectSummary } from '../types/domain'
import * as mock from '../mocks/projects'

const USE_MOCK = (import.meta as any).env.VITE_USE_MOCK === 'true'

export async function getProjects(params: {
  page?: number
  size?: number
  sort?: string // endDate,desc
  techStacks?: string[]
  year?: number
}): Promise<ApiResponse<Page<ProjectSummary>>> {
  if (USE_MOCK) return mock.getProjects(params)
  const res = await api.get<ApiResponse<Page<ProjectSummary>>>('/projects', {
    params: {
      page: params.page, size: params.size, sort: params.sort,
      techStacks: params.techStacks?.join(','), year: params.year,
    },
  })
  return res.data
}

export async function getProject(id: number): Promise<ApiResponse<ProjectDetail>> {
  if (USE_MOCK) return mock.getProject(id)
  const res = await api.get<ApiResponse<ProjectDetail>>(`/projects/${id}`)
  return res.data
}
