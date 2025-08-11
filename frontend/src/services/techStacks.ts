import { api } from './apiClient'
import type { ApiResponse } from '@model/api'
import type { TechStack } from '@model/domain'
import * as mock from '@mocks/techStacks'

const USE_MOCK = (import.meta as any).env.VITE_USE_MOCK === 'true'

export async function getTechStacks(type?: TechStack['type']): Promise<ApiResponse<TechStack[]>> {
  if (USE_MOCK) return mock.getTechStacks(type)
  const res = await api.get<ApiResponse<TechStack[]>>('/tech-stacks', { params: { type } })
  return res.data
}
