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
    endDate: "2025-12-31",
    imageUrl: "https://images.unsplash.com/photo-1593642632759-78785c9f62a5?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "ThreeJSUTS26",
    summary: "Three.js와 WebGL을 이용한 3D 웹 그래픽스 프로젝트",
    techStacks: ["Three.js", "JavaScript", "WebGL", "HTML5", "CSS3"],
    startDate: "2023-02-01",
    endDate: "2023-05-31",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 3,
    title: "projects.fiveFloors.title",
    summary: "projects.fiveFloors.summary",
    techStacks: ["Game Development", "Team Collaboration", "Documentation"],
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=300&fit=crop",
    featured: true
  },
  {
    id: 4,
    title: "ToyProject-Gundam",
    summary: "TypeScript와 React를 활용한 건담 정보 웹 애플리케이션",
    techStacks: ["TypeScript", "React", "CSS", "JavaScript"],
    startDate: "2023-09-01",
    endDate: "2023-11-30",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    title: "projects.iotbay.title",
    summary: "projects.iotbay.summary",
    techStacks: ["Java", "JSP", "Maven", "Jetty", "MVC Architecture"],
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop"
  },
  {
    id: 6,
    title: "MyTechPortFolio",
    summary: "React + Spring Boot 기반 개인 포트폴리오 웹사이트",
    techStacks: ["React", "TypeScript", "Spring Boot", "JPA", "H2", "Tailwind CSS"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop"
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
    demoUrl: "https://salieri009.studio",
    imageUrl: "https://images.unsplash.com/photo-1593642632759-78785c9f62a5?w=500&h=300&fit=crop",
    featured: true,
    challenge: "기존의 정적인 포트폴리오 웹사이트를 현대적인 UI/UX로 개선하고, 모바일 사용자에게 최적화된 반응형 디자인을 제공해야 했습니다.",
    solution: [
      "모바일 퍼스트 접근법으로 설계하여 모든 디바이스에 최적화",
      "현대적인 CSS 및 JavaScript를 활용한 인터랙티브한 컴포넌트 구현",
      "성능 최적화를 통해 초기 로딩 속도 개선"
    ],
    keyOutcomes: [
      "Lighthouse 성능 점수 90점 이상 달성",
      "모바일 트래픽 35% 증가",
      "사용자 체류 시간 28% 증가"
    ]
  },
  2: {
    id: 2,
    title: "ThreeJSUTS26",
    summary: "Three.js와 WebGL을 이용한 3D 웹 그래픽스 프로젝트",
    description: `## 프로젝트 개요\nThree.js와 WebGL을 활용하여 개발한 3D 웹 그래픽스 프로젝트입니다.\n\n## 주요 기능\n- 3D 씬 렌더링\n- WebGL 기반 그래픽스\n- 인터랙티브 3D 요소\n- 웹 브라우저 최적화`,
    techStacks: ["Three.js", "JavaScript", "WebGL", "HTML5", "CSS3"],
    startDate: "2023-02-01",
    endDate: "2023-05-31",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
    featured: true,
    challenge: "WebGL의 복잡한 그래픽스 개념을 Three.js 라이브러리를 통해 추상화하고, 실시간 렌더링 성능을 유지하면서 인터랙티브한 3D 콘텐츠를 제공해야 했습니다.",
    solution: [
      "Three.js의 기본 개념(Scene, Camera, Renderer) 학습 및 구현",
      "3D 모델 및 텍스처 로딩 최적화",
      "마우스/터치 이벤트 기반 인터랙션 구현"
    ],
    keyOutcomes: [
      "60 FPS 렌더링 성능 달성",
      "다양한 브라우저 호환성 확보",
      "3D 시각화 프로젝트의 기반 기술 습득"
    ]
  },
  3: {
    id: 3,
    title: "projects.fiveFloors.title",
    summary: "projects.fiveFloors.summary",
    description: `## 프로젝트 개요\n4명의 팀원과 함께 개발한 게임 프로젝트입니다.\n\n## 주요 기능\n- 게임 개발 및 레벨 디자인\n- 팀 커뮤니케이션 및 문서화\n- 최종 레벨 디자인 담당\n- 작업 조율 및 품질 관리`,
    techStacks: ["Game Development", "Team Collaboration", "Documentation"],
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    demoUrl: "https://salierix009.itch.io/the-five-floors",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=300&fit=crop",
    featured: true,
    challenge: "팀 협업 속에서 일관된 게임 디자인을 유지하면서 각 레벨이 지속적으로 도전적인 경험을 제공하도록 설계해야 했습니다.",
    solution: [
      "레벨 디자인 문서 작성으로 팀원 간 일관성 유지",
      "게임 밸런싱 및 난이도 조정",
      "사용자 테스트를 통한 반복적 개선"
    ],
    keyOutcomes: [
      "itch.io 플랫폼에 성공적으로 배포",
      "팀 협업 및 프로젝트 관리 경험 획득",
      "게임 디자인 문서화 best practice 학습"
    ]
  },
  4: {
    id: 4,
    title: "ToyProject-Gundam",
    summary: "TypeScript와 React를 활용한 건담 정보 웹 애플리케이션",
    description: `## 프로젝트 개요\nTypeScript와 React를 활용하여 개발한 건담 정보 웹 애플리케이션입니다.\n\n## 주요 기능\n- 건담 정보 데이터베이스\n- 반응형 웹 디자인\n- 인터랙티브 UI 컴포넌트\n- 모던 웹 개발 기술 적용`,
    techStacks: ["TypeScript", "React", "CSS", "JavaScript"],
    startDate: "2023-09-01",
    endDate: "2023-11-30",
    githubUrl: "https://github.com/salieri009/ToyProject-Gundam",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    challenge: "TypeScript를 처음 사용하면서 엄격한 타입 시스템의 장점을 활용하여 안정적이고 유지보수하기 좋은 React 애플리케이션을 개발해야 했습니다.",
    solution: [
      "TypeScript의 인터페이스와 제네릭을 활용한 컴포넌트 설계",
      "React Hooks를 활용한 상태 관리",
      "CSS-in-JS 라이브러리를 통한 스타일링"
    ],
    keyOutcomes: [
      "TypeScript 기본 및 중급 개념 습득",
      "React Hooks 패턴 숙달",
      "컴포넌트 재사용성 및 확장성 향상"
    ]
  },
  5: {
    id: 5,
    title: "projects.iotbay.title",
    summary: "projects.iotbay.summary",
    description: `## 프로젝트 개요\nIoT 디바이스를 위한 온라인 소매 플랫폼으로, 고객 접근성과 판매 효율성을 향상시키기 위해 개발되었습니다.\n\n## 주요 기능\n- 사용자 인증 및 상품 브라우징\n- 쇼핑 카트 기능 및 주문 관리\n- 재고 및 주문 관리를 위한 스태프 대시보드\n- MVC 아키텍처 적용`,
    techStacks: ["Java", "JSP", "Maven", "Jetty", "MVC Architecture"],
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    githubUrl: "https://github.com/jason13657/IoTBay",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
    challenge: "전자상거래 플랫폼의 핵심 기능을 MVC 패턴으로 설계하면서, 동시에 사용자 경험과 관리자 효율성 모두를 고려해야 했습니다.",
    solution: [
      "MVC 패턴을 통한 관심사의 분리로 코드 유지보수성 향상",
      "데이터베이스 정규화를 통한 데이터 무결성 보장",
      "사용자/관리자 권한 관리 시스템 구현"
    ],
    keyOutcomes: [
      "전체 전자상거래 플로우 구현 경험 획득",
      "Java 웹 개발 및 데이터베이스 설계 능력 강화",
      "MVC 아키텍처의 실제 적용 경험"
    ]
  },
  6: {
    id: 6,
    title: "MyTechPortFolio",
    summary: "React + Spring Boot 기반 개인 포트폴리오 웹사이트",
    description: `## 프로젝트 개요\nReact와 Spring Boot를 활용하여 구축한 개인 포트폴리오 웹사이트입니다.\n\n## 주요 기능\n- 반응형 웹 디자인\n- 프로젝트 포트폴리오 관리\n- 실시간 GitHub 연동\n- 관리자 대시보드`,
    techStacks: ["React", "TypeScript", "Spring Boot", "JPA", "H2", "Tailwind CSS"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    githubUrl: "https://github.com/salieri009/MyTechPortFolio",
    demoUrl: "https://salieri009.studio",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    challenge: "개인의 다양한 프로젝트와 기술을 효과적으로 보여주면서도 동적이고 확장 가능한 포트폴리오 플랫폼을 구축해야 했습니다.",
    solution: [
      "React 18 및 TypeScript를 활용한 타입 안정성 강화",
      "Spring Boot의 JPA를 통한 데이터 관리 자동화",
      "Tailwind CSS를 통한 효율적인 스타일링"
    ],
    keyOutcomes: [
      "풀스택 개발 경험 (React + Spring Boot)",
      "CI/CD 파이프라인 구축 (GitHub Actions + Azure)",
      "다국어 지원 (i18n) 기능 구현"
    ]
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
