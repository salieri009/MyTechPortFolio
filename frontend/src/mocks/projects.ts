import type { ApiResponse, Page } from '../types/api'
import type { ProjectDetail, ProjectSummary } from '../types/domain'

const MOCK_PROJECTS: ProjectDetail[] = [
  {
    id: 1,
    title: 'My Tech Portfolio',
    summary: '나만의 역량을 담은 포트폴리오 허브',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    techStacks: ['React', 'TypeScript', 'Spring Boot', 'MySQL'],
    description: '# 프로젝트 개요\n\n개인 포트폴리오 웹사이트입니다.',
    githubUrl: 'https://github.com/salieri009/MyTechPortFolio',
    demoUrl: '',
    relatedAcademics: ['데이터베이스', '웹프로그래밍'],
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    summary: '실전 이커머스 플랫폼 시뮬레이션',
    startDate: '2023-08-01',
    endDate: '2023-12-31',
    techStacks: ['Java', 'Spring Security', 'PostgreSQL', 'Redis'],
    description: '# E-Commerce Platform\n\n온라인 쇼핑몰 서비스입니다.',
    githubUrl: 'https://github.com/example/ecommerce',
    relatedAcademics: ['소프트웨어공학', '데이터베이스'],
  },
  {
    id: 3,
    title: 'Chat Bot Service',
    summary: 'AI 챗봇 서비스 개발',
    startDate: '2023-05-01',
    endDate: '2023-07-31',
    techStacks: ['Python', 'FastAPI', 'Docker'],
    description: '# Chat Bot Service\n\nAI 기반 챗봇 서비스입니다.',
    githubUrl: 'https://github.com/example/chatbot',
    relatedAcademics: ['인공지능', '머신러닝'],
  },
]

export async function getProjects(params: {
  page?: number
  size?: number
  sort?: string
  techStacks?: string[]
  year?: number
}): Promise<ApiResponse<Page<ProjectSummary>>> {
  let items = [...MOCK_PROJECTS]

  // Filter by tech stacks
  if (params.techStacks?.length) {
    items = items.filter(p => 
      params.techStacks!.some(tech => p.techStacks.includes(tech))
    )
  }

  // Filter by year
  if (params.year) {
    items = items.filter(p => 
      new Date(p.startDate).getFullYear() === params.year ||
      new Date(p.endDate).getFullYear() === params.year
    )
  }

  // Sort by endDate
  if (params.sort === 'endDate,desc') {
    items.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
  } else if (params.sort === 'endDate,asc') {
    items.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
  }

  const page = params.page || 1
  const size = params.size || 12
  const start = (page - 1) * size
  const paginatedItems = items.slice(start, start + size)

  return {
    success: true,
    data: {
      page,
      size,
      total: items.length,
      items: paginatedItems.map(({ description, githubUrl, demoUrl, relatedAcademics, ...summary }) => summary),
    },
    error: null,
  }
}

export async function getProject(id: number): Promise<ApiResponse<ProjectDetail>> {
  const project = MOCK_PROJECTS.find(p => p.id === id)
  if (!project) {
    return {
      success: false,
      data: {} as ProjectDetail,
      error: 'Project not found',
    }
  }
  return {
    success: true,
    data: project,
    error: null,
  }
}
