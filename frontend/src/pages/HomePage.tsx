import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container, Button } from '@components/common'
import { Typewriter } from '@components/Typewriter'
import { ProjectShowcaseSection } from '@components/sections/ProjectShowcaseSection'
import { JourneyMilestoneSection } from '@components/sections/JourneyMilestoneSection'
import { CONTACT_INFO } from '../constants/contact'
import { useThemeStore } from '../stores/themeStore'

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
  }
  
  > * {
    position: relative;
    z-index: 1;
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

export function HomePage() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  return (
    <>
      <Hero $isDark={isDark}>
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

      <ProjectShowcaseSection />
      <JourneyMilestoneSection />
    </>
  )
}
