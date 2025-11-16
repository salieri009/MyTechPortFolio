import React from 'react'
import styled from 'styled-components'
import type { Testimonial } from '../../mocks/testimonials'

const TestimonialCardWrapper = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing[8]};
  transition: all 0.3s ease;
  position: relative;
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[6]};
  }
`

const QuoteMark = styled.span`
  font-size: ${props => props.theme.typography.fontSize['5xl']};
  color: ${props => props.theme.colors.primary[500]};
  opacity: 0.2;
  position: absolute;
  top: ${props => props.theme.spacing[3]};
  left: ${props => props.theme.spacing[6]};
  line-height: 1;
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const QuoteText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  font-style: italic;
  font-family: ${props => props.theme.typography.fontFamily.primary};

  @media (max-width: 768px) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const AuthorImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: ${props => props.theme.colors.primary[100] || props.theme.colors.primary[50]};
`

const AuthorPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
`

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const AuthorName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const AuthorPosition = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  return (
    <TestimonialCardWrapper>
      <QuoteMark>"</QuoteMark>
      <QuoteText>{testimonial.quote}</QuoteText>
      <AuthorSection>
        {testimonial.image ? (
          <AuthorImage src={testimonial.image} alt={testimonial.author} />
        ) : (
          <AuthorPlaceholder>{getInitial(testimonial.author)}</AuthorPlaceholder>
        )}
        <AuthorInfo>
          <AuthorName>{testimonial.author}</AuthorName>
          <AuthorPosition>
            {testimonial.position}
            {testimonial.company && ` at ${testimonial.company}`}
          </AuthorPosition>
        </AuthorInfo>
      </AuthorSection>
    </TestimonialCardWrapper>
  )
}
