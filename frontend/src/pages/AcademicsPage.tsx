import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { keyframes } from 'styled-components'
import { Container, Card } from '@components/common'
import { getAcademics } from '@services/academics'
import type { Academic } from '@model/domain'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(${props => props.theme.spacing[8]}); /* 4-point system: 32px */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const PageWrapper = styled.div`
  padding: ${props => props.theme.spacing[20]} 0;
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[16]} 0;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`

const TimelineContainer = styled.div`
  max-width: ${props => props.theme.spacing[200]}; /* 4-point system: 800px */
  margin: 0 auto;
  position: relative;
  
  /* Vertical timeline line */
  &::before {
    content: '';
    position: absolute;
    left: ${props => props.theme.spacing[2]}; /* 8px from left */
    top: 0;
    bottom: 0;
    width: ${props => props.theme.spacing[0.5]}; /* 2px */
    background: linear-gradient(
      to bottom,
      ${props => props.theme.colors.primary[500]},
      ${props => props.theme.colors.primary[300]},
      ${props => props.theme.colors.primary[500]}
    );
    opacity: 0.3;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    &::before {
      left: ${props => props.theme.spacing[1]}; /* 4px on mobile */
    }
  }
`

const AcademicCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => !['status', '$isVisible', '$index', '$isExpanded'].includes(prop)
})<{ status: string; $isVisible?: boolean; $index?: number; $isExpanded?: boolean }>`
  margin-bottom: ${props => props.theme.spacing[4]};
  border-left: ${props => props.theme.spacing[1]} solid ${props => { /* 4-point system: 4px */
    switch (props.status) {
      case 'completed': return props.theme.colors.success
      case 'enrolled': return props.theme.colors.primary[500]
      case 'exemption': return props.theme.colors.warning
      default: return props.theme.colors.border
    }
  }};
  transition: all 0.3s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  animation: ${props => props.$isVisible ? fadeInUp : 'none'} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${props => props.$isVisible && props.$index !== undefined ? `${props.$index * 0.1}s` : '0s'};
  cursor: pointer;
  
  /* Expanded state */
  ${props => props.$isExpanded && `
    background: ${props.theme.colors.primary[50]};
    border-color: ${props.theme.colors.primary[500]};
  `}
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => {
    switch (props.status) {
      case 'completed': return props.theme.colors.success
      case 'enrolled': return props.theme.colors.primary[500]
      case 'exemption': return props.theme.colors.warning
      default: return props.theme.colors.border
    }
  }};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
    border-radius: ${props => props.theme.radius.sm};
  }
  
  @media (max-width: 768px) {
    margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    &:hover {
      transform: none;
    }
  }
`

const ExpandedContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => props.$isExpanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease;
  padding-top: ${props => props.$isExpanded ? props.theme.spacing[4] : '0'}; /* 16px or 0 */
  margin-top: ${props => props.$isExpanded ? props.theme.spacing[4] : '0'}; /* 16px or 0 */
  border-top: ${props => props.$isExpanded ? `1px solid ${props.theme.colors.border}` : 'none'};
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    max-height: ${props => props.$isExpanded ? 'none' : '0'};
  }
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[2]} 0; /* 8px vertical */
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  
  strong {
    color: ${props => props.theme.colors.text};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
  }
`

const AcademicTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl}; /* 4-point system: 20px */
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  color: ${props => props.theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  }
`

const GradeBadge = styled.span<{ grade: string }>`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  background: ${props => {
    switch (props.grade) {
      case 'HIGH DISTINCTION': return props.theme.colors.error + 'E6' // 90% opacity for better contrast
      case 'DISTINCTION': return props.theme.colors.warning + 'E6'
      case 'CREDIT': return props.theme.colors.success + 'E6'
      case 'PASS': return props.theme.colors.primary[600] + 'E6'
      default: return props.theme.colors.neutral[600] + 'E6'
    }
  }};
  color: ${props => props.theme.colors.hero?.text || '#ffffff'};
  border: 1px solid ${props => {
    switch (props.grade) {
      case 'HIGH DISTINCTION': return props.theme.colors.error
      case 'DISTINCTION': return props.theme.colors.warning
      case 'CREDIT': return props.theme.colors.success
      case 'PASS': return props.theme.colors.primary[700]
      default: return props.theme.colors.neutral[700]
    }
  }};
`

