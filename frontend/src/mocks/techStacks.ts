import type { ApiResponse } from '../types/api'
import type { TechStack } from '../types/domain'

const MOCK_TECH_STACKS: TechStack[] = [
  { id: 1, name: 'React', type: 'Frontend' },
  { id: 2, name: 'TypeScript', type: 'Frontend' },
  { id: 3, name: 'Spring Boot', type: 'Backend' },
  { id: 4, name: 'Java', type: 'Backend' },
  { id: 5, name: 'MySQL', type: 'DB' },
  { id: 6, name: 'PostgreSQL', type: 'DB' },
  { id: 7, name: 'Redis', type: 'DB' },
  { id: 8, name: 'Python', type: 'Backend' },
  { id: 9, name: 'FastAPI', type: 'Backend' },
  { id: 10, name: 'Docker', type: 'DevOps' },
  { id: 11, name: 'Spring Security', type: 'Backend' },
]

export async function getTechStacks(type?: TechStack['type']): Promise<ApiResponse<TechStack[]>> {
  let items = [...MOCK_TECH_STACKS]

  if (type) {
    items = items.filter(t => t.type === type)
  }

  return {
    success: true,
    data: items,
    error: null,
  }
}
