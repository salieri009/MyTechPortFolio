import { api } from './apiClient'
import type { Academic, AcademicCreateRequest, AcademicUpdateRequest } from '@model/domain'
import type { ApiResponse, Page } from '@model/api'
import * as dataService from '@mocks/academics'

const USE_BACKEND_API = (import.meta as any).env.VITE_USE_BACKEND_API === 'true'

/**
 * Get paginated list of academics
 */
export async function getAcademics(params: { page?: number, size?: number, semester?: string }): Promise<ApiResponse<Page<Academic>>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<Page<Academic>>>('/academics', { params })
    return res.data
  }
  // 기본적으로 실제 UTS 데이터 사용
  return dataService.getAcademics(params)
}

/**
 * Get a single academic by ID
 */
export async function getAcademic(id: number | string): Promise<ApiResponse<Academic>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<Academic>>(`/academics/${id}`)
    return res.data
  }
  // Mock fallback
  throw new Error('Backend API is required for getting academic by ID')
}

/**
 * Create a new academic record
 */
export async function createAcademic(request: AcademicCreateRequest): Promise<ApiResponse<Academic>> {
  if (USE_BACKEND_API) {
    const res = await api.post<ApiResponse<Academic>>('/academics', request)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for creating academics')
}

/**
 * Update an existing academic record
 */
export async function updateAcademic(id: number | string, request: AcademicUpdateRequest): Promise<ApiResponse<Academic>> {
  if (USE_BACKEND_API) {
    const res = await api.put<ApiResponse<Academic>>(`/academics/${id}`, request)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for updating academics')
}

/**
 * Delete an academic record
 */
export async function deleteAcademic(id: number | string): Promise<ApiResponse<void>> {
  if (USE_BACKEND_API) {
    const res = await api.delete<ApiResponse<void>>(`/academics/${id}`)
    return res.data
  }
  // Mock fallback - in real scenario, this should throw an error
  throw new Error('Backend API is required for deleting academics')
}
