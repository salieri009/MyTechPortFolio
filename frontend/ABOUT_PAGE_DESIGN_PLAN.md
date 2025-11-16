# About Page 상세 디자인 계획 (코드 재활용 중심)

## 참고 자료
- [Kinsta: 30 Examples of Stellar About Us Pages](https://kinsta.com/blog/about-us-page/)
- 기존 프롬프트 규칙 준수:
  - 4-point spacing system
  - KickoffLabs 가이드라인 (색상, 폰트 일관성)
  - Nielsen's 10 Usability Heuristics
  - 프론트엔드 개발자 포트폴리오 디자인 프롬프트

## 1. 재활용 가능한 기존 컴포넌트

### 1.1 스타일 컴포넌트 (HomePage.styles.ts에서 재사용)
```typescript
// AboutHero에 재사용
- Hero (배경, 패딩, 레이아웃)
- HeroContent (Z-pattern 그리드)
- HeroLeft, HeroRight (좌우 분할)
- Greeting, Name, Headline, Subtitle (타이포그래피)
- CTAButtons, PrimaryCTA, SecondaryCTA (버튼 스타일)
- SocialLinks, SocialLink (소셜 링크)
```

### 1.2 섹션 컴포넌트 (재사용)
```typescript
// 이미 구현된 컴포넌트들
- SectionPurpose (섹션 목적 설명)
- SectionBridge (섹션 간 시각적 다리)
- JourneyMilestoneSection (F-pattern 타임라인)
- Container (공통 컨테이너)
- Card (카드 스타일)
```

### 1.3 공통 컴포넌트
```typescript
- Button (CTA 버튼)
- Tag (기술 스택 태그)
- ScrollIndicator (스크롤 힌트)
```

## 2. 페이지 구조 (코드 재활용 중심)

### 2.1 AboutHero Section
**재사용**: `HomePage.styles.ts`의 Hero 스타일

```typescript
// AboutPage.styles.ts
import { 
  Hero, 
  HeroContent, 
  HeroLeft, 
  HeroRight,
  Greeting,
  Name,
  Headline,
  Subtitle,
  CTAButtons,
  PrimaryCTA,
  SecondaryCTA,
  SocialLinks,
  SocialLink
} from '@pages/HomePage.styles'

// 약간의 커스터마이징만 필요
const AboutHero = styled(Hero)`
  // Hero 스타일 그대로 사용, 필요시 약간의 오버라이드
`

const ProfileImage = styled.img`
  width: ${props => props.theme.spacing[40]}; /* 160px */
  height: ${props => props.theme.spacing[40]};
  border-radius: ${props => props.theme.radius.full};
  border: ${props => props.theme.spacing[1]} solid ${props => props.theme.colors.hero.border};
  box-shadow: ${props => props.theme.shadows.lg};
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: ${props => props.theme.spacing[32]}; /* 128px */
    height: ${props => props.theme.spacing[32]};
  }
`
```

**레이아웃**:
- Z-pattern 유지 (HomePage와 동일)
- 좌측: Greeting + Name + Headline + Subtitle + CTAButtons
- 우측: ProfileImage + SocialLinks

### 2.2 Story Section
**재사용**: `JourneyMilestoneSection.tsx`의 F-pattern 그리드 구조

```typescript
// JourneyMilestoneSection의 그리드 구조 재사용
import { JourneyGrid, TextColumn } from '@components/sections/JourneyMilestoneSection'

// StorySection.tsx
const StorySection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  
  // JourneyMilestoneSection과 동일한 스타일
`

const StoryTextColumn = styled(TextColumn)`
  // TextColumn 스타일 재사용
`

const StoryVisualColumn = styled.div`
  grid-column: 8 / 13; /* 5 columns */
  
  @media (max-width: 1024px) {
    grid-column: 4 / 7; /* 3 columns */
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`

// SectionPurpose 재사용
<SectionPurpose text={t('about.storyPurpose')} />
```

**컴포넌트 구조**:
```typescript
<StorySection>
  <Container>
    <JourneyGrid> {/* 재사용 */}
      <StoryTextColumn> {/* TextColumn 재사용 */}
        <SectionTitle>My Journey</SectionTitle>
        <SectionPurpose text="..." />
        <StoryText>...</StoryText>
      </StoryTextColumn>
      <StoryVisualColumn>
        <TimelineStartPoint />
        <EarlyProjectImage />
      </StoryVisualColumn>
    </JourneyGrid>
  </Container>
</StorySection>
```

### 2.3 Background Section
**재사용**: `AboutPage.tsx`의 ContactSection 스타일 + Card 컴포넌트

```typescript
// AboutPage.tsx의 ContactItem 스타일 재사용
import { ContactItem, ContactLabel, ContactValue } from '@pages/AboutPage'

