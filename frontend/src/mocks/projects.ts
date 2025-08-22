import type { ApiResponse, Page } from '../types/api'
import type { ProjectDetail, ProjectSummary } from '../types/domain'

// 실제 GitHub 리포지토리 기반 프로젝트 데이터
const GITHUB_PROJECTS: ProjectSummary[] = [
  {
    id: 1,
    title: "projects.portfolioWebsite.title",
    summary: "projects.portfolioWebsite.summary",
    techStacks: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    startDate: "2025-08-01",
    endDate: "2025-12-31"
  },
  {
    id: 2,
    title: "projects.threejsProject.title",
    summary: "projects.threejsProject.summary",
    techStacks: ["Three.js", "Vue.js", "JavaScript", "3D Graphics"],
    startDate: "2025-03-01",
    endDate: "2025-12-31"
  },
  {
    id: 3,
    title: "projects.fiveFloors.title",
    summary: "projects.fiveFloors.summary",
    techStacks: ["Game Development", "Team Collaboration", "Documentation"],
    startDate: "2025-03-01",
    endDate: "2025-05-31"
  },
  {
    id: 4,
    title: "projects.toyGundamBoard.title",
    summary: "projects.toyGundamBoard.summary",
    techStacks: ["CursorAI", "Bolts", "Rapid Development", "AI Integration"],
    startDate: "2025-07-01",
    endDate: "2025-07-31"
  },
  {
    id: 5,
    title: "projects.iotbay.title",
    summary: "projects.iotbay.summary",
    techStacks: ["Java", "JSP", "Maven", "Jetty", "MVC Architecture"],
    startDate: "2025-04-01",
    endDate: "2025-06-30"
  },
  {
    id: 6,
    title: "MyTechPortFolio",
    summary: "React + Spring Boot 기반 개인 포트폴리오 웹사이트",
    techStacks: ["React", "TypeScript", "Spring Boot", "JPA", "H2", "Tailwind CSS"],
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  },
  {
    id: 7,
    title: "ToyProject-Gundam",
    summary: "TypeScript와 React를 활용한 건담 정보 웹 애플리케이션",
    techStacks: ["TypeScript", "React", "CSS", "JavaScript"],
    startDate: "2023-09-01",
    endDate: "2023-11-30"
  },
  {
    id: 8,
    title: "ThreeJSUTS26",
    summary: "Three.js와 WebGL을 이용한 3D 웹 그래픽스 프로젝트",
    techStacks: ["Three.js", "JavaScript", "WebGL", "HTML5", "CSS3"],
    startDate: "2023-02-01",
    endDate: "2023-05-31"
  },
  {
    id: 9,
    title: "MyTistoryBlog",
    summary: "개인 기술 블로그 템플릿 및 커스터마이징",
    techStacks: ["HTML", "CSS", "JavaScript", "Tistory"],
    startDate: "2023-01-01",
    endDate: "2023-12-31"
  },
  {
    id: 10,
    title: "NomadCoder-Zoom-Clone",
    summary: "Node.js와 Socket.io를 활용한 화상회의 앱 클론",
    techStacks: ["Node.js", "Socket.io", "Express", "WebRTC", "JavaScript"],
    startDate: "2022-08-01",
    endDate: "2022-10-31"
  },
  {
    id: 11,
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
    title: "projects.portfolioWebsite.title",
    summary: "projects.portfolioWebsite.summary",
    description: `## 프로젝트 개요\nHTML5, CSS3, JavaScript를 활용하여 구축한 반응형 개인 포트폴리오 웹사이트입니다.\n\n## 주요 기능\n- 모바일 퍼스트 반응형 디자인\n- 현대적인 UI/UX 디자인\n- 학업 프로젝트 및 기술 스택 전시\n- 실시간 라이브 데모\n\n## 기술적 특징\n- Frontend: HTML5, CSS3, JavaScript\n- 반응형 웹 디자인\n- 모바일 퍼스트 접근법\n- 라이브 사이트: salieri009.studio`,
    techStacks: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    startDate: "2025-08-01",
    endDate: "2025-12-31",
    demoUrl: "https://salieri009.studio"
  },
  2: {
    id: 2,
    title: "projects.threejsProject.title",
    summary: "projects.threejsProject.summary",
    description: `## 프로젝트 개요\nThree.js와 Vue.js를 활용하여 개발한 인터랙티브 3D 웹 애플리케이션입니다.\n\n## 주요 기능\n- 3D 씬 및 애니메이션 디자인\n- 사용자 인터랙션 통합\n- 3D 그래픽스 및 웹 렌더링 기술 구현\n- 실시간 3D 시각화\n\n## 기술적 특징\n- 3D Graphics: Three.js\n- Frontend Framework: Vue.js\n- Web Rendering: WebGL\n- Interactive Design`,
    techStacks: ["Three.js", "Vue.js", "JavaScript", "3D Graphics"],
    startDate: "2025-03-01",
    endDate: "2025-12-31"
  },
  3: {
    id: 3,
    title: "projects.fiveFloors.title",
    summary: "projects.fiveFloors.summary",
    description: `## 프로젝트 개요\n4명의 팀원과 함께 개발한 게임 프로젝트입니다.\n\n## 주요 기능\n- 게임 개발 및 레벨 디자인\n- 팀 커뮤니케이션 및 문서화\n- 최종 레벨 디자인 담당\n- 작업 조율 및 품질 관리\n\n## 기술적 특징\n- 팀 협업 및 프로젝트 관리\n- 게임 디자인 및 개발\n- 문서화 및 커뮤니케이션\n- 라이브 사이트: salierix009.itch.io/the-five-floors`,
    techStacks: ["Game Development", "Team Collaboration", "Documentation"],
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    demoUrl: "https://salierix009.itch.io/the-five-floors"
  },
  4: {
    id: 4,
    title: "projects.toyGundamBoard.title",
    summary: "projects.toyGundamBoard.summary",
    description: `## 프로젝트 개요\nCursorAI와 Bolts를 활용하여 빠른 애플리케이션 개발을 테스트한 토이 프로젝트입니다.\n\n## 주요 기능\n- AI 기반 입력 처리 실험\n- 인터랙티브 기능 구현\n- 빠른 애플리케이션 개발 테스트\n- AI 통합 개발 경험\n\n## 기술적 특징\n- AI Integration: CursorAI\n- Rapid Development: Bolts\n- Interactive Functionality\n- Repository: salieri009/ToyProject-Gundam`,
    techStacks: ["CursorAI", "Bolts", "Rapid Development", "AI Integration"],
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    githubUrl: "https://github.com/salieri009/ToyProject-Gundam"
  },
  5: {
    id: 5,
    title: "projects.iotbay.title",
    summary: "projects.iotbay.summary",
    description: `## 프로젝트 개요\nIoT 디바이스를 위한 온라인 소매 플랫폼으로, 고객 접근성과 판매 효율성을 향상시키기 위해 개발되었습니다.\n\n## 주요 기능\n- 사용자 인증 및 상품 브라우징\n- 쇼핑 카트 기능 및 주문 관리\n- 재고 및 주문 관리를 위한 스태프 대시보드\n- MVC 아키텍처 적용\n\n## 기술적 특징\n- Backend: Java, JSP, Maven, Jetty\n- Architecture: MVC Pattern\n- Database: MySQL\n- Deployment: Jetty Server\n- Repository: jason13657/IoTBay`,
    techStacks: ["Java", "JSP", "Maven", "Jetty", "MVC Architecture"],
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    githubUrl: "https://github.com/jason13657/IoTBay"
  },
  6: {
    id: 6,
    title: "MyTechPortFolio",
    summary: "React + Spring Boot 기반 개인 포트폴리오 웹사이트",
    description: `## 프로젝트 개요\nReact와 Spring Boot를 활용하여 구축한 개인 포트폴리오 웹사이트입니다.\n\n## 주요 기능\n- 반응형 웹 디자인\n- 프로젝트 포트폴리오 관리\n- 실시간 GitHub 연동\n- 관리자 대시보드\n\n## 기술적 특징\n- Frontend: React 18, TypeScript, Tailwind CSS\n- Backend: Spring Boot 3, Spring Data JPA\n- Database: H2 (개발), MySQL (프로덕션)\n- 배포: Azure Static Web Apps`,
    techStacks: ["React", "TypeScript", "Spring Boot", "JPA", "H2", "Tailwind CSS"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    githubUrl: "https://github.com/salieri009/MyTechPortFolio",
    demoUrl: "https://salieri009.studio"
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
