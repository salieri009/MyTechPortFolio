import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/common'
import { FeaturedProjectCard } from '@components/project'
import { HeroProjectCard } from '@components/project/HeroProjectCard'
import { TestimonialCard } from '@components/testimonials'
import { JourneyMilestoneSection } from '@components/sections/JourneyMilestoneSection'
import { InteractiveBackground } from '@components/organisms/InteractiveBackground'
import { getProjects } from '../services/projects'
import { getTestimonials } from '../mocks/testimonials'
import { CONTACT_INFO } from '../constants/contact'
import { useThemeStore } from '../stores/themeStore'
import { SkeletonProjectCard, SkeletonTestimonialCard } from '@components/common/Skeleton'
import { StoryProgressBar } from '@components/common/StoryProgressBar'
import { SectionBridge } from '@components/sections/SectionBridge'
import { SectionPurpose } from '@components/sections/SectionPurpose'
import type { ProjectSummary } from '../types/domain'
import type { Testimonial } from '../mocks/testimonials'
import * as S from './HomePage.styles'

// Scroll Indicator Component
const ScrollIndicator = ({ isVisible }: { isVisible: boolean }) => (
  <S.ScrollIndicatorContainer $isVisible={isVisible}>
    <S.ScrollArrow aria-hidden="true" />
    <S.ScrollText>Scroll</S.ScrollText>
  </S.ScrollIndicatorContainer>
)

// Grid layout configuration for featured projects
// UI-L1: First project (index 0) always spans full width (1 / -1) - The Blockbuster
// UI-L2: Asymmetric span values for visual rhythm - The Rhythm
const getGridLayout = (index: number, total: number) => {
  // UI-L1: First project: full width (The Blockbuster)
  if (index === 0) {
    return {
      desktop: '1 / -1',  // 12-column full width
      tablet: '1 / -1',   // 6-column full width
      mobile: '1'         // Single column
    }
  }
  
  // UI-L2: Asymmetric layout patterns for visual rhythm
  // Creates intentional visual hierarchy and breaks monotony
  const patterns = [
    { desktop: 'span 6', tablet: 'span 3', mobile: '1' },  // 2nd: Large (50%)
    { desktop: 'span 3', tablet: 'span 3', mobile: '1' },  // 3rd: Small (25%)
    { desktop: 'span 3', tablet: 'span 3', mobile: '1' },  // 4th: Small (25%)
    { desktop: 'span 4', tablet: 'span 3', mobile: '1' },  // 5th: Medium (33%)
    { desktop: 'span 5', tablet: 'span 3', mobile: '1' },  // 6th: Medium-Large (42%)
    { desktop: 'span 3', tablet: 'span 3', mobile: '1' },  // 7th: Small (25%)
    { desktop: 'span 4', tablet: 'span 3', mobile: '1' },  // 8th: Medium (33%)
    { desktop: 'span 5', tablet: 'span 3', mobile: '1' },  // 9th: Medium-Large (42%)
    { desktop: 'span 2', tablet: 'span 2', mobile: '1' },  // 10th: Extra Small (17%)
    { desktop: 'span 4', tablet: 'span 4', mobile: '1' }, // 11th: Medium (33%)
    { desktop: 'span 6', tablet: 'span 3', mobile: '1' },  // 12th: Large (50%)
  ]
  
  // Use pattern based on position, creating intentional asymmetry
  const patternIndex = (index - 1) % patterns.length
  return patterns[patternIndex] || { desktop: 'span 4', tablet: 'span 3', mobile: '1' }
}

