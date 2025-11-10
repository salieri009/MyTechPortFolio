import React from 'react'
import styled from 'styled-components'
import type { Testimonial } from '../../mocks/testimonials'

const TestimonialCardWrapper = styled.div`
  background: ${props => props.theme?.colors?.card || '#FFFFFF'};
  border: 1px solid ${props => props.theme?.colors?.border || '#E5E7EB'};
  border-radius: 12px;
  padding: 32px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme?.colors?.primary?.[500]} || '#3B82F6';
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`

const QuoteMark = styled.span`
  font-size: 48px;
  color: ${props => props.theme?.colors?.primary?.[500]} || '#3B82F6';
  opacity: 0.2;
  position: absolute;
  top: 12px;
  left: 20px;
  line-height: 1;
`

const QuoteText = styled.p`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.8;
  color: ${props => props.theme?.colors?.text || '#1F2937'};
  margin: 0 0 24px 0;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const AuthorImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: ${props => props.theme?.colors?.primary?.[100]} || '#DBEAFE';
`

const AuthorPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme?.colors?.primary?.[500]} || '#3B82F6';
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
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1F2937'};
`

const AuthorPosition = styled.div`
  font-size: 14px;
  color: ${props => props.theme?.colors?.textSecondary || '#6B7280'};
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
