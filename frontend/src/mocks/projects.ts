import type { ApiResponse, Page } from '../types/api'
import type { ProjectDetail, ProjectSummary } from '../types/domain'

// 실제 GitHub 리포지토리 기반 프로젝트 데이터
const GITHUB_PROJECTS: ProjectSummary[] = [
  {
    id: 1,
    title: "MyTechPortFolio",
    summary: "React + Spring Boot 기반 개인 포트폴리오 웹사이트",
    techStacks: ["React", "TypeScript", "Spring Boot", "JPA", "H2", "Tailwind CSS"],
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  },
  {
    id: 2,
    title: "IoTBay",
    summary: "Java 기반 IoT 제품 전자상거래 플랫폼",
    techStacks: ["Java", "JSP", "Servlet", "MySQL", "CSS", "JavaScript"],
    startDate: "2023-03-01",
    endDate: "2023-06-30"
  },
  {
    id: 3,
    title: "ToyProject-Gundam",
    summary: "TypeScript와 React를 활용한 건담 정보 웹 애플리케이션",
    techStacks: ["TypeScript", "React", "CSS", "JavaScript"],
    startDate: "2023-09-01",
    endDate: "2023-11-30"
  },
  {
    id: 4,
    title: "ThreeJSUTS26",
    summary: "Three.js와 WebGL을 이용한 3D 웹 그래픽스 프로젝트",
    techStacks: ["Three.js", "JavaScript", "WebGL", "HTML5", "CSS3"],
    startDate: "2023-02-01",
    endDate: "2023-05-31"
  },
  {
    id: 5,
    title: "MyTistoryBlog",
    summary: "개인 기술 블로그 템플릿 및 커스터마이징",
    techStacks: ["HTML", "CSS", "JavaScript", "Tistory"],
    startDate: "2023-01-01",
    endDate: "2023-12-31"
  },
  {
    id: 6,
    title: "NomadCoder-Zoom-Clone",
    summary: "Node.js와 Socket.io를 활용한 화상회의 앱 클론",
    techStacks: ["Node.js", "Socket.io", "Express", "WebRTC", "JavaScript"],
    startDate: "2022-08-01",
    endDate: "2022-10-31"
  },
  {
    id: 7,
    title: "NomadCoder-Momentum",
    summary: "바닐라 JavaScript로 구현한 Chrome Momentum 확장프로그램 클론",
    techStacks: ["JavaScript", "HTML5", "CSS3", "Web APIs"],
    startDate: "2022-05-01",
    endDate: "2022-07-31"
  }
]

const PROJECT_DETAILS: Record<number, ProjectDetail> = {
  1: {
    id: 1,
    title: "MyTechPortFolio",
    summary: "React + Spring Boot 기반 개인 포트폴리오 웹사이트",
    description: `## 프로젝트 개요\nReact와 Spring Boot를 활용하여 구축한 개인 포트폴리오 웹사이트입니다.\n\n## 주요 기능\n- 반응형 웹 디자인\n- 프로젝트 포트폴리오 관리\n- 실시간 GitHub 연동\n- 관리자 대시보드\n\n## 기술적 특징\n- Frontend: React 18, TypeScript, Tailwind CSS\n- Backend: Spring Boot 3, Spring Data JPA\n- Database: H2 (개발), MySQL (프로덕션)\n- 배포: Azure Static Web Apps`,
    techStacks: ["React", "TypeScript", "Spring Boot", "JPA", "H2", "Tailwind CSS"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    githubUrl: "https://github.com/salieri009/MyTechPortFolio",
    demoUrl: "https://salieri009.studio"
  },
  2: {
    id: 2,
    title: "IoTBay",
    summary: "Java 기반 IoT 제품 전자상거래 플랫폼",
    description: `## 프로젝트 개요\nIoT 제품을 판매하는 전자상거래 플랫폼을 Java와 JSP로 구현한 프로젝트입니다.\n\n## 주요 기능\n- 상품 카탈로그 및 검색\n- 장바구니 및 주문 시스템\n- 사용자 인증 및 권한 관리\n- 관리자 페이지\n\n## 기술적 특징\n- MVC 패턴 적용\n- MySQL 데이터베이스 연동\n- 세션 기반 인증\n- RESTful API 설계`,
    techStacks: ["Java", "JSP", "Servlet", "MySQL", "CSS", "JavaScript"],
    startDate: "2023-03-01",
    endDate: "2023-06-30",
    githubUrl: "https://github.com/salieri009/IoTBay"
  }
}

export async function getProjects(params: {
  page?: number
  size?: number
  sort?: string
  techStacks?: string[]
  year?: number
}): Promise<ApiResponse<Page<ProjectSummary>>> {
  const { page = 0, size = 10, techStacks, year } = params
  
  let filteredProjects = GITHUB_PROJECTS
  
  if (techStacks && techStacks.length > 0) {
    filteredProjects = filteredProjects.filter(project =>
      techStacks.some(tech => project.techStacks.includes(tech))
    )
  }
  
  if (year) {
    filteredProjects = filteredProjects.filter(project =>
      new Date(project.startDate).getFullYear() === year ||
      new Date(project.endDate).getFullYear() === year
    )
  }
  
  const start = page * size
  const end = start + size
  const items = filteredProjects.slice(start, end)
  
  return {
    success: true,
    data: {
      page,
      size,
      total: filteredProjects.length,
      items
    },
    error: null
  }
}

export async function getProject(id: number): Promise<ApiResponse<ProjectDetail>> {
  const project = PROJECT_DETAILS[id]
  if (!project) {
    return {
      success: false,
      data: {} as ProjectDetail,
      error: '프로젝트를 찾을 수 없습니다.'
    }
  }
  
  return {
    success: true,
    data: project,
    error: null
  }
}

export async function getTechStacks(): Promise<ApiResponse<string[]>> {
  const allTechStacks = Array.from(
    new Set(GITHUB_PROJECTS.flatMap(project => project.techStacks))
  ).sort()
  
  return {
    success: true,
    data: allTechStacks,
    error: null
  }
}