export function HomePage() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const [featuredProjects, setFeaturedProjects] = useState<ProjectSummary[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const heroRef = React.useRef<HTMLElement>(null)
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(false)
  const [isTestimonialVisible, setIsTestimonialVisible] = useState(false)
  const featuredRef = React.useRef<HTMLElement>(null)
  const testimonialRef = React.useRef<HTMLElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsResponse = await getProjects({ size: 10 })
        if (projectsResponse.success && projectsResponse.data.items) {
          const featured = projectsResponse.data.items.filter(project => project.featured)
          setFeaturedProjects(featured)
        }

        const testimonialsData = await getTestimonials()
        setTestimonials(testimonialsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Hero 섹션 가시성 감지 (스크롤 유도 힌트 표시용)
  useEffect(() => {
    if (!heroRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsHeroVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(heroRef.current)

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  // Featured 섹션 애니메이션 트리거
  useEffect(() => {
    if (!featuredRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFeaturedVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(featuredRef.current)

    return () => {
      if (featuredRef.current) {
        observer.unobserve(featuredRef.current)
      }
    }
  }, [])

  // Testimonial 섹션 애니메이션 트리거
  useEffect(() => {
    if (!testimonialRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTestimonialVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(testimonialRef.current)

    return () => {
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current)
      }
    }
  }, [])

  return (
    <>
      <StoryProgressBar />
      <S.Hero ref={heroRef} id="hero" $isDark={isDark}>
        <InteractiveBackground isDark={isDark} particleCount={120} connectionDistance={180} />
        <Container>
          <S.HeroContent>
            <S.HeroLeft>
              <S.Greeting>
                {t('hero.greeting')} <S.Name>{t('hero.name')}</S.Name>
              </S.Greeting>
              <S.Headline>
                {t('hero.headline')}
              </S.Headline>
              <S.Subtitle>
                {t('hero.subtitle')}
              </S.Subtitle>
              <S.CTAButtons>
                <S.PrimaryCTA to="/projects">
                  {t('hero.cta.primary')}
                </S.PrimaryCTA>
                <S.SecondaryCTA to="/about">
                  {t('hero.cta.secondary')}
                </S.SecondaryCTA>
              </S.CTAButtons>
            </S.HeroLeft>
            <S.HeroRight>
              <S.SocialLinks>
                <S.SocialLink
                  href={CONTACT_INFO.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  LinkedIn
                </S.SocialLink>
                <S.SocialLink
                  href={`mailto:${CONTACT_INFO.email.student}`}
                  aria-label="Send Email"
                >
                  Email
                </S.SocialLink>
                <S.SocialLink
                  href="https://github.com/salieri009"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                >
                  GitHub
                </S.SocialLink>
              </S.SocialLinks>
            </S.HeroRight>
          </S.HeroContent>
        </Container>
        <ScrollIndicator isVisible={isHeroVisible} />
      </S.Hero>

      <SectionBridge 
        text={t('storytelling.heroToJourney')}
        variant="primary"
        diagonal={true}
        overlap={true}
      />

      <div id="journey">
      <JourneyMilestoneSection />
      </div>

      <SectionBridge 
        text={t('storytelling.journeyToProjects')}
        variant="secondary"
        diagonal={true}
      />

      <S.FeaturedSection ref={featuredRef} id="projects">
        <Container>
          <S.SectionTitle $isVisible={isFeaturedVisible}>{t('featured.title') || 'Featured Projects'}</S.SectionTitle>
          <SectionPurpose 
            text={t('featured.purpose')}
          />
          {loading ? (
            <S.FeaturedGrid $isVisible={isFeaturedVisible}>
              <SkeletonProjectCard />
              <SkeletonProjectCard />
            </S.FeaturedGrid>
          ) : featuredProjects.length > 0 ? (
            <>
              <S.FeaturedGrid $isVisible={isFeaturedVisible}>
                {featuredProjects.map((project, index) => {
                  const gridLayout = getGridLayout(index, featuredProjects.length)
                  
                  if (index === 0) {
                    // 첫 번째 프로젝트: 히어로 카드
                    return (
                      <S.FeaturedGridItem
                        key={project.id}
                        $gridColumn={gridLayout.desktop}
                        $gridColumnTablet={gridLayout.tablet}
                        $gridColumnMobile={gridLayout.mobile}
                      >
                        <HeroProjectCard
                          id={project.id}
                          title={project.title}
                          summary={project.summary}
                          startDate={project.startDate}
                          endDate={project.endDate}
                          techStacks={project.techStacks}
                          imageUrl={project.imageUrl}
                        />
                      </S.FeaturedGridItem>
                    )
                  } else {
                    // 나머지 프로젝트: 일반 카드
                    return (
                      <S.FeaturedGridItem
                        key={project.id}
                        $gridColumn={gridLayout.desktop}
                        $gridColumnTablet={gridLayout.tablet}
                        $gridColumnMobile={gridLayout.mobile}
                      >
                        <FeaturedProjectCard
                          id={project.id}
                          title={project.title}
                          summary={project.summary}
                          startDate={project.startDate}
                          endDate={project.endDate}
                          techStacks={project.techStacks}
                          imageUrl={project.imageUrl}
                          index={index}
                        />
                      </S.FeaturedGridItem>
                    )
                  }
                })}
              </S.FeaturedGrid>
              <S.ViewAllLink to="/projects">
                {t('featured.viewAll') || 'View All Projects'}
              </S.ViewAllLink>
            </>
          ) : null}
        </Container>
      </S.FeaturedSection>

      <SectionBridge 
        text={t('storytelling.projectsToTestimonials')}
        variant="secondary"
      />

      <S.TestimonialSection 
        ref={testimonialRef} 
        id="testimonials"
        role="region"
        aria-labelledby="testimonials-title"
        aria-describedby="testimonials-subtitle"
      >
        <Container>
          <S.SectionTitle 
            id="testimonials-title"
            $isVisible={isTestimonialVisible}
          >
            {t('testimonials.title') || 'What Others Say'}
          </S.SectionTitle>
          <SectionPurpose 
            text={t('storytelling.testimonialsPurpose')}
          />
          <S.SectionSubtitle 
            id="testimonials-subtitle"
            $isVisible={isTestimonialVisible}
          >
            {t('testimonials.subtitle') || 'Feedback from colleagues and clients who have worked with me.'}
          </S.SectionSubtitle>
          {loading ? (
            <S.TestimonialGrid 
              $isVisible={isTestimonialVisible}
              role="list"
              aria-label="Loading testimonials"
            >
              <SkeletonTestimonialCard />
              <SkeletonTestimonialCard />
              <SkeletonTestimonialCard />
            </S.TestimonialGrid>
          ) : testimonials.length > 0 ? (
            <S.TestimonialGrid 
              $isVisible={isTestimonialVisible}
              role="list"
              aria-label="Testimonials from colleagues and clients"
            >
              {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </S.TestimonialGrid>
          ) : (
            <S.SectionSubtitle $isVisible={isTestimonialVisible}>
              {t('testimonials.empty', 'No testimonials available at this time.')}
            </S.SectionSubtitle>
          )}
        </Container>
      </S.TestimonialSection>
    </>
  )
}
