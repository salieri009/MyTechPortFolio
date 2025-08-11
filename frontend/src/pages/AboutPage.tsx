import React from 'react'
import styled from 'styled-components'
import { Container, Card, Button } from '@components/common'

const AboutSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`

const AboutTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 24px;
  color: #0f172a;
`

const AboutContent = styled.div`
  font-size: 18px;
  line-height: 1.6;
  color: #334155;
  margin-bottom: 40px;

  p {
    margin-bottom: 16px;
  }
`

const ContactSection = styled(Card)`
  margin-top: 40px;
  text-align: center;
`

const ContactTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #0f172a;
`

const ContactButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`

export function AboutPage() {
  return (
    <Container>
      <AboutSection>
        <AboutTitle>안녕하세요!</AboutTitle>
        <AboutContent>
          <p>
            문제 해결을 즐기고, 기술을 통해 가치 있는 서비스를 만들어 나가는 개발자입니다.
          </p>
          <p>
            사용자 경험을 중시하며, 깔끔하고 효율적인 코드를 작성하는 것을 지향합니다.
            팀워크를 통해 더 나은 결과를 만들어내는 과정을 좋아합니다.
          </p>
          <p>
            현재는 풀스택 개발에 관심이 많으며, 특히 React와 Spring Boot를 활용한
            웹 애플리케이션 개발에 집중하고 있습니다.
          </p>
        </AboutContent>

        <ContactSection>
          <ContactTitle>연락하기</ContactTitle>
          <ContactButtons>
            <Button as="a" href="mailto:your-email@example.com">
              이메일
            </Button>
            <Button as="a" href="https://github.com/salieri009" target="_blank" variant="ghost">
              GitHub
            </Button>
            <Button as="a" href="https://linkedin.com/in/yourprofile" target="_blank" variant="ghost">
              LinkedIn
            </Button>
          </ContactButtons>
        </ContactSection>
      </AboutSection>
    </Container>
  )
}