// BackgroundSection.tsx
const BackgroundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${props => props.theme.spacing[6]};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const BackgroundCard = styled(Card)` {/* Card 컴포넌트 재사용 */}
  grid-column: span 4; /* 3-column grid */
  
  @media (max-width: 1024px) {
    grid-column: span 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
  
  // ContactItem의 호버 효과 재사용
  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-${props => props.theme.spacing[0.5]});
  }
`
```

**컴포넌트 구조**:
```typescript
<BackgroundSection>
  <Container>
    <SectionTitle>Background & Skills</SectionTitle>
    <SectionPurpose text="..." />
    <BackgroundGrid>
      <BackgroundCard>
        <CardTitle>Education</CardTitle>
        <CardContent>...</CardContent>
      </BackgroundCard>
      <BackgroundCard>
        <CardTitle>Experience</CardTitle>
        <CardContent>...</CardContent>
      </BackgroundCard>
      <BackgroundCard>
        <CardTitle>Tech Stack</CardTitle>
        <TechTags> {/* Tag 컴포넌트 재사용 */}
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
        </TechTags>
      </BackgroundCard>
    </BackgroundGrid>
  </Container>
</BackgroundSection>
```

### 2.4 Evolution Timeline Section
**재사용**: `JourneyMilestoneSection` 컴포넌트 전체

```typescript
// AboutPage.tsx
import { JourneyMilestoneSection } from '@components/sections/JourneyMilestoneSection'

// 그대로 사용, SectionBridge로 연결
<SectionBridge 
  text={t('storytelling.backgroundToJourney')}
  variant="secondary"
  diagonal={true}
/>
<JourneyMilestoneSection /> {/* 완전 재사용 */}
```

### 2.5 Mission & Vision Section
**재사용**: `HomePage.styles.ts`의 FeaturedSection 스타일 + Card

```typescript
// HomePage.styles.ts의 FeaturedSection 스타일 참고
const MissionVisionSection = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.background};
  
  // FeaturedSection과 유사한 구조
`

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[12]};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ValueCard = styled(Card)` {/* Card 재사용 */}
  grid-column: span 4;
  text-align: center;
  padding: ${props => props.theme.spacing[8]};
  
  // ContactItem의 호버 효과 재사용
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]});
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  @media (max-width: 1024px) {
    grid-column: span 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`

const ValueIcon = styled.div`
  font-size: ${props => props.theme.spacing[12]}; /* 48px */
  margin-bottom: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.primary[500]};
`

const MissionText = styled.div`
  max-width: ${props => props.theme.spacing[200]}; /* 800px */
  margin: 0 auto ${props => props.theme.spacing[8]};
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.lg};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  color: ${props => props.theme.colors.textSecondary};
`
```

**컴포넌트 구조**:
```typescript
<MissionVisionSection>
  <Container>
    <SectionTitle>Mission & Vision</SectionTitle>
    <SectionPurpose text="..." />
    <ValuesGrid>
      <ValueCard>
        <ValueIcon>💡</ValueIcon>
        <ValueTitle>Innovation</ValueTitle>
        <ValueDescription>...</ValueDescription>
      </ValueCard>
      {/* 3개 ValueCard */}
    </ValuesGrid>
    <MissionText>...</MissionText>
    <VisionText>...</VisionText>
    <CTAButtons> {/* HomePage.styles 재사용 */}
      <PrimaryCTA to="/contact">Let's Connect</PrimaryCTA>
    </CTAButtons>
  </Container>
</MissionVisionSection>
```

### 2.6 Contact Section
**재사용**: `AboutPage.tsx`의 기존 ContactSection

```typescript
// AboutPage.tsx의 ContactSection 그대로 사용
// 약간의 스타일 개선만 필요
const ContactSection = styled(Card)`
  // 기존 스타일 유지
  // 접근성 개선 추가
  role="region"
  aria-label="Contact information"
`
```

## 3. 섹션 간 연결 (SectionBridge 재사용)

```typescript
// AboutPage.tsx
<AboutHero />
<SectionBridge 
  text={t('storytelling.heroToStory')}
  variant="primary"
  diagonal={true}
  overlap={true}
/>

<StorySection />
<SectionBridge 
  text={t('storytelling.storyToBackground')}
  variant="secondary"
  diagonal={true}
/>

<BackgroundSection />
<SectionBridge 
  text={t('storytelling.backgroundToJourney')}
  variant="secondary"
/>

<JourneyMilestoneSection />
<SectionBridge 
  text={t('storytelling.journeyToMission')}
  variant="secondary"
  diagonal={true}
/>

<MissionVisionSection />
<SectionBridge 
  text={t('storytelling.missionToContact')}
  variant="primary"
  diagonal={true}
/>

<ContactSection />
```

