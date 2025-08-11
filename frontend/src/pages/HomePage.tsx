import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container, Button } from '@components/common'
import { Typewriter } from '@components/Typewriter'
import { CONTACT_INFO } from '../constants/contact'

const Hero = styled.section`
  text-align: center;
  padding: 60px 0 80px 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]} 0%, ${props => props.theme.colors.secondary[500]} 100%);
  color: white;
  transition: background 0.3s ease;
  margin-top: -1px; /* Remove gap with header */
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

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`

const TechStackSection = styled.section`
  padding: 60px 0;
  text-align: center;
  background: ${props => props.theme.colors.bgSecondary};
  transition: background-color 0.3s ease;
`

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 40px;
  color: ${props => props.theme.colors.text};
`

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`

const TechItem = styled.div`
  padding: 20px;
  background: ${props => props.theme.colors.bg};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 120ms ease, box-shadow 0.2s ease;
  color: ${props => props.theme.colors.text};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`

const TECH_STACKS = [
  'React', 'TypeScript', 'Vite', 'styled-components', 
  'Spring Boot', 'Java', 'MySQL', 'H2 Database',
  'Zustand', 'react-i18next', 'Docker', 'AWS', 'Git'
]

export function HomePage() {
  const { t } = useTranslation()

  return (
    <>
      <Hero>
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

      <TechStackSection>
        <Container>
          <SectionTitle>{t('about.skills')}</SectionTitle>
          <TechGrid>
            {TECH_STACKS.map((tech) => (
              <TechItem key={tech}>
                <h3>{tech}</h3>
              </TechItem>
            ))}
          </TechGrid>
        </Container>
      </TechStackSection>
    </>
  )
}
