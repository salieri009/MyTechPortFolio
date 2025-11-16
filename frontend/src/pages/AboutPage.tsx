import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Container, Card } from '@components/common'
import { CONTACT_INFO } from '../constants/contact'

const AboutSection = styled.section`
  max-width: ${props => props.theme.spacing[200]}; /* 4-point system: 800px */
  margin: 0 auto;
  text-align: center;
  padding: ${props => props.theme.spacing[10]} 0; /* 4-point system: 40px */
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const AboutTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`

const AboutContent = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg}; /* 4-point system: 18px */
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */

  p {
    margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  }
`

const ContactSection = styled(Card)`
  margin-top: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
  text-align: center;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
`

const ContactTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']}; /* 4-point system: 24px */
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  color: ${props => props.theme.colors.text};
`

const ContactInfo = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  margin-bottom: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  text-align: left;
  max-width: ${props => props.theme.spacing[100]}; /* 4-point system: 400px */
  margin-left: auto;
  margin-right: auto;
`

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]}; /* 4-point system: 16px 20px → 16px 24px */
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radius.xl}; /* 4-point system: 12px */
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s ease;
  font-family: ${props => props.theme.typography.fontFamily.primary};

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
`

const ContactLabel = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base}; /* 4-point system: 15px → 16px */
`

const ContactValue = styled.a`
  color: ${props => props.theme.colors.primary[500]};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm}; /* 4-point system: 14px */
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  ${props => props.theme.hoverTransition()};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.primary[600]};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-radius: ${props => props.theme.radius.sm};
  }
`

const ContactButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]}; /* 4-point system: 16px */
  justify-content: center;
  flex-wrap: wrap;
`

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]}; /* 4-point system: 8px */
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[5]}; /* 4-point system: 12px 20px → 12px 24px */
  background: ${props => props.theme.colors.primary[500]};
  color: ${props => props.theme.colors.hero.text};
  text-decoration: none;
  border-radius: ${props => props.theme.radius.lg}; /* 4-point system: 8px */
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  transition: all 0.2s ease;

  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    background: ${props => props.theme.colors.primary[600]};
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }
  
  /* H1: Visibility - Active state */
  &:active {
    transform: translateY(0);
  }
`

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <Container>
      <AboutSection>
        <AboutTitle>About Me</AboutTitle>
        <AboutContent>
          <p>
            안녕하세요! 저는 문제 해결을 즐기는 풀스택 개발자입니다. 
            현재 호주에서 유학 중이며, 최신 웹 기술을 활용하여 사용자 경험을 개선하는 것에 열정을 가지고 있습니다.
          </p>
          <p>
            전북대학교에서 컴퓨터공학을 전공하고, 군 복무 중 통역병으로 근무하며 글로벌 커뮤니케이션 능력을 기를 수 있었습니다.
            React, TypeScript, Spring Boot 등의 기술을 활용하여 다양한 프로젝트를 진행해왔습니다.
          </p>
          <p>
            항상 새로운 기술을 배우고 적용하는 것을 좋아하며, 
            사용자 중심의 서비스를 만들어 실질적인 가치를 제공하는 것이 목표입니다.
          </p>
        </AboutContent>

        <ContactSection>
          <ContactTitle>연락처</ContactTitle>
          
          <ContactInfo>
            <ContactItem>
              <ContactLabel>이메일:</ContactLabel>
              <ContactValue 
                href={`mailto:${CONTACT_INFO.email.student}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_INFO.email.display}
              </ContactValue>
            </ContactItem>
            
            <ContactItem>
              <ContactLabel>LinkedIn:</ContactLabel>
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
              📧 이메일 보내기
            </ContactButton>
            
            <ContactButton 
              href={CONTACT_INFO.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              💼 LinkedIn 연결
            </ContactButton>
          </ContactButtons>
        </ContactSection>
      </AboutSection>
    </Container>
  )
}
