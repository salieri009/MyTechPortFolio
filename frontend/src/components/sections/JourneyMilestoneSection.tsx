import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/common'
import { ComplexityIndicator, TechStackProgression } from './journey'
import { SectionPurpose } from './SectionPurpose'
import { useTimelinePathAnimation } from '../../hooks/useTimelinePathAnimation'

const Section = styled.section`
  padding: ${props => props.theme.spacing[20]} 0;
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  position: relative;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing[20]};
  
  /* 상단 구분선 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary[500]},
      transparent
    );
    opacity: 0.3;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[16]} 0;
    margin-bottom: ${props => props.theme.spacing[20]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  text-align: left;
  margin-bottom: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
    margin-bottom: ${props => props.theme.spacing[3]};
  }
`

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  text-align: left;
  margin-bottom: 0;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 100%;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    margin-bottom: 0;
  }
`

// F-패턴 레이아웃을 위한 12컬럼 그리드 컨테이너
const JourneyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${props => props.theme.spacing[8]};
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

// 좌측 텍스트 영역 (F-패턴)
const TextColumn = styled.div`
  grid-column: 1 / 8; /* 7 컬럼 */
  
  @media (max-width: 1024px) {
    grid-column: 1 / 4; /* 3 컬럼 */
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`

// 우측 타임라인 영역 (F-패턴)
const TimelineColumn = styled.div`
  grid-column: 8 / -1; /* 5 컬럼 */
  
  @media (max-width: 1024px) {
    grid-column: 4 / -1; /* 3 컬럼 */
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`

const TimelineContainer = styled.div`
  position: relative;
  max-width: 100%;
  margin: 0;
`

const TimelineSVG = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  
  @media (max-width: 768px) {
    left: 0;
  }
`

const TimelinePathBackground = styled.path`
  stroke: ${props => props.theme.colors.neutral[300]};
  stroke-width: 4;
  fill: none;
  vector-effect: non-scaling-stroke;
`

const TimelinePathProgress = styled.path<{ $dashOffset: number; $pathLength: number }>`
  stroke: ${props => props.theme.colors.primary[500]};
  stroke-width: 4;
  fill: none;
  stroke-dasharray: ${props => props.$pathLength};
  stroke-dashoffset: ${props => props.$dashOffset};
  transition: ${props => props.$dashOffset > 0 ? 'stroke-dashoffset 0.3s ease' : 'none'};
  filter: drop-shadow(0 0 4px ${props => props.theme.colors.primary[500]}40);
  vector-effect: non-scaling-stroke;
  
  @media (prefers-reduced-motion: reduce) {
    stroke-dasharray: none !important;
    stroke-dashoffset: 0 !important;
    transition: none !important;
  }
`

const MilestoneItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing[12]}; /* 48px */
  position: relative;
  flex-direction: row;

  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing[12]}; /* 48px */
    padding-left: ${props => props.theme.spacing[14]}; /* 56px (60px → 56px, 4px 배수로 조정) */
  }
`

const MilestoneNode = styled.div<{ $status: 'completed' | 'current' | 'planned' }>`
  width: ${props => props.theme.spacing[4]}; /* 16px */
  height: ${props => props.theme.spacing[4]}; /* 16px */
  border-radius: 50%;
  position: absolute;
  left: ${props => props.theme.spacing[11]}; /* 44px: 40px (bar left) + 4px (bar width/2, 4px 배수로 조정) */
  transform: translateX(-50%);
  z-index: 3;
  
  background: ${props => {
    switch (props.$status) {
      case 'completed':
        return props.theme.colors.primary[500]
      case 'current':
        return props.theme.colors.primary[500]
      case 'planned':
        return props.theme.colors.neutral[400]
      default:
        return props.theme.colors.primary[500]
    }
  }};
  
  border: ${props => props.theme.spacing[1]} solid ${props => props.theme.colors.background}; /* 4px (3px → 4px 배수로 조정) */
  box-shadow: 0 0 0 ${props => props.theme.spacing[0.5]} ${props => { /* 2px */
    switch (props.$status) {
      case 'completed':
        return props.theme.colors.primary[500]
      case 'current':
        return props.theme.colors.primary[500]
      case 'planned':
        return props.theme.colors.neutral[400]
      default:
        return props.theme.colors.primary[500]
    }
  }};

  @media (max-width: 768px) {
    left: ${props => props.theme.spacing[6]}; /* 24px: 20px (bar left) + 4px (bar width/2, 4px 배수로 조정) */
    transform: translateX(-50%);
    width: ${props => props.theme.spacing[3.5]}; /* 16px (14px → 16px, 4px 배수로 조정) */
    height: ${props => props.theme.spacing[3.5]}; /* 16px (14px → 16px, 4px 배수로 조정) */
    border-width: ${props => props.theme.spacing[0.5]}; /* 2px */
  }
