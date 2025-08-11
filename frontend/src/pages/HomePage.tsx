import React from 'react'
import styled from 'styled-components'
import { Container, Button } from '@components/common'

const Hero = styled.section`
  text-align: center;
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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

const TechStackSection = styled.section`
  padding: 60px 0;
  text-align: center;
`

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 40px;
  color: #0f172a;
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 120ms ease;

  &:hover {
    transform: translateY(-4px);
  }
`

const TECH_STACKS = ['React', 'TypeScript', 'Spring Boot', 'MySQL', 'Docker', 'AWS']

export function HomePage() {
  return (
    <>
      <Hero>
        <Container>
          <Title>문제 해결을 즐기는 개발자입니다</Title>
          <Subtitle>기술을 통해 가치 있는 서비스를 만들어 나갑니다</Subtitle>
          <CTAButtons>
            <Button size="lg">프로젝트 보기</Button>
            <Button size="lg" variant="ghost">
              연락하기
            </Button>
          </CTAButtons>
        </Container>
      </Hero>

      <TechStackSection>
        <Container>
          <SectionTitle>주요 기술 스택</SectionTitle>
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