## 4. 스크롤 애니메이션 (HomePage 패턴 재사용)

```typescript
// AboutPage.tsx
const [isHeroVisible, setIsHeroVisible] = useState(false)
const [isStoryVisible, setIsStoryVisible] = useState(false)
// ... 각 섹션별 visibility state

const heroRef = useRef<HTMLElement>(null)
const storyRef = useRef<HTMLElement>(null)
// ... 각 섹션별 ref

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // HomePage와 동일한 패턴
          if (entry.target === heroRef.current) setIsHeroVisible(true)
          if (entry.target === storyRef.current) setIsStoryVisible(true)
          // ...
        }
      })
    },
    { threshold: 0.2 }
  )
  
  // 각 섹션 observe
  // HomePage.tsx와 동일한 패턴
}, [])
```

## 5. i18n 추가 항목

```json
// ko.json, en.json, ja.json에 추가
{
  "about": {
    "hero": {
      "greeting": "안녕하세요, 저는",
      "name": "정욱 반",
      "headline": "풀스택 개발자",
      "subtitle": "문제 해결을 즐기는 개발자입니다. React, TypeScript, Spring Boot를 활용하여 사용자 경험을 개선하는 것에 열정을 가지고 있습니다.",
      "cta": {
        "primary": "프로젝트 보기",
        "secondary": "연락하기"
      }
    },
    "story": {
      "title": "My Journey",
      "purpose": "개발자로서의 여정과 포트폴리오를 만든 동기를 소개합니다.",
      "content": "..."
    },
    "background": {
      "title": "Background & Skills",
      "purpose": "교육 배경, 경력, 그리고 핵심 기술 스택을 소개합니다.",
      "education": {
        "title": "Education",
        "content": "..."
      },
      "experience": {
        "title": "Experience",
        "content": "..."
      },
      "techStack": {
        "title": "Tech Stack",
        "content": "..."
      }
    },
    "mission": {
      "title": "Mission & Vision",
      "purpose": "개발자로서의 미션과 기술적 비전을 공유합니다.",
      "values": {
        "innovation": {
          "title": "Innovation",
          "description": "..."
        },
        "collaboration": {
          "title": "Collaboration",
          "description": "..."
        },
        "growth": {
          "title": "Continuous Growth",
          "description": "..."
        }
      },
      "missionText": "...",
      "visionText": "..."
    }
  },
  "storytelling": {
    "heroToStory": "개발자로서의 여정이 시작되었습니다",
    "storyToBackground": "배경과 전문성을 소개합니다",
    "backgroundToJourney": "성장 과정을 살펴보세요",
    "journeyToMission": "미션과 비전으로 이어집니다",
    "missionToContact": "함께 일하고 싶으신가요?"
  }
}
```

## 6. 구현 단계별 계획

### Phase 1: 스타일 재사용 및 기본 구조
1. **AboutPage.styles.ts 생성**
   - `HomePage.styles.ts`에서 Hero 관련 스타일 import
   - AboutHero 스타일 확장 (ProfileImage 추가)
   - StorySection, BackgroundSection, MissionVisionSection 스타일 정의

2. **AboutPage.tsx 리팩토링**
   - AboutHero 섹션 추가 (HomePage Hero 스타일 재사용)
   - StorySection 컴포넌트 생성 (JourneyGrid 재사용)
   - BackgroundSection 컴포넌트 생성 (Card, ContactItem 스타일 재사용)
   - MissionVisionSection 컴포넌트 생성 (Card, FeaturedSection 스타일 참고)

3. **SectionBridge 연결**
   - 각 섹션 간 SectionBridge 추가
   - i18n 텍스트 추가

### Phase 2: 컴포넌트 통합
4. **JourneyMilestoneSection 통합**
   - AboutPage에 JourneyMilestoneSection 추가
   - SectionBridge로 연결

5. **ContactSection 개선**
   - 기존 ContactSection 유지
   - 접근성 개선 (ARIA 속성)

6. **스크롤 애니메이션 추가**
   - HomePage.tsx 패턴 재사용
   - IntersectionObserver로 각 섹션 visibility 관리

### Phase 3: 최적화 및 접근성
7. **반응형 디자인 완성**
   - 모든 섹션 모바일/태블릿 대응
   - 12-column grid 일관성 유지

8. **접근성 개선**
   - ARIA 속성 추가
   - 키보드 네비게이션
   - 스크린 리더 지원