`

const MilestoneContent = styled(motion.div)<{ $isLast?: boolean }>`
  background: transparent;
  padding: ${props => props.theme.spacing[5]} 0; /* 20px */
  border-bottom: ${props => props.$isLast ? 'none' : `${props.theme.spacing[0.5]} solid ${props.theme.colors.border}`}; /* 4px (1px → 4px 배수로 조정) */
  max-width: 37.5rem; /* 600px (테마에 spacing[150] 없음, 직접 계산) */
  margin-left: ${props => props.theme.spacing[20]}; /* 80px */
  flex: 1;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    margin-left: 0;
    max-width: none;
    width: calc(100% - ${props => props.theme.spacing[10]}); /* 40px */
    padding: ${props => props.theme.spacing[4]} 0; /* 16px */
  }
`

const MilestoneYear = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm}; /* 14px */
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary[500]};
  margin-bottom: ${props => props.theme.spacing[2]}; /* 8px */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.xs}; /* 13px → 12px (가장 가까운 값) */
  }
`

const MilestoneTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 24px */
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing[3]}; /* 12px */
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const MilestoneDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base}; /* 16px */
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing[4]}; /* 16px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]}; /* 12px */
`

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[2]}; /* 8px */
`

const TechTag = styled.span`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]}; /* 4px 8px */
  border-radius: ${props => props.theme.radius.sm}; /* 2px → 4px (가장 가까운 값) */
  font-size: ${props => props.theme.typography.fontSize.xs}; /* 12px */
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border: ${props => props.theme.spacing[0.5]} solid ${props => props.theme.colors.border}; /* 4px (1px → 4px 배수로 조정) */
  
  ${props => props.theme.mode === 'dark' && `
    border-color: ${props.theme.colors.neutral[700]};
  `}
`

interface CodeMetrics {
  linesOfCode?: number
  commits?: number
  repositories?: number
}

interface KeyAchievement {
  title: string
  description: string
  impact?: string
}

interface SkillLevel {
  name: string
  level: number // 1-5
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Other'
}

interface MilestoneData {
  id: string
  year: string
  title: string
  description: string
  icon: string
  techStack: string[]
  status: 'completed' | 'current' | 'planned'
  technicalComplexity: number // 1-5
  projectCount: number
  codeMetrics?: CodeMetrics
  keyAchievements?: KeyAchievement[]
  skillProgression?: SkillLevel[]
}

