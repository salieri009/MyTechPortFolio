import { api } from './apiClient'
import type { Academic } from '@model/domain'
import type { ApiResponse, Page } from '@model/api'
import * as mock from '@mocks/academics'

const USE_MOCK = (import.meta as any).env.VITE_USE_MOCK === 'true'

export async function getAcademics(params: { page?: number, size?: number, semester?: string }): Promise<ApiResponse<Page<Academic>>> {
  if (USE_MOCK) return mock.getAcademics(params)
  const res = await api.get<ApiResponse<Page<Academic>>>('/academics', { params })
  return res.data
}
