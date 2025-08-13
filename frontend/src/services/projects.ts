import { api } from './apiClient'
import type { ApiResponse, Page } from '../types/api'
import type { ProjectDetail, ProjectSummary } from '../types/domain'
import * as dataService from '../mocks/projects'

const USE_BACKEND_API = (import.meta as any).env.VITE_USE_BACKEND_API === 'true'

export async function getProjects(params: {
  page?: number
  size?: number
  sort?: string // endDate,desc
  techStacks?: string[]
  year?: number
}): Promise<ApiResponse<Page<ProjectSummary>>> {
  if (USE_BACKEND_API) {
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

export async function getProject(id: number): Promise<ApiResponse<ProjectDetail>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<ProjectDetail>>(`/projects/${id}`)
    return res.data
  }
  // 기본적으로 실제 프로젝트 데이터 사용
  return dataService.getProject(id)
}
