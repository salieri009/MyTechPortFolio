# Atomic Design Pattern

## 개요

Atomic Design은 디자인 시스템을 구성하는 컴포넌트를 원자(Atoms), 분자(Molecules), 유기체(Organisms), 템플릿(Templates), 페이지(Pages)로 분류하는 방법론입니다. 본 프로젝트는 이 패턴을 채택하여 컴포넌트를 체계적으로 구성하고 있습니다.

## Atomic Design 계층 구조

```
Pages (페이지)
  └── Templates (템플릿)
      └── Organisms (유기체)
          └── Molecules (분자)
              └── Atoms (원자)
```

## Atoms (원자)

**위치**: `src/components/ui/`

가장 작은 단위의 재사용 가능한 컴포넌트입니다. 더 이상 분해할 수 없는 기본 UI 요소입니다.

### 예시 컴포넌트

- **Button**: 버튼 컴포넌트
- **Card**: 카드 컨테이너
- **Tag**: 태그/배지 컴포넌트
- **Typography**: 텍스트 스타일 컴포넌트
- **LoadingSpinner**: 로딩 스피너
- **Container**: 레이아웃 컨테이너

### 특징

- **독립적**: 다른 컴포넌트에 의존하지 않음
- **재사용 가능**: 여러 곳에서 사용 가능
- **단순함**: 하나의 명확한 목적만 가짐

### 예시 코드

```typescript
// Button.tsx (Atom)
export function Button({ variant, size, children, ...props }: ButtonProps) {
  return (
    <ButtonBase variant={variant} size={size} {...props}>
      {children}
    </ButtonBase>
  )
}
```

## Molecules (분자)

**위치**: `src/components/project/`, `src/components/testimonials/` 등

Atoms를 조합하여 만든 복합 컴포넌트입니다. 하나의 기능 단위를 형성합니다.

### 예시 컴포넌트

- **ProjectCard**: 프로젝트 카드 (Card + Tag + Button 조합)
- **TestimonialCard**: 추천 카드 (Card + Typography 조합)
- **FeaturedProjectCard**: 특별 프로젝트 카드

### 특징

- **조합**: 여러 Atoms를 조합하여 구성
- **기능 단위**: 하나의 명확한 기능을 수행
- **재사용 가능**: 다른 Organisms에서 사용 가능

### 예시 코드

```typescript
// ProjectCard.tsx (Molecule)
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <Typography variant="h3">{project.title}</Typography>
      <Tag>{project.techStack[0]}</Tag>
      <Button>View Details</Button>
    </Card>
  )
}
```

## Organisms (유기체)

**위치**: `src/components/sections/`, `src/components/layout/`

Molecules와 Atoms를 조합하여 만든 복잡한 컴포넌트입니다. 페이지의 주요 섹션을 구성합니다.

### 예시 컴포넌트

- **Header**: 헤더 (Logo + Navigation + ThemeToggle 조합)
- **Footer**: 푸터 (FooterBranding + FooterNav + FooterContact 조합)
- **ProjectShowcaseSection**: 프로젝트 쇼케이스 섹션
- **JourneyMilestoneSection**: 여정 마일스톤 섹션
- **TechStackSection**: 기술 스택 섹션

### 특징

- **복잡성**: 여러 Molecules와 Atoms를 조합
- **섹션 단위**: 페이지의 주요 섹션을 구성
- **독립적**: 자체 상태와 로직을 가질 수 있음

### 예시 코드

```typescript
// ProjectShowcaseSection.tsx (Organism)
export function ProjectShowcaseSection() {
  const [projects, setProjects] = useState([])
  
  return (
    <Section>
      <SectionTitle>Projects</SectionTitle>
      <Grid>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>
    </Section>
  )
}
```

## Pages (페이지)

**위치**: `src/pages/`

Organisms를 조합하여 만든 전체 페이지입니다.

### 예시 페이지

- **HomePage**: 홈 페이지
- **ProjectsPage**: 프로젝트 목록 페이지
- **ProjectDetailPage**: 프로젝트 상세 페이지
- **AboutPage**: 소개 페이지

### 특징

- **최상위 컴포넌트**: 라우트와 연결되는 최상위 컴포넌트
- **조합**: 여러 Organisms를 조합하여 구성
- **데이터 페칭**: 페이지 레벨에서 데이터 페칭 수행

### 예시 코드

```typescript
// HomePage.tsx (Page)
export function HomePage() {
  return (
    <>
      <Hero />
      <JourneyMilestoneSection />
      <ProjectShowcaseSection />
      <TechStackSection />
    </>
  )
}
```

## 디렉토리 구조

```
src/components/
├── ui/                    # Atoms
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Tag.tsx
│   └── Typography.tsx
├── project/               # Molecules
│   ├── ProjectCard.tsx
│   └── FeaturedProjectCard.tsx
├── sections/              # Organisms
│   ├── ProjectShowcaseSection.tsx
│   └── JourneyMilestoneSection.tsx
└── layout/                # Organisms
    ├── Header.tsx
    └── Footer.tsx
```

## Atomic Design의 장점

### 1. 재사용성
- 작은 단위부터 큰 단위까지 체계적으로 재사용 가능
- 일관된 디자인 시스템 구축

### 2. 유지보수성
- 각 컴포넌트의 역할이 명확하여 수정이 용이
- 변경 사항이 다른 컴포넌트에 미치는 영향 최소화

### 3. 확장성
- 새로운 기능 추가 시 기존 컴포넌트 조합으로 쉽게 구현
- 디자인 시스템 확장이 용이

### 4. 협업 효율성
- 디자이너와 개발자 간 명확한 소통 도구
- 컴포넌트 단위로 작업 분담 가능

## 모범 사례

### 1. Atoms는 순수하게 유지
- Atoms는 다른 컴포넌트에 의존하지 않아야 함
- 비즈니스 로직을 포함하지 않음

### 2. Molecules는 기능 단위로 구성
- 하나의 명확한 기능을 수행
- 재사용 가능하도록 설계

### 3. Organisms는 독립적으로 동작
- 자체 상태와 로직을 가질 수 있음
- API 호출 등 복잡한 로직 포함 가능

### 4. Pages는 조합만 담당
- Pages는 주로 Organisms를 조합하는 역할
- 데이터 페칭은 가능하지만 UI 로직은 최소화

## 주의사항

### 1. 과도한 분리 지양
- 너무 작게 분리하면 오히려 복잡도 증가
- 실제 재사용성과 유지보수성을 고려하여 분리

### 2. 계층 간 의존성 주의
- 상위 계층은 하위 계층에만 의존
- 하위 계층이 상위 계층에 의존하지 않도록 주의

### 3. 네이밍 일관성
- 각 계층의 역할을 명확히 나타내는 네이밍
- 일관된 네이밍 컨벤션 유지









