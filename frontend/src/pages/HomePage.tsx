import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container, Button } from '@components/common'
import { Typewriter } from '@components/Typewriter'
import { FeaturedProjectCard } from '@components/project'
import { TestimonialCard } from '@components/testimonials'
import { ProjectShowcaseSection } from '@components/sections/ProjectShowcaseSection'
import { JourneyMilestoneSection } from '@components/sections/JourneyMilestoneSection'
import { InteractiveBackground } from '@components/organisms/InteractiveBackground'
import { getProjects } from '../services/projects'
import { getTestimonials } from '../mocks/testimonials'
import { CONTACT_INFO } from '../constants/contact'
import { useThemeStore } from '../stores/themeStore'
import type { ProjectSummary } from '../types/domain'
import type { Testimonial } from '../mocks/testimonials'

const Hero = styled.section<{ $isDark: boolean }>`
  text-align: center;
  padding: 60px 0 80px 0;
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
`

const Title = styled.h1`
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`

const Greeting = styled.p`
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.9;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const Name = styled.span`
  font-weight: 700;
  color: white;
`

const Subtitle = styled.p`
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: 280px;
    justify-content: center;
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
  grid-template-columns: 1fr;
  gap: 32px;
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
        <InteractiveBackground isDark={isDark} particleCount={60} connectionDistance={120} />
        <Container>
          <Greeting>
            <Typewriter text={t('hero.greeting')} speed={80} />
          </Greeting>
          <Title>
            <Name>
              <Typewriter text={t('hero.name')} delay={1500} speed={120} />
            </Name>
          </Title>
          <Subtitle>
            <Typewriter text={t('hero.subtitle')} delay={3000} speed={60} />
          </Subtitle>
          <CTAButtons>
            <ContactButton 
              as={Link} 
              to="/projects"
            >
              {t('hero.cta.contact')}
            </ContactButton>
            <ContactButton 
              as={Link} 
              to="/about"
            >
              🛠️ {t('hero.cta.techStack')}
            </ContactButton>
            <ContactButton 
              href={`mailto:${CONTACT_INFO.email.student}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📧 {t('hero.cta.email')}
            </ContactButton>
            <ContactButton
              href={CONTACT_INFO.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              💼 {t('hero.cta.linkedin')}
            </ContactButton>
          </CTAButtons>
        </Container>
      </Hero>

      {!loading && featuredProjects.length > 0 && (
        <FeaturedSection>
          <Container>
            <SectionTitle>🌟 {t('featured.title') || 'Featured Projects'}</SectionTitle>
            <SectionSubtitle>
              {t('featured.subtitle') || 'Highlighting my most impactful and diverse projects that showcase my skills across multiple domains.'}
            </SectionSubtitle>
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
          </Container>
        </FeaturedSection>
      )}

      {!loading && testimonials.length > 0 && (
        <TestimonialSection>
          <Container>
            <SectionTitle>💬 {t('testimonials.title') || 'What Others Say'}</SectionTitle>
            <SectionSubtitle>
              {t('testimonials.subtitle') || 'Feedback from colleagues and clients who have worked with me.'}
            </SectionSubtitle>
            <TestimonialGrid>
              {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </TestimonialGrid>
          </Container>
        </TestimonialSection>
      )}

      <ProjectShowcaseSection />
      <JourneyMilestoneSection />
    </>
  )
}
