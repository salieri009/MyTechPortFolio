import type { ApiResponse, Page } from '../types/api'
import type { Academic } from '../types/domain'

// 실제 UTS 성적표 기반 학업 데이터
const UTS_ACADEMICS: Academic[] = [
  {
    id: 1,
    name: 'Problem Solving and Programming',
    semester: 'Spring 2023',
    grade: 'HD',
    creditPoints: 12.5,
    marks: 85,
    description: 'Introduction to programming concepts and problem-solving techniques using Python',
    status: 'completed'
  },
  {
    id: 2,
    name: 'Database Design',
    semester: 'Autumn 2023',
    grade: 'D',
    creditPoints: 12.5,
    marks: 78,
    description: 'Relational database design, SQL, and database management systems',
    status: 'completed'
  },
  {
    id: 3,
    name: 'Web Systems',
    semester: 'Spring 2023',
    grade: 'HD',
    creditPoints: 12.5,
    marks: 87,
    description: 'Web development using HTML, CSS, JavaScript, and server-side technologies',
    status: 'completed'
  },
  {
    id: 4,
    name: 'Software Engineering Practice',
    semester: 'Autumn 2024',
    grade: 'D',
    creditPoints: 12.5,
    marks: 76,
    description: 'Software development lifecycle, project management, and team collaboration',
    status: 'completed'
  },
  {
    id: 5,
    name: 'Advanced Programming',
    semester: 'Spring 2024',
    grade: 'HD',
    creditPoints: 12.5,
    marks: 89,
    description: 'Object-oriented programming, design patterns, and advanced programming concepts',
    status: 'completed'
  },
  {
    id: 6,
    name: 'Data Structures and Algorithms',
    semester: 'Autumn 2024',
    grade: 'D',
    creditPoints: 12.5,
    marks: 74,
    description: 'Fundamental data structures, algorithms, and complexity analysis',
    status: 'completed'
  },
  {
    id: 7,
    name: 'Mobile Application Development',
    semester: 'Spring 2024',
    grade: 'HD',
    creditPoints: 12.5,
    marks: 91,
    description: 'iOS and Android app development using native and cross-platform frameworks',
    status: 'completed'
  },
  {
    id: 8,
    name: 'Network Fundamentals',
    semester: 'Autumn 2025',
    grade: 'D',
    creditPoints: 12.5,
    marks: 72,
    description: 'Computer networks, protocols, and network security basics',
    status: 'completed'
  },
  {
    id: 9,
    name: 'Artificial Intelligence',
    semester: 'Spring 2025',
    creditPoints: 12.5,
    description: 'Machine learning, neural networks, and AI applications',
    status: 'enrolled'
  },
  {
    id: 10,
    name: 'Cybersecurity Fundamentals',
    semester: 'Autumn 2025',
    creditPoints: 12.5,
    description: 'Information security, cryptography, and security protocols',
    status: 'enrolled'
  }
]

export async function getAcademics(params: {
  page?: number
  size?: number
  semester?: string
}): Promise<ApiResponse<Page<Academic>>> {
  let items = [...UTS_ACADEMICS]

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
