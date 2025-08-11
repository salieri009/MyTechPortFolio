import type { ApiResponse, Page } from '../types/api'
import type { ProjectDetail, ProjectSummary } from '../types/domain'

const MOCK_PROJECTS: ProjectDetail[] = [
  {
    id: 1,
    title: 'IoTBay',
    summary: 'ISD Team Project - IoT 기기를 위한 전자상거래 플랫폼',
    startDate: '2024-07-01',
    endDate: '2025-02-01',
    techStacks: ['Java', 'Spring Boot', 'MySQL', 'JSP'],
    description: '# IoTBay 프로젝트\n\nUniversity of Technology Sydney의 ISD (Internet Software Development) 팀 프로젝트입니다.\n\nIoT 기기들을 위한 전자상거래 플랫폼을 개발했습니다. 사용자는 다양한 IoT 제품을 구매하고, 판매자는 제품을 등록할 수 있습니다.\n\n## 주요 기능\n- 사용자 인증 및 권한 관리\n- 제품 카탈로그 및 검색\n- 장바구니 및 주문 시스템\n- 관리자 대시보드',
    githubUrl: 'https://github.com/salieri009/IoTBay',
    demoUrl: '',
    relatedAcademics: ['Internet Software Development', 'Database Systems'],
  },
  {
    id: 2,
    title: 'ToyProject-Gundam',
    summary: '방학 중 개인 토이 프로젝트 - 건담 정보 웹사이트',
    startDate: '2025-01-01',
    endDate: '2025-02-01',
    techStacks: ['TypeScript', 'React', 'Node.js'],
    description: '# ToyProject-Gundam\n\n방학 중 진행한 개인 토이 프로젝트입니다.\n\n건담 모델들의 정보를 제공하는 웹사이트를 TypeScript로 개발했습니다.\n\n## 주요 기능\n- 건담 모델 카탈로그\n- 상세 정보 및 이미지 갤러리\n- 검색 및 필터링 기능\n- 반응형 웹 디자인',
    githubUrl: 'https://github.com/salieri009/ToyProject-Gundam',
    demoUrl: '',
    relatedAcademics: [],
  },
  {
    id: 3,
    title: 'ThreeJSUTS26',
    summary: 'Three.js를 활용한 3D 웹 그래픽 프로젝트',
    startDate: '2025-01-01',
    endDate: '2025-02-01',
    techStacks: ['JavaScript', 'Three.js', 'WebGL'],
    description: '# ThreeJSUTS26\n\nThree.js를 활용한 3D 웹 그래픽 프로젝트입니다.\n\n3차원 그래픽을 웹 브라우저에서 구현하는 방법을 학습하고 실습했습니다.\n\n## 주요 기능\n- 3D 모델 렌더링\n- 인터랙티브 3D 씬\n- 애니메이션 효과\n- 사용자 입력 처리',
    githubUrl: 'https://github.com/salieri009/ThreeJSUTS26',
    demoUrl: '',
    relatedAcademics: ['Computer Graphics', 'Web Development'],
  },
  {
    id: 4,
    title: 'MyTistoryBlog',
    summary: '개인 블로그 웹사이트 개발',
    startDate: '2024-03-01',
    endDate: '2024-05-01',
    techStacks: ['JavaScript', 'HTML', 'CSS'],
    description: '# MyTistoryBlog\n\n개인 블로그 웹사이트입니다.\n\n기술 학습 내용과 개발 경험을 공유하는 블로그를 직접 개발했습니다.\n\n## 주요 기능\n- 글 작성 및 편집\n- 카테고리 분류\n- 검색 기능\n- 반응형 디자인',
    githubUrl: 'https://github.com/salieri009/MyTistoryBlog',
    demoUrl: 'https://igewaedam630.tistory.com/',
    relatedAcademics: [],
  },
  {
    id: 5,
    title: 'NomadCoder-TypeScript-Challenge',
    summary: 'TypeScript 학습 프로젝트 모음',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    techStacks: ['TypeScript', 'Node.js'],
    description: '# NomadCoder-TypeScript-Challenge\n\nNomad Coder의 TypeScript 강의를 수강하며 진행한 프로젝트들입니다.\n\nTypeScript의 기본 문법부터 고급 기능까지 학습했습니다.\n\n## 학습 내용\n- 타입 시스템\n- 인터페이스와 클래스\n- 제네릭\n- 유틸리티 타입',
    githubUrl: 'https://github.com/salieri009/NomadCoder-TypeScript-Challenge',
    demoUrl: '',
    relatedAcademics: [],
  },
  {
    id: 6,
    title: 'Nomad-Coder-Learning-Go',
    summary: 'Go 언어 학습 프로젝트',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    techStacks: ['Go', 'REST API'],
    description: '# Nomad-Coder-Learning-Go\n\nGo 언어를 처음 배우며 진행한 학습 프로젝트입니다.\n\nGo의 기본 문법과 웹 서버 개발을 학습했습니다.\n\n## 학습 내용\n- Go 기본 문법\n- 고루틴과 채널\n- 웹 서버 개발\n- REST API 구현',
    githubUrl: 'https://github.com/salieri009/Nomad-Coder-Learning-Go',
    demoUrl: '',
    relatedAcademics: [],
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
