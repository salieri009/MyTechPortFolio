import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/common'
import { FeaturedProjectCard } from '@components/project'
import { TestimonialCard } from '@components/testimonials'
import { ProjectShowcaseSection } from '@components/sections/ProjectShowcaseSection'
import { JourneyMilestoneSection } from '@components/sections/JourneyMilestoneSection'
import { InteractiveBackground } from '@components/organisms/InteractiveBackground'
import { getProjects } from '../services/projects'
import { getTestimonials } from '../mocks/testimonials'
import { CONTACT_INFO } from '../constants/contact'
import { useThemeStore } from '../stores/themeStore'
import { SkeletonProjectCard, SkeletonTestimonialCard } from '@components/common/Skeleton'
import type { ProjectSummary } from '../types/domain'
import type { Testimonial } from '../mocks/testimonials'

const Hero = styled.section<{ $isDark: boolean }>`
  text-align: center;
  padding: 120px 0 100px 0;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]} 0%, ${props => props.theme.colors.secondary[500]} 100%);
  color: white;
  transition: background 0.3s ease;
  margin-top: -1px; /* Remove gap with header */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
    pointer-events: none;
    z-index: 1;
  }
  
  > * {
    position: relative;
    z-index: 2;
  }
  
  ${Container} {
    max-width: 800px;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0 60px 0;
    min-height: 85vh;
  }
`

const Greeting = styled.p`
  font-size: 18px;
  margin-bottom: 16px;
  opacity: 0.9;
  font-weight: 400;
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`

const Name = styled.span`
  font-weight: 600;
  color: white;
  opacity: 0.95;
`

const Headline = styled.h1`
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 40px;
    margin-bottom: 20px;
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
  }
`

const Subtitle = styled.p`
  font-size: 20px;
  margin-bottom: 48px;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 40px;
    padding: 0 20px;
  }
`

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 48px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 40px;
  }
`

const PrimaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: white;
  color: ${props => props.theme.colors.primary[600]};
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
  border: 2px solid white;
  transition: border-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
  min-width: 200px;
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.primary[500]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:active {
    box-shadow: inset 0 0 0 1px ${props => props.theme.colors.primary[500]};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: 300px;
    padding: 14px 28px;
    font-size: 16px;
  }
`

const SecondaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: transparent;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: border-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
  min-width: 200px;
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    color: ${props => props.theme.colors.primary[500]};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:active {
    box-shadow: inset 0 0 0 1px ${props => props.theme.colors.primary[500]};
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: 300px;
    padding: 14px 28px;
    font-size: 16px;
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  
  @media (max-width: 640px) {
    gap: 16px;
    margin-top: 20px;
  }
`

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }
  
  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
`

const FeaturedSection = styled.section`
  padding: 80px 0;
  background: ${props => props.theme?.colors?.background || '#F9FAFB'};
`

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${props => props.theme?.colors?.text || '#1F2937'};

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
  margin-bottom: 48px;
  line-height: 1.6;
`

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 24px;
  }
`

const ViewAllLink = styled(Link)`
  display: inline-block;
  margin-top: 48px;
  padding: 12px 24px;
  background: ${props => props.theme?.colors?.primary?.[500]} || '#3B82F6';
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme?.colors?.primary?.[600]} || '#2563EB';
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`

const TestimonialSection = styled.section`
  padding: 80px 0;
  background: ${props => props.theme?.colors?.surface || '#F3F4F6'};
`

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`

export function HomePage() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const [featuredProjects, setFeaturedProjects] = useState<ProjectSummary[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <>
      <Hero $isDark={isDark}>
        <InteractiveBackground isDark={isDark} particleCount={120} connectionDistance={180} />
        <Container>
          <Greeting>
            {t('hero.greeting')} <Name>{t('hero.name')}</Name>
          </Greeting>
          <Headline>
            {t('hero.headline')}
          </Headline>
          <Subtitle>
            {t('hero.subtitle')}
          </Subtitle>
          <CTAButtons>
            <PrimaryCTA to="/projects">
              {t('hero.cta.primary')}
            </PrimaryCTA>
            <SecondaryCTA to="/about">
              {t('hero.cta.secondary')}
            </SecondaryCTA>
          </CTAButtons>
          <SocialLinks>
            <SocialLink
              href={CONTACT_INFO.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              💼
            </SocialLink>
            <SocialLink
              href={`mailto:${CONTACT_INFO.email.student}`}
              aria-label="Send Email"
            >
              📧
            </SocialLink>
            <SocialLink
              href="https://github.com/salieri009"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              🔗
            </SocialLink>
          </SocialLinks>
        </Container>
      </Hero>

      <FeaturedSection>
        <Container>
          <SectionTitle>🌟 {t('featured.title') || 'Featured Projects'}</SectionTitle>
          <SectionSubtitle>
            {t('featured.subtitle') || 'Highlighting my most impactful and diverse projects that showcase my skills across multiple domains.'}
          </SectionSubtitle>
          {loading ? (
            <FeaturedGrid>
              <SkeletonProjectCard />
              <SkeletonProjectCard />
            </FeaturedGrid>
          ) : featuredProjects.length > 0 ? (
            <>
              <FeaturedGrid>
                {featuredProjects.map(project => (
                  <FeaturedProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    summary={project.summary}
                    startDate={project.startDate}
                    endDate={project.endDate}
                    techStacks={project.techStacks}
                    imageUrl={project.imageUrl}
                  />
                ))}
              </FeaturedGrid>
              <ViewAllLink to="/projects">
                {t('featured.viewAll') || 'View All Projects'} →
              </ViewAllLink>
            </>
          ) : null}
        </Container>
      </FeaturedSection>

      <TestimonialSection>
        <Container>
          <SectionTitle>💬 {t('testimonials.title') || 'What Others Say'}</SectionTitle>
          <SectionSubtitle>
            {t('testimonials.subtitle') || 'Feedback from colleagues and clients who have worked with me.'}
          </SectionSubtitle>
          {loading ? (
            <TestimonialGrid>
              <SkeletonTestimonialCard />
              <SkeletonTestimonialCard />
              <SkeletonTestimonialCard />
            </TestimonialGrid>
          ) : testimonials.length > 0 ? (
            <TestimonialGrid>
              {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </TestimonialGrid>
          ) : null}
        </Container>
      </TestimonialSection>

      <ProjectShowcaseSection />
      <div style={{ marginBottom: '120px' }}>
        <JourneyMilestoneSection />
      </div>
    </>
  )
}
