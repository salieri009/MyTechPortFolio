import { api } from './apiClient'
import type { Academic } from '@model/domain'
import type { ApiResponse, Page } from '@model/api'
import * as dataService from '@mocks/academics'

const USE_BACKEND_API = (import.meta as any).env.VITE_USE_BACKEND_API === 'true'

export async function getAcademics(params: { page?: number, size?: number, semester?: string }): Promise<ApiResponse<Page<Academic>>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<Page<Academic>>>('/academics', { params })
    return res.data
  }
  // 기본적으로 실제 UTS 데이터 사용
  return dataService.getAcademics(params)
}