9. **성능 최적화**
   - 이미지 lazy loading
   - 애니메이션 최적화
   - GPU 가속

## 7. 코드 재사용 체크리스트

### 스타일 재사용
- [x] HomePage.styles.ts Hero 스타일 재사용
- [x] JourneyMilestoneSection 그리드 구조 재사용
- [x] AboutPage ContactItem 스타일 재사용
- [x] Card 컴포넌트 재사용
- [x] Button, Tag 등 공통 컴포넌트 재사용

### 컴포넌트 재사용
- [x] SectionPurpose 재사용
- [x] SectionBridge 재사용
- [x] JourneyMilestoneSection 완전 재사용
- [x] Container 재사용
- [x] ScrollIndicator 재사용 (선택사항)

### 패턴 재사용
- [x] Z-pattern 레이아웃 (Hero)
- [x] F-pattern 레이아웃 (Story, Background)
- [x] 12-column grid 시스템
- [x] 스크롤 트리거 애니메이션 패턴
- [x] 호버/포커스 효과 패턴

## 8. 디자인 시스템 준수

### 4-Point Spacing System
- 모든 spacing은 `theme.spacing` 사용
- 하드코딩된 px 값 없음
- 예: `spacing[4]` (16px), `spacing[6]` (24px), `spacing[8]` (32px)

### KickoffLabs 가이드라인
- **색상**: Primary + Neutral만 사용
- **폰트**: `theme.typography.fontFamily.primary` (Inter)
- **CTA**: Primary 색상만 사용
- **일관성**: HomePage와 동일한 스타일 패턴

### Nielsen's Heuristics
- **H1**: 스크롤 진행, 섹션 전환 애니메이션, 호버/포커스 피드백
- **H3**: 키보드 네비게이션, 포커스 상태 명확히
- **H4**: 다른 페이지와 일관된 디자인
- **H8**: 불필요한 요소 제거, 여백 활용

## 9. 파일 구조

```
frontend/src/
├── pages/
│   ├── AboutPage.tsx (메인 페이지)
│   └── AboutPage.styles.ts (스타일 - HomePage.styles 재사용)
├── components/
│   └── sections/
│       ├── StorySection.tsx (새로 생성, JourneyGrid 재사용)
│       ├── BackgroundSection.tsx (새로 생성, Card 재사용)
│       ├── MissionVisionSection.tsx (새로 생성, Card 재사용)
│       ├── SectionPurpose.tsx (재사용)
│       ├── SectionBridge.tsx (재사용)
│       └── JourneyMilestoneSection.tsx (재사용)
└── i18n/
    └── locales/
        ├── ko.json (about 섹션 추가)
        ├── en.json (about 섹션 추가)
        └── ja.json (about 섹션 추가)
```

## 10. 구현 우선순위 (코드 재활용 중심)

### 즉시 시작 가능 (재사용률 80%+)
1. AboutHero - HomePage.styles.ts Hero 스타일 재사용
2. StorySection - JourneyGrid 구조 재사용
3. BackgroundSection - Card + ContactItem 스타일 재사용
4. SectionBridge 연결 - 기존 컴포넌트 재사용

### 중간 우선순위 (재사용률 50%+)
5. MissionVisionSection - Card + FeaturedSection 스타일 참고
6. JourneyMilestoneSection 통합 - 완전 재사용
7. 스크롤 애니메이션 - HomePage 패턴 재사용

### 최종 최적화
8. 반응형 디자인 완성
9. 접근성 개선
10. 성능 최적화

## 11. 예상 코드 재사용률

- **AboutHero**: 90% (HomePage.styles.ts 재사용)
- **StorySection**: 70% (JourneyGrid, SectionPurpose 재사용)
- **BackgroundSection**: 80% (Card, ContactItem 스타일 재사용)
- **MissionVisionSection**: 60% (Card, FeaturedSection 스타일 참고)
- **JourneyMilestoneSection**: 100% (완전 재사용)
- **ContactSection**: 95% (기존 코드 유지)
- **SectionBridge**: 100% (완전 재사용)

**전체 평균 재사용률: 약 85%**

## 12. 핵심 원칙 준수

✅ **4-point spacing system**: 모든 spacing은 theme.spacing 사용  
✅ **KickoffLabs**: Primary + Neutral 색상, Inter 폰트만  
✅ **Nielsen's Heuristics**: 접근성, 일관성, 사용자 제어  
✅ **포트폴리오 프롬프트**: Z-pattern, F-pattern, 12-column grid  
✅ **코드 재사용**: 기존 컴포넌트 최대한 재활용  
✅ **일관성**: HomePage와 동일한 디자인 패턴 유지
