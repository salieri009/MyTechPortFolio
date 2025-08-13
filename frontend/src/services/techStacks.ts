import { api } from './apiClient'
import type { ApiResponse } from '@model/api'
import type { TechStack } from '@model/domain'
import * as dataService from '@mocks/techStacks'

const USE_BACKEND_API = (import.meta as any).env.VITE_USE_BACKEND_API === 'true'

export async function getTechStacks(type?: TechStack['type']): Promise<ApiResponse<TechStack[]>> {
  if (USE_BACKEND_API) {
    const res = await api.get<ApiResponse<TechStack[]>>('/tech-stacks', { params: { type } })
    return res.data
  }
  // 기본적으로 실제 기술 스택 데이터 사용
  return dataService.getTechStacks(type)
}
