import type { ApiResponse } from '../types/api'
import type { TechStack } from '../types/domain'

const MOCK_TECH_STACKS: TechStack[] = [
  // Frontend
  { id: 1, name: 'React', type: 'Frontend' },
  { id: 2, name: 'TypeScript', type: 'Frontend' },
  { id: 3, name: 'Vite', type: 'Frontend' },
  { id: 4, name: 'styled-components', type: 'Frontend' },
  { id: 5, name: 'Three.js', type: 'Frontend' },
  { id: 6, name: 'JavaScript', type: 'Frontend' },
  { id: 7, name: 'HTML', type: 'Frontend' },
  { id: 8, name: 'CSS', type: 'Frontend' },
  { id: 9, name: 'Zustand', type: 'Frontend' },
  { id: 10, name: 'react-i18next', type: 'Frontend' },
  
  // Backend
  { id: 11, name: 'Java', type: 'Backend' },
  { id: 12, name: 'Spring Boot', type: 'Backend' },
  { id: 13, name: 'Spring Security', type: 'Backend' },
  { id: 14, name: 'JSP', type: 'Backend' },
  { id: 15, name: 'Node.js', type: 'Backend' },
  { id: 16, name: 'Express', type: 'Backend' },
  { id: 17, name: 'Python', type: 'Backend' },
  { id: 18, name: 'FastAPI', type: 'Backend' },
  { id: 19, name: 'Go', type: 'Backend' },
  { id: 20, name: 'REST API', type: 'Backend' },
  
  // Database
  { id: 21, name: 'MySQL', type: 'DB' },
  { id: 22, name: 'PostgreSQL', type: 'DB' },
  { id: 23, name: 'MongoDB', type: 'DB' },
  { id: 24, name: 'Redis', type: 'DB' },
  { id: 25, name: 'SQLite', type: 'DB' },
  
  // DevOps & Tools
  { id: 26, name: 'Docker', type: 'DevOps' },
  { id: 27, name: 'Git', type: 'DevOps' },
  { id: 28, name: 'GitHub', type: 'DevOps' },
  { id: 29, name: 'GitHub Actions', type: 'DevOps' },
  { id: 30, name: 'Azure', type: 'DevOps' },
  { id: 31, name: 'Vercel', type: 'DevOps' },
  { id: 32, name: 'Netlify', type: 'DevOps' },
  
  // Other
  { id: 33, name: 'WebGL', type: 'Other' },
  { id: 34, name: 'JWT', type: 'Other' },
  { id: 35, name: 'OAuth', type: 'Other' },
  { id: 36, name: 'PWA', type: 'Other' },
  { id: 37, name: 'Responsive Design', type: 'Other' },
  { id: 38, name: 'API Design', type: 'Other' },
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
