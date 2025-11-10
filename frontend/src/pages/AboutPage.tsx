import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Container, Card } from '@components/common'
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
  background: ${props => props.theme.colors.surface};
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
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: ${props => props.theme.shadows.md};
  }
`

const ContactLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 15px;
`

const ContactValue = styled.a`
  color: ${props => props.theme.colors.primary[500]};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.primary[600]};
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
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary[600]};
    transform: translateY(-1px);
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
