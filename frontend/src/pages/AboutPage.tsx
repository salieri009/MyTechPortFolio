import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Container, Card, Button } from '@components/common'
import { CONTACT_INFO } from '../constants/contact'

const AboutSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 40px 0;
`

const AboutTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.text};
`

const AboutContent = styled.div`
  font-size: 18px;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 40px;

  p {
    margin-bottom: 16px;
  }
`

const ContactSection = styled(Card)`
  margin-top: 40px;
  text-align: center;
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`

const ContactTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
`

const ContactInfo = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: ${props => props.theme.colors.bg};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
  }
`

const ContactLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 15px;
`

const ContactValue = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.primaryDark};
  }
`

const ContactButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <Container>
      <AboutSection>
        <AboutTitle>{t('about.greeting')}</AboutTitle>
        <AboutContent>
          <p>{t('about.description')}</p>
        </AboutContent>

        <ContactSection>
          <ContactTitle>{t('about.contact.title')}</ContactTitle>
          
          <ContactInfo>
            <ContactItem>
              <ContactLabel>{t('about.contact.studentEmail')}:</ContactLabel>
              <ContactValue 
                href={`mailto:${CONTACT_INFO.email.student}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.email.display}
              </ContactValue>
            </ContactItem>
            
            <ContactItem>
              <ContactLabel>{t('about.contact.personalLinkedIn')}:</ContactLabel>
              <ContactValue 
                href={CONTACT_INFO.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.linkedin.display}
              </ContactValue>
            </ContactItem>
          </ContactInfo>

          <ContactButtons>
            <ContactButton 
              href={`mailto:${CONTACT_INFO.email.student}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📧 {t('about.contact.email')}
            </ContactButton>
            
            <ContactButton 
              href={CONTACT_INFO.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              💼 {t('about.contact.linkedin')}
            </ContactButton>
          </ContactButtons>
        </ContactSection>
      </AboutSection>
    </Container>
  )
}