const milestoneData: MilestoneData[] = [
  {
    id: 'high-school',
    year: '2015',
    title: 'High School Graduation',
    description: '고등학교 졸업 후 대학 진학을 위한 준비 과정을 거쳤습니다. 이 시기부터 컴퓨터와 기술에 대한 관심이 싹트기 시작했습니다.',
    icon: '',
    techStack: ['Basic Computer Skills', 'Microsoft Office'],
    status: 'completed',
    technicalComplexity: 1,
    projectCount: 0,
    skillProgression: [
      { name: 'Basic Computer Skills', level: 2, category: 'Other' },
      { name: 'Microsoft Office', level: 3, category: 'Other' }
    ]
  },
  {
    id: 'university',
    year: '2015~2020',
    title: 'Jeonbuk National University',
    description: '전북대학교에서 학업을 시작하며 컴퓨터공학의 기초를 다졌습니다. 프로그래밍 언어와 소프트웨어 개발의 기본기를 익혔습니다.',
    icon: '',
    techStack: ['C/C++', 'Java', 'Data Structures', 'Algorithms', 'Database'],
    status: 'completed',
    technicalComplexity: 3,
    projectCount: 5,
    codeMetrics: {
      linesOfCode: 15000,
      commits: 200,
      repositories: 3
    },
    keyAchievements: [
      {
        title: '데이터 구조 및 알고리즘 마스터',
        description: '기본적인 자료구조와 알고리즘을 완전히 이해하고 구현할 수 있게 되었습니다.',
        impact: '프로그래밍 기초 실력 향상'
      },
      {
        title: 'Java 객체지향 프로그래밍',
        description: 'Java를 활용한 객체지향 설계 및 구현 능력을 습득했습니다.',
        impact: '소프트웨어 설계 능력 향상'
      }
    ],
    skillProgression: [
      { name: 'C/C++', level: 4, category: 'Backend' },
      { name: 'Java', level: 4, category: 'Backend' },
      { name: 'Data Structures', level: 4, category: 'Other' },
      { name: 'Algorithms', level: 4, category: 'Other' },
      { name: 'Database', level: 3, category: 'Database' }
    ]
  },
  {
    id: 'military',
    year: '2021~2023',
    title: 'Military Service - Interpreter',
    description: '군 복무 중 통역병으로 근무하며 영어 실력을 크게 향상시켰습니다. 다양한 국제 업무를 경험하며 글로벌 마인드를 기를 수 있었습니다.',
    icon: '',
    techStack: ['English Communication', 'Translation', 'International Relations', 'Leadership'],
    status: 'completed',
    technicalComplexity: 2,
    projectCount: 0,
    skillProgression: [
      { name: 'English Communication', level: 5, category: 'Other' },
      { name: 'Translation', level: 4, category: 'Other' },
      { name: 'Leadership', level: 3, category: 'Other' }
    ]
  },
  {
    id: 'australia',
    year: '2023~Present',
    title: 'Study in Australia',
    description: '호주에서 유학 생활을 시작하며 최신 웹 기술과 소프트웨어 개발 트렌드를 학습하고 있습니다. 글로벌 환경에서의 개발 경험을 쌓고 있습니다.',
    icon: '',
    techStack: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'MongoDB', 'Docker', 'AWS'],
    status: 'current',
    technicalComplexity: 4,
    projectCount: 11,
    codeMetrics: {
      linesOfCode: 50000,
      commits: 800,
      repositories: 15
    },
    keyAchievements: [
      {
        title: '풀스택 웹 개발 마스터',
        description: 'React, TypeScript, Spring Boot를 활용한 풀스택 웹 애플리케이션 개발 능력을 습득했습니다.',
        impact: '11개 프로젝트 완료'
      },
      {
        title: '클라우드 인프라 경험',
        description: 'AWS, Docker를 활용한 클라우드 배포 및 컨테이너화 경험을 쌓았습니다.',
        impact: '실무 수준의 DevOps 능력 향상'
      },
      {
        title: 'MongoDB NoSQL 데이터베이스',
        description: 'MongoDB를 활용한 NoSQL 데이터베이스 설계 및 최적화 경험을 쌓았습니다.',
        impact: '다양한 데이터베이스 기술 습득'
      }
    ],
    skillProgression: [
      { name: 'React', level: 4, category: 'Frontend' },
      { name: 'TypeScript', level: 4, category: 'Frontend' },
      { name: 'Node.js', level: 3, category: 'Backend' },
      { name: 'Spring Boot', level: 4, category: 'Backend' },
      { name: 'MongoDB', level: 3, category: 'Database' },
      { name: 'Docker', level: 3, category: 'DevOps' },
      { name: 'AWS', level: 2, category: 'DevOps' }
    ]
  },
  {
    id: 'future',
    year: '2025',
    title: 'Current Goals',
    description: '풀스택 개발자로서의 전문성을 더욱 발전시키고, 혁신적인 웹 서비스를 개발하여 사용자에게 가치를 제공하는 것이 목표입니다.',
    icon: '',
    techStack: ['Full Stack Development', 'Cloud Architecture', 'AI/ML Integration', 'DevOps'],
    status: 'planned',
    technicalComplexity: 5,
    projectCount: 0,
    skillProgression: [
      { name: 'Cloud Architecture', level: 3, category: 'DevOps' },
      { name: 'AI/ML Integration', level: 2, category: 'Other' },
      { name: 'Full Stack Development', level: 4, category: 'Other' }
    ]
  }
]

