import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/common'

const Section = styled.section`
  padding: 120px 0;
  background: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
`

const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 16px;
  }
`

const SectionSubtitle = styled.p`
  font-size: 20px;
  text-align: center;
  margin-bottom: 80px;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 60px;
  }
`

const TimelineContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
`

const TimelineLine = styled.div`
  position: absolute;
  left: 80px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(
    to bottom,
    ${props => props.theme.colors.primary[500]} 0%,
    ${props => props.theme.colors.primary[300]} 50%,
    ${props => props.theme.colors.neutral[300]} 100%
  );
  border-radius: 2px;

  @media (max-width: 768px) {
    left: 30px;
  }
`

const MilestoneItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 80px;
  position: relative;
  flex-direction: row;

  @media (max-width: 768px) {
    margin-bottom: 60px;
    padding-left: 60px;
  }
`

const MilestoneNode = styled.div<{ $status: 'completed' | 'current' | 'planned' }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: absolute;
  left: 80px;
  transform: translateX(-50%);
  z-index: 2;
  
  background: ${props => {
    switch (props.$status) {
      case 'completed':
        return props.theme.colors.success || '#10B981'
      case 'current':
        return props.theme.colors.primary[500]
      case 'planned':
        return props.theme.colors.neutral[400]
      default:
        return props.theme.colors.primary[500]
    }
  }};
  
  border: 4px solid ${props => props.theme.colors.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  ${props => props.$status === 'current' && `
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    
    @keyframes pulse {
      0%, 100% {
        transform: translateX(-50%) scale(1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      50% {
        transform: translateX(-50%) scale(1.1);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      }
    }
  `}

  @media (max-width: 768px) {
    left: 30px;
    transform: translateX(-50%);
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`

const MilestoneCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 500px;
  margin-left: 140px;
  flex: 1;
  
  @media (max-width: 768px) {
    margin-left: 60px;
    max-width: none;
    width: calc(100% - 80px);
  }
`

const MilestoneYear = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary[500]};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const MilestoneTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
`

const MilestoneDescription = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 16px;
`

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const TechTag = styled.span`
  background: ${props => props.theme.colors.primary[100]};
  color: ${props => props.theme.colors.primary[700]};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`

interface MilestoneData {
  id: string
  year: string
  title: string
  description: string
  icon: string
  techStack: string[]
  status: 'completed' | 'current' | 'planned'
}

const milestoneData: MilestoneData[] = [
  {
    id: 'high-school',
    year: '2015',
    title: 'High School Graduation',
    description: '고등학교 졸업 후 대학 진학을 위한 준비 과정을 거쳤습니다. 이 시기부터 컴퓨터와 기술에 대한 관심이 싹트기 시작했습니다.',
    icon: '🎓',
    techStack: ['Basic Computer Skills', 'Microsoft Office'],
    status: 'completed'
  },
  {
    id: 'university',
    year: '2015~2020',
    title: 'Jeonbuk National University',
    description: '전북대학교에서 학업을 시작하며 컴퓨터공학의 기초를 다졌습니다. 프로그래밍 언어와 소프트웨어 개발의 기본기를 익혔습니다.',
    icon: '🏫',
    techStack: ['C/C++', 'Java', 'Data Structures', 'Algorithms', 'Database'],
    status: 'completed'
  },
  {
    id: 'military',
    year: '2021~2023',
    title: 'Military Service - Interpreter',
    description: '군 복무 중 통역병으로 근무하며 영어 실력을 크게 향상시켰습니다. 다양한 국제 업무를 경험하며 글로벌 마인드를 기를 수 있었습니다.',
    icon: '🪖',
    techStack: ['English Communication', 'Translation', 'International Relations', 'Leadership'],
    status: 'completed'
  },
  {
    id: 'australia',
    year: '2023~Present',
    title: 'Study in Australia',
    description: '호주에서 유학 생활을 시작하며 최신 웹 기술과 소프트웨어 개발 트렌드를 학습하고 있습니다. 글로벌 환경에서의 개발 경험을 쌓고 있습니다.',
    icon: '🇦🇺',
    techStack: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'MongoDB', 'Docker', 'AWS'],
    status: 'current'
  },
  {
    id: 'future',
    year: '2025',
    title: 'Current Goals',
    description: '풀스택 개발자로서의 전문성을 더욱 발전시키고, 혁신적인 웹 서비스를 개발하여 사용자에게 가치를 제공하는 것이 목표입니다.',
    icon: '🚀',
    techStack: ['Full Stack Development', 'Cloud Architecture', 'AI/ML Integration', 'DevOps'],
    status: 'planned'
  }
]

export function JourneyMilestoneSection() {
  const { t } = useTranslation()
  const [visibleMilestones, setVisibleMilestones] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const milestoneId = entry.target.getAttribute('data-milestone-id')
            if (milestoneId && !visibleMilestones.includes(milestoneId)) {
              setVisibleMilestones(prev => [...prev, milestoneId])
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    const milestoneElements = containerRef.current?.querySelectorAll('[data-milestone-id]')
    milestoneElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [visibleMilestones])

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1]
      }
    })
  }

  return (
    <Section>
      <Container>
        <SectionTitle>My Journey</SectionTitle>
        <SectionSubtitle>
          개발자로 성장해온 여정과 앞으로의 목표를 소개합니다
        </SectionSubtitle>
        
        <TimelineContainer ref={containerRef}>
          <TimelineLine />
          
          {milestoneData.map((milestone, index) => (
            <MilestoneItem
              key={milestone.id}
              data-milestone-id={milestone.id}
              variants={itemVariants}
              initial="hidden"
              animate={visibleMilestones.includes(milestone.id) ? "visible" : "hidden"}
              custom={index}
            >
              <MilestoneNode $status={milestone.status}>
                {milestone.icon}
              </MilestoneNode>
              
              <MilestoneCard>
                <MilestoneYear>{milestone.year}</MilestoneYear>
                <MilestoneTitle>{milestone.title}</MilestoneTitle>
                <MilestoneDescription>{milestone.description}</MilestoneDescription>
                <TechTags>
                  {milestone.techStack.map((tech, techIndex) => (
                    <TechTag key={`${milestone.id}-${techIndex}`}>
                      {tech}
                    </TechTag>
                  ))}
                </TechTags>
              </MilestoneCard>
            </MilestoneItem>
          ))}
        </TimelineContainer>
      </Container>
    </Section>
  )
}
