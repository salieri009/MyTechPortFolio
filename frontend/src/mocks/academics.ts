import type { ApiResponse, Page } from '../types/api'
import type { Academic } from '../types/domain'

const MOCK_ACADEMICS: Academic[] = [
  {
    id: 1,
    name: '자료구조',
    semester: '2학년 1학기',
    grade: 'A+',
    description: '기본적인 자료구조와 알고리즘을 학습',
  },
  {
    id: 2,
    name: '데이터베이스',
    semester: '2학년 2학기',
    grade: 'A',
    description: 'SQL 및 관계형 데이터베이스 설계',
  },
  {
    id: 3,
    name: '웹프로그래밍',
    semester: '3학년 1학기',
    grade: 'A+',
    description: 'HTML, CSS, JavaScript 및 프론트엔드 개발',
  },
  {
    id: 4,
    name: '소프트웨어공학',
    semester: '3학년 2학기',
    grade: 'A',
    description: '소프트웨어 개발 생명주기 및 설계 패턴',
  },
]

export async function getAcademics(params: {
  page?: number
  size?: number
  semester?: string
}): Promise<ApiResponse<Page<Academic>>> {
  let items = [...MOCK_ACADEMICS]

  if (params.semester) {
    items = items.filter(a => a.semester.includes(params.semester!))
  }

  const page = params.page || 1
  const size = params.size || 20
  const start = (page - 1) * size
  const paginatedItems = items.slice(start, start + size)

  return {
    success: true,
    data: {
      page,
      size,
      total: items.length,
      items: paginatedItems,
    },
    error: null,
  }
}