const StatusBadge = styled.span<{ status: string }>`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  background: ${props => {
    switch (props.status) {
      case 'completed': return props.theme.colors.success + '20'
      case 'enrolled': return props.theme.colors.primary[500] + '20'
      case 'exemption': return props.theme.colors.warning + '20'
      default: return props.theme.colors.neutral[100]
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return props.theme.colors.success
      case 'enrolled': return props.theme.colors.primary[700]
      case 'exemption': return props.theme.colors.warning
      default: return props.theme.colors.textSecondary
    }
  }};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.status === 'completed' ? props.theme.colors.success + '30' :
                  props.status === 'enrolled' ? props.theme.colors.primary[500] + '30' :
                  props.status === 'exemption' ? props.theme.colors.warning + '30' :
                  props.theme.colors.neutral[800]};
  `}
`

const AcademicMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  align-items: center;
  flex-wrap: wrap;
`


const StatCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => prop !== '$isVisible' && prop !== '$isHighlighted'
})<{ $isVisible?: boolean; $isHighlighted?: boolean }>`
  text-align: center;
  padding: ${props => props.$isHighlighted ? props.theme.spacing[8] : props.theme.spacing[6]}; /* 32px or 24px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.3s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  animation: ${props => props.$isVisible ? fadeInUp : 'none'} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  position: relative;
  
  /* Highlighted state for GPA/WAM */
  ${props => props.$isHighlighted && `
    background: ${props.theme.colors.primary[50]};
    border-color: ${props.theme.colors.primary[500]};
    grid-column: span 2;
  `}
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary[500]};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
    border-radius: ${props => props.theme.radius.sm};
  }
  
  h3 {
    font-size: ${props => props.$isHighlighted ? props.theme.typography.fontSize['3xl'] : props.theme.typography.fontSize['2xl']}; /* 40px or 24px */
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    font-family: ${props => props.theme.typography.fontFamily.primary};
    color: ${props => props.$isHighlighted ? props.theme.colors.primary[700] : props.theme.colors.primary[500]};
    margin: 0 0 ${props => props.theme.spacing[2]} 0; /* 4-point system: 8px */
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
    font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
    font-family: ${props => props.theme.typography.fontFamily.primary};
  }
  
  @media (max-width: 768px) {
    ${props => props.$isHighlighted && `
      grid-column: span 1;
    `}
  }
`

const SparklineChart = styled.svg`
  width: 100%;
  height: ${props => props.theme.spacing[8]}; /* 32px */
  margin-top: ${props => props.theme.spacing[2]}; /* 8px */
  overflow: visible;
`

const Tooltip = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: ${props => props.theme.spacing[2]}; /* 8px */
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]}; /* 8px 12px */
  background: ${props => props.theme.colors.primary[700]};
  color: ${props => props.theme.colors.hero?.text || '#ffffff'};
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  white-space: nowrap;
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  transition: opacity 0.2s ease;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: ${props => props.theme.spacing[1]} solid transparent; /* 4px */
    border-top-color: ${props => props.theme.colors.primary[700]};
  }
`

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  padding: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
`

const SemesterTitle = styled.h2<{ $isVisible?: boolean }>`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-top: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px (1.5rem) */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  border-bottom: ${props => props.theme.spacing[0.5]} solid ${props => props.theme.colors.border}; /* 4-point system: 2px → 4px */
  padding-bottom: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  padding-left: ${props => props.theme.spacing[6]}; /* 24px to overlap timeline */
  position: relative;
  z-index: 1;
  background: ${props => props.theme.colors.background};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @media (max-width: 768px) {
    padding-left: ${props => props.theme.spacing[4]}; /* 16px on mobile */
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

const GradeContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  align-items: center;
`

const AcademicDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  margin-top: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
`

const SummaryStats = styled.div<{ $isVisible?: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4-column grid: 2 small + 2 large */
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : `translateY(${props => props.theme.spacing[8]})`};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* 2-column grid on tablet */
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 1-column grid on mobile */
    gap: ${props => props.theme.spacing[3]}; /* 4-point system: 12px */
    margin-bottom: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease;
    transform: none;
  }
`

const QuickNavBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]}; /* 8px */
  padding: ${props => props.theme.spacing[4]}; /* 16px */
  margin-bottom: ${props => props.theme.spacing[8]}; /* 32px */
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.primary[300]} ${props => props.theme.colors.background};
  
  &::-webkit-scrollbar {
    height: ${props => props.theme.spacing[1]}; /* 4px */
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary[300]};
    border-radius: ${props => props.theme.radius.full};
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[3]}; /* 12px */
    margin-bottom: ${props => props.theme.spacing[6]}; /* 24px */
  }
`

const QuickNavButton = styled.button<{ $isActive?: boolean }>`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]}; /* 8px 16px */
  border: 1px solid ${props => props.$isActive ? props.theme.colors.primary[500] : props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.$isActive ? props.theme.colors.primary[500] : props.theme.colors.surface};
  color: ${props => props.$isActive ? (props.theme.colors.hero?.text || '#ffffff') : props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.$isActive ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    background: ${props => props.$isActive ? props.theme.colors.primary[600] : props.theme.colors.primary[50]};
    color: ${props => props.$isActive ? (props.theme.colors.hero?.text || '#ffffff') : props.theme.colors.primary[700]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[0.5]};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: background 0.2s ease, border-color 0.2s ease;
  }
`

export function AcademicsPage() {
  const { t } = useTranslation()
  const [academics, setAcademics] = useState<Academic[]>([])
  const [loading, setLoading] = useState(true)
  const [isStatsVisible, setIsStatsVisible] = useState(false)
  const [isTimelineVisible, setIsTimelineVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)
  const [activeSemester, setActiveSemester] = useState<string | null>(null)
  
  const statsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const semesterRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Mock data based on the provided transcript
  const mockAcademicsData: Academic[] = [
    // Current Enrolled Subjects (2025 Spring)
    {
      id: 1,
      name: 'Advanced Software Development',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'Advanced concepts in software development, design patterns, and enterprise architecture'
    },
    {
      id: 2,
      name: 'Fundamentals of Interaction Design',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'User experience design, human-computer interaction, and interface design principles'
    },
    {
      id: 3,
      name: 'Project Management and the Professional',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'Professional project management methodologies and industry practices'
    },
    {
      id: 4,
      name: 'Interaction Media',
      semester: '2025 SPR',
      status: 'enrolled',
      creditPoints: 6,
      description: 'Interactive media design, user experience, and digital interaction principles'
    },
    
    // Completed Subjects (2025 Autumn)
    {
      id: 5,
      name: 'Computer Graphics',
      semester: '2025 AUT',
      grade: 'DISTINCTION',
      marks: 81,
      status: 'completed',
      creditPoints: 6,
      description: '3D graphics programming, rendering techniques, and computer visualization'
    },
    {
      id: 6,
      name: 'Data Structures and Algorithms',
      semester: '2025 AUT',
      grade: 'HIGH DISTINCTION',
      marks: 92,
      status: 'completed',
      creditPoints: 6,
      description: 'Advanced data structures, algorithm analysis, and computational complexity'
    },
    {
      id: 7,
      name: 'Game Design Methodologies',
      semester: '2025 AUT',
      grade: 'PASS',
      marks: 64,
      status: 'completed',
      creditPoints: 6,
      description: 'Game design principles, prototyping, and iterative development processes'
    },
    {
      id: 8,
      name: 'Introduction to Software Development',
      semester: '2025 AUT',
      grade: 'HIGH DISTINCTION',
      marks: 90,
      status: 'completed',
      creditPoints: 6,
      description: 'Software development lifecycle, version control, and collaborative programming'
    },
    
    // Completed Subjects (2024 Spring)
    {
      id: 9,
      name: 'Cloud Computing and Software as a Service',
      semester: '2024 SPR',
      grade: 'HIGH DISTINCTION',
      marks: 86,
      status: 'completed',
      creditPoints: 6,
      description: 'Cloud architecture, microservices, containerization, and SaaS development'
    },
    {
      id: 10,
      name: 'Communication for IT Professionals',
      semester: '2024 SPR',
      grade: 'CREDIT',
      marks: 70,
      status: 'completed',
      creditPoints: 6,
      description: 'Technical communication, documentation, and professional presentation skills'
    },
    {
      id: 11,
      name: 'Introduction to Computer Game Development',
      semester: '2024 SPR',
      grade: 'CREDIT',
      marks: 66,
      status: 'completed',
      creditPoints: 6,
      description: 'Game development fundamentals, Unity engine, and interactive media creation'
    },
    {
      id: 12,
      name: 'Software Architecture',
      semester: '2024 SPR',
      grade: 'DISTINCTION',
      marks: 80,
      status: 'completed',
      creditPoints: 6,
      description: 'Architectural patterns, system design, and scalable software solutions'
    },
    
    // Exemptions
    {
      id: 13,
      name: 'Business Requirements Modelling',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Business analysis, requirements gathering, and process modeling'
    },
    {
      id: 14,
      name: 'Database Fundamentals',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Relational database design, SQL, and data management principles'
    },
    {
      id: 15,
      name: 'Introduction to Information Systems',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Information systems concepts, enterprise systems, and IT governance'
    },
    {
      id: 16,
      name: 'Network Fundamentals',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Network protocols, infrastructure, and distributed systems'
    },
    {
      id: 17,
      name: 'Programming 1',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Fundamental programming concepts and problem-solving techniques'
    },
    {
      id: 18,
      name: 'Programming 2',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Object-oriented programming, data structures, and software design'
    },
    {
      id: 19,
      name: 'Web Systems',
      semester: 'Exemption',
      status: 'exemption',
      creditPoints: 6,
      description: 'Web development, client-server architecture, and web technologies'
    }
  ]

  useEffect(() => {
    async function fetchAcademics() {
      setLoading(true)
      try {
        // In production, this would fetch from the API
        // const response = await getAcademics({})
        // if (response.success) {
        //   setAcademics(response.data.items)
        // }
        
        // For now, use mock data
        setAcademics(mockAcademicsData)
      } catch (error) {
        console.error('Failed to fetch academics:', error)
        setAcademics(mockAcademicsData) // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }
    fetchAcademics()
  }, [])

  // IntersectionObserver for scroll animations
  useEffect(() => {
    if (loading || academics.length === 0) return

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true)
        }
      })
    }, observerOptions)

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsTimelineVisible(true)
        }
      })
    }, observerOptions)

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          const cardId = parseInt(entry.target.dataset.cardId || '0', 10)
          setVisibleCards((prev) => new Set([...prev, cardId]))
        }
      })
    }, observerOptions)

    if (statsRef.current) {
      statsObserver.observe(statsRef.current)
    }
    if (timelineRef.current) {
      timelineObserver.observe(timelineRef.current)
    }

    // Observe all academic cards after a brief delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const cards = document.querySelectorAll('[data-card-id]')
      cards.forEach((card) => cardObserver.observe(card))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (statsRef.current) statsObserver.unobserve(statsRef.current)
      if (timelineRef.current) timelineObserver.unobserve(timelineRef.current)
      const cards = document.querySelectorAll('[data-card-id]')
      cards.forEach((card) => cardObserver.unobserve(card))
    }
  }, [academics, loading])

  if (loading) {
    return (
      <PageWrapper role="main" aria-label={t('academics.title', 'Academic Record')}>
      <Container>
        <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
        <LoadingText>{t('common.loading', 'Loading...')}</LoadingText>
      </Container>
      </PageWrapper>
    )
  }

  // Empty state
  if (academics.length === 0) {
    return (
      <PageWrapper role="main" aria-label={t('academics.title', 'Academic Record')}>
        <Container>
          <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
          <LoadingText>{t('academics.notFound', 'Academic information not found')}</LoadingText>
        </Container>
      </PageWrapper>
    )
  }

  // Calculate statistics
  const completedSubjects = academics.filter(a => a.status === 'completed')
  const totalCreditPoints = academics.reduce((sum, a) => sum + (a.creditPoints || 0), 0)
  const completedCreditPoints = completedSubjects.reduce((sum, a) => sum + (a.creditPoints || 0), 0)
  const averageMark = completedSubjects.filter(a => a.marks).reduce((sum, a, _, arr) => sum + (a.marks || 0) / arr.length, 0)
  
  // Calculate GPA trend (mock data - in real app, this would come from backend)
  const gpaTrend = [5.5, 5.7, 5.8, 5.88]
  const wamTrend = [75, 78, 80, averageMark]
  
  // Group academics by status and semester
  const groupedAcademics = academics.reduce((groups, academic) => {
    const key = academic.status === 'exemption' ? 'exemption' : academic.semester
    if (!groups[key]) groups[key] = []
    groups[key].push(academic)
    return groups
  }, {} as Record<string, Academic[]>)
  
  // Sort groups by semester (most recent first)
  const sortedGroups = Object.entries(groupedAcademics).sort(([a], [b]) => {
    if (a === 'exemption') return 1
    if (b === 'exemption') return -1
    return b.localeCompare(a)
  })
  
  // Handle card expansion
  const handleCardClick = (academicId: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(academicId)) {
        newSet.delete(academicId)
      } else {
        newSet.add(academicId)
      }
      return newSet
    })
  }
  
  // Handle semester navigation
  const handleSemesterClick = (semester: string) => {
    setActiveSemester(semester)
    const element = semesterRefs.current.get(semester)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  
  // Generate sparkline path
  const generateSparklinePath = (data: number[], width: number = 100, height: number = 32) => {
    if (data.length === 0) return ''
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const stepX = width / (data.length - 1)
    
    const points = data.map((value, index) => {
      const x = index * stepX
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
  }
  
  // Tooltip messages
  const getTooltipMessage = (statType: string): string => {
    switch (statType) {
      case 'gpa':
        return t('academics.tooltip.gpa', 'GPA 5.88 is in the top 10% of students')
      case 'wam':
        return t('academics.tooltip.wam', 'WAM target: Maintain above 80')
      case 'totalCredits':
        return t('academics.tooltip.totalCredits', 'Total credit points completed')
      case 'completedCredits':
        return t('academics.tooltip.completedCredits', 'Credits completed with grades')
      default:
        return ''
    }
  }

  return (
    <PageWrapper role="main" aria-label={t('academics.title', 'Academic Record')}>
    <Container>
      <PageTitle>{t('academics.title', 'Academic Record')}</PageTitle>
      
        <SummaryStats ref={statsRef} $isVisible={isStatsVisible} role="region" aria-label={t('academics.stats.title', 'Academic Statistics')}>
          <StatCard 
            $isVisible={isStatsVisible} 
            $isHighlighted={false}
            tabIndex={0} 
            role="article" 
            aria-label={t('academics.stats.totalCredits', 'Total Credit Points')}
            onMouseEnter={() => setHoveredStat('totalCredits')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <Tooltip $isVisible={hoveredStat === 'totalCredits'}>
              {getTooltipMessage('totalCredits')}
            </Tooltip>
            <h3>{totalCreditPoints}</h3>
            <p>{t('academics.stats.totalCredits', 'Total Credit Points')}</p>
          </StatCard>
          <StatCard 
            $isVisible={isStatsVisible} 
            $isHighlighted={false}
            tabIndex={0} 
            role="article" 
            aria-label={t('academics.stats.completedCredits', 'Completed Credit Points')}
            onMouseEnter={() => setHoveredStat('completedCredits')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <Tooltip $isVisible={hoveredStat === 'completedCredits'}>
              {getTooltipMessage('completedCredits')}
            </Tooltip>
            <h3>{completedCreditPoints}</h3>
            <p>{t('academics.stats.completedCredits', 'Completed Credit Points')}</p>
          </StatCard>
          <StatCard 
            $isVisible={isStatsVisible} 
            $isHighlighted={true}
            tabIndex={0} 
            role="article" 
            aria-label={t('academics.stats.gpa', 'GPA')}
            onMouseEnter={() => setHoveredStat('gpa')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <Tooltip $isVisible={hoveredStat === 'gpa'}>
              {getTooltipMessage('gpa')}
            </Tooltip>
            <h3>5.88</h3>
            <p>{t('academics.stats.gpa', 'GPA')}</p>
            <SparklineChart viewBox="0 0 100 32" preserveAspectRatio="none">
              <path
                d={generateSparklinePath(gpaTrend, 100, 32)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--primary-500)' }}
              />
            </SparklineChart>
          </StatCard>
          <StatCard 
            $isVisible={isStatsVisible} 
            $isHighlighted={true}
            tabIndex={0} 
            role="article" 
            aria-label={t('academics.stats.wam', 'WAM')}
            onMouseEnter={() => setHoveredStat('wam')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <Tooltip $isVisible={hoveredStat === 'wam'}>
              {getTooltipMessage('wam')}
            </Tooltip>
            <h3>{averageMark.toFixed(1)}</h3>
            <p>{t('academics.stats.wam', 'WAM (Weighted Average Mark)')}</p>
            <SparklineChart viewBox="0 0 100 32" preserveAspectRatio="none">
              <path
                d={generateSparklinePath(wamTrend, 100, 32)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--primary-500)' }}
              />
            </SparklineChart>
          </StatCard>
        </SummaryStats>
        
        <QuickNavBar role="navigation" aria-label={t('academics.navigation.title', 'Quick Navigation')}>
          {sortedGroups.map(([semester]) => (
            <QuickNavButton
              key={semester}
              $isActive={activeSemester === semester}
              onClick={() => handleSemesterClick(semester)}
              aria-label={t('academics.navigation.semester', { semester }, `Navigate to ${semester}`)}
            >
              {semester === 'exemption' ? t('academics.exemptions', 'Exemptions') : semester}
            </QuickNavButton>
          ))}
        </QuickNavBar>
      
        <TimelineContainer ref={timelineRef} role="region" aria-label={t('academics.timeline.title', 'Academic Timeline')}>
        {sortedGroups.map(([semester, academicGroup]) => (
          <div 
            key={semester}
            ref={(el) => {
              if (el) semesterRefs.current.set(semester, el)
            }}
          >
              <SemesterTitle $isVisible={isTimelineVisible}>
                {semester === 'exemption' ? t('academics.exemptions', 'Exemptions') : semester}
            </SemesterTitle>
              {academicGroup.map((academic, index) => (
                <AcademicCard 
                  key={academic.id} 
                  status={academic.status}
                  $isVisible={visibleCards.has(academic.id)}
                  $index={index}
                  $isExpanded={expandedCards.has(academic.id)}
                  data-card-id={academic.id}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`academic-${academic.id}-title`}
                  aria-expanded={expandedCards.has(academic.id)}
                  onClick={() => handleCardClick(academic.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCardClick(academic.id)
                    }
                  }}
                >
                  <AcademicTitle id={`academic-${academic.id}-title`}>
                  <span>{academic.name}</span>
                  <GradeContainer>
                      {academic.grade && (
                        <GradeBadge grade={academic.grade} aria-label={t('academics.grade', { grade: academic.grade }, 'Grade: {{grade}}')}>
                          {academic.grade}
                        </GradeBadge>
                      )}
                      <StatusBadge status={academic.status} aria-label={t('academics.status', { status: academic.status }, 'Status: {{status}}')}>
                        {t(`academics.status.${academic.status}`, academic.status.toUpperCase())}
                    </StatusBadge>
                  </GradeContainer>
                </AcademicTitle>
                <AcademicMeta>
                    <span>{t('academics.semester', { semester: academic.semester }, academic.semester)}</span>
                    {academic.marks && (
                      <span>
                        {t('academics.mark', { mark: academic.marks }, 'Mark: {{mark}}')}
                      </span>
                    )}
                    {academic.creditPoints && (
                      <span>
                        {t('academics.creditPoints', { points: academic.creditPoints }, '{{points}} Credit Points')}
                      </span>
                    )}
                </AcademicMeta>
                  {academic.description && (
                    <AcademicDescription>{academic.description}</AcademicDescription>
                  )}
                  <ExpandedContent $isExpanded={expandedCards.has(academic.id)}>
                    <DetailRow>
                      <strong>{t('academics.details.subjectCode', 'Subject Code')}:</strong>
                      <span>{t('academics.details.subjectCodeValue', 'N/A')}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>{t('academics.details.lecturer', 'Lecturer')}:</strong>
                      <span>{t('academics.details.lecturerValue', 'TBA')}</span>
                    </DetailRow>
                    {academic.description && (
                      <DetailRow>
                        <strong>{t('academics.details.description', 'Description')}:</strong>
                        <span style={{ textAlign: 'right', maxWidth: '60%' }}>{academic.description}</span>
                      </DetailRow>
                    )}
                  </ExpandedContent>
              </AcademicCard>
            ))}
          </div>
        ))}
      </TimelineContainer>
    </Container>
    </PageWrapper>
  )
}
