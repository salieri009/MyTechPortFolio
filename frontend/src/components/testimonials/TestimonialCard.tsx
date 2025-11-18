import React from 'react'
import styled from 'styled-components'
import type { Testimonial } from '../../mocks/testimonials'

const TestimonialCardWrapper = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  padding: ${props => props.theme.spacing[8]};
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: ${props => props.theme.shadows.sm};
  
  /* H1: Visibility of System Status - Hover feedback */
  &:hover {
    transform: translateY(-${props => props.theme.spacing[1]});
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary[500]};
  }
  
  /* H3: User Control & Freedom - Focus state for keyboard navigation */
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
    border-color: ${props => props.theme.colors.primary[500]};
  }

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[6]};
  }
  
  /* H8: Aesthetic & Minimalist - Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    transform: none;
    
    &:hover {
      transform: none;
    }
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
  pointer-events: none; /* H8: Aesthetic & Minimalist - Prevent interaction */
  user-select: none; /* Prevent text selection */
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
  width: ${props => props.theme.spacing[12]};
  height: ${props => props.theme.spacing[12]};
  border-radius: 50%;
  object-fit: cover;
  background: ${props => props.theme.colors.primary[100] || props.theme.colors.primary[50]};
`

const AuthorPlaceholder = styled.div`
  width: ${props => props.theme.spacing[12]};
  height: ${props => props.theme.spacing[12]};
  border-radius: 50%;
  background: ${props => props.theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.hero.text};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[0.5]}; /* 4-point system: 4px spacing between name and position */
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

// R3: Contextual Trust - Relationship Context Tag
const RelationshipContextTag = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[700]};
  border: 1px solid ${props => props.theme.colors.primary[200]};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-top: ${props => props.theme.spacing[2]};
  text-transform: capitalize;
`

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  return (
    <TestimonialCardWrapper
      role="article"
      aria-labelledby={`testimonial-${testimonial.author.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <QuoteMark aria-hidden="true">"</QuoteMark>
      <QuoteText id={`testimonial-${testimonial.author.replace(/\s+/g, '-').toLowerCase()}`}>
        {testimonial.quote}
      </QuoteText>
      <AuthorSection>
        {testimonial.image ? (
          <AuthorImage 
            src={testimonial.image} 
            alt={`${testimonial.author}, ${testimonial.position}`}
            loading="lazy"
          />
        ) : (
          <AuthorPlaceholder aria-hidden="true">
            {getInitial(testimonial.author)}
          </AuthorPlaceholder>
        )}
        <AuthorInfo>
          <AuthorName>{testimonial.author}</AuthorName>
          <AuthorPosition>
            {testimonial.position}
            {testimonial.company && ` at ${testimonial.company}`}
          </AuthorPosition>
          {/* R3: Contextual Trust - Relationship Context Tag */}
          {(testimonial as any).type && (
            <RelationshipContextTag>
              {(testimonial as any).type === 'COLLEAGUE' && 'Co-worker'}
              {(testimonial as any).type === 'CLIENT' && 'Client'}
              {(testimonial as any).type === 'MENTOR' && 'Mentor'}
              {(testimonial as any).type === 'PROFESSOR' && 'Professor'}
              {(testimonial as any).type === 'OTHER' && 'Colleague'}
            </RelationshipContextTag>
          )}
        </AuthorInfo>
      </AuthorSection>
    </TestimonialCardWrapper>
  )
}