export function JourneyMilestoneSection() {
  const { t } = useTranslation()
  const [visibleMilestones, setVisibleMilestones] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const milestoneRefs = useRef<Map<string, HTMLElement>>(new Map())
  
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const milestoneId = entry.target.getAttribute('data-milestone-id')
            if (milestoneId) {
              setVisibleMilestones(prev => {
                // Only add if not already in the array to avoid unnecessary re-renders
                if (!prev.includes(milestoneId)) {
                  return [...prev, milestoneId]
                }
                return prev
              })
            }
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const milestoneElements = containerRef.current?.querySelectorAll('[data-milestone-id]')
    milestoneElements?.forEach(el => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])

  // Build milestones array for path animation hook
  const milestones = milestoneData.map(m => ({
    id: m.id,
    element: milestoneRefs.current.get(m.id) || null
  }))

  // Use SVG path animation hook
  const { pathLength, dashOffset, activeMilestone } = useTimelinePathAnimation({
    containerRef,
    milestones,
    prefersReducedMotion
  })

  // Calculate SVG path based on milestone positions
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const svg = svgRef.current
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const lineX = window.innerWidth > 768 ? 40 : 20
    
    // Update SVG viewBox to match container dimensions
    const containerHeight = container.scrollHeight
    const containerWidth = container.offsetWidth
    svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
    svg.setAttribute('width', `${containerWidth}`)
    svg.setAttribute('height', `${containerHeight}`)
    
    // Get all milestone positions
    const pathPoints: Array<{ x: number; y: number }> = []
    milestoneData.forEach((milestone) => {
      const element = milestoneRefs.current.get(milestone.id)
      if (element) {
        const rect = element.getBoundingClientRect()
        const relativeY = rect.top - containerRect.top + (rect.height / 2)
        pathPoints.push({ x: lineX, y: relativeY })
      }
    })

    if (pathPoints.length === 0) return

    // Create path from first to last milestone
    const firstPoint = pathPoints[0]
    const lastPoint = pathPoints[pathPoints.length - 1]
    
    // Simple vertical line path
    const pathData = `M ${firstPoint.x} ${firstPoint.y} L ${lastPoint.x} ${lastPoint.y}`
    
    const backgroundPath = svg.querySelector('#timeline-background') as SVGPathElement
    const progressPath = svg.querySelector('#timeline-progress') as SVGPathElement
    
    if (backgroundPath) backgroundPath.setAttribute('d', pathData)
    if (progressPath) progressPath.setAttribute('d', pathData)
    
    // Trigger path length calculation in hook
    if (progressPath && !prefersReducedMotion) {
      const length = progressPath.getTotalLength()
      progressPath.style.strokeDasharray = `${length}`
      progressPath.style.strokeDashoffset = `${length}`
    }
  }, [visibleMilestones, prefersReducedMotion])

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: 'easeOut' as const
      }
    })
  }

  return (
    <Section id="journey">
      <Container>
        <JourneyGrid>
          {/* F-패턴: 좌측 텍스트 영역 */}
          <TextColumn>
        <SectionTitle>{t('journey.title') || 'Career Timeline'}</SectionTitle>
        <SectionPurpose 
          text={t('storytelling.journeyPurpose')}
        />
        <SectionSubtitle>
          {t('journey.subtitle') || '개발자로 성장해온 여정과 앞으로의 목표를 소개합니다'}
        </SectionSubtitle>
          </TextColumn>
        
          {/* F-패턴: 우측 타임라인 영역 */}
          <TimelineColumn>
        <TimelineContainer ref={containerRef}>
          <TimelineSVG ref={svgRef} preserveAspectRatio="none">
            <TimelinePathBackground id="timeline-background" />
            <TimelinePathProgress 
              id="timeline-progress"
              $dashOffset={dashOffset}
              $pathLength={pathLength}
            />
          </TimelineSVG>
          
          {milestoneData.map((milestone, index) => (
            <MilestoneItem
              key={milestone.id}
              id={`milestone-${milestone.id}`}
              ref={(el) => {
                if (el) milestoneRefs.current.set(milestone.id, el)
              }}
              data-milestone-id={milestone.id}
              data-visible={visibleMilestones.includes(milestone.id)}
              data-active={activeMilestone === milestone.id}
              variants={itemVariants}
              initial="hidden"
              animate={visibleMilestones.includes(milestone.id) ? "visible" : "hidden"}
              custom={index}
              aria-live={activeMilestone === milestone.id ? "polite" : "off"}
            >
              <MilestoneNode $status={milestone.status} />
              
              <MilestoneContent $isLast={index === milestoneData.length - 1}>
                <MilestoneYear>{milestone.year}</MilestoneYear>
                <CardContent>
                  <MilestoneTitle>{milestone.title}</MilestoneTitle>
                  <MilestoneDescription>{milestone.description}</MilestoneDescription>
                  
                  <ComplexityIndicator complexity={milestone.technicalComplexity} />
                  
                  {milestone.skillProgression && milestone.skillProgression.length > 0 && (
                    <TechStackProgression skills={milestone.skillProgression} />
                  )}
                  
                  <TechTags>
                    {milestone.techStack.map((tech, techIndex) => (
                      <TechTag key={`${milestone.id}-${techIndex}`}>
                        {tech}
                      </TechTag>
                    ))}
                  </TechTags>
                </CardContent>
              </MilestoneContent>
            </MilestoneItem>
          ))}
        </TimelineContainer>
          </TimelineColumn>
        </JourneyGrid>
      </Container>
    </Section>
  )
}

