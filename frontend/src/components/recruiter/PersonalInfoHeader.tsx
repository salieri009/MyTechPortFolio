import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { PERSONAL_INFO, CAREER_SUMMARY } from '../../constants/contact'
import { useThemeStore } from '../../stores/themeStore'

const HeaderContainer = styled.div<{ $isDark: boolean }>`
  background: ${({ theme, $isDark }) => 
    $isDark 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
  };
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $isDark }) => 
      $isDark 
        ? 'radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
    };
    pointer-events: none;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }
`

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`

const Avatar = styled.div<{ $isDark: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ $isDark }) => 
    $isDark 
      ? 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)'
      : 'linear-gradient(45deg, #fff 0%, #f0f0f0 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: ${({ $isDark }) => $isDark ? '#1a1a2e' : '#2d3748'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`

const ProfileInfo = styled.div`
  color: white;
`

const Name = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Title = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 500;
`

const Experience = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
  opacity: 0.8;
`

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StatCard = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => 
    $isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $isDark }) => 
    $isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.3)'
  };
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: white;
`

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  font-weight: 500;
`

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`

const ContactItem = styled.a<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${({ $isDark }) => 
    $isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $isDark }) => 
    $isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.3)'
  };
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $isDark }) => 
      $isDark 
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(255, 255, 255, 0.3)'
    };
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`

const Icon = styled.span`
  font-size: 1rem;
`

export const PersonalInfoHeader: React.FC = () => {
  const { t } = useTranslation()
  const isDark = useThemeStore((state: any) => state.isDark)
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }
  
  return (
    <HeaderContainer $isDark={isDark}>
      <ContentWrapper>
        <ProfileSection>
          <Avatar $isDark={isDark}>
            {getInitials(t('recruiter.personalInfo.name'))}
          </Avatar>
          <ProfileInfo>
            <Name>{t('recruiter.personalInfo.name')}</Name>
            <Title>{t('recruiter.personalInfo.jobTitle')}</Title>
            <Experience>{t('recruiter.personalInfo.experience')} • {t('recruiter.personalInfo.location')}</Experience>
          </ProfileInfo>
        </ProfileSection>
        
        <StatsSection>
          <StatCard $isDark={isDark}>
            <StatNumber>{CAREER_SUMMARY.totalProjects}</StatNumber>
            <StatLabel>{t('recruiter.personalInfo.stats.projects')}</StatLabel>
          </StatCard>
          <StatCard $isDark={isDark}>
            <StatNumber>{CAREER_SUMMARY.totalExperience}</StatNumber>
            <StatLabel>{t('recruiter.personalInfo.stats.experience')}</StatLabel>
          </StatCard>
          <StatCard $isDark={isDark}>
            <StatNumber>{CAREER_SUMMARY.achievements.length}</StatNumber>
            <StatLabel>{t('recruiter.personalInfo.stats.achievements')}</StatLabel>
          </StatCard>
        </StatsSection>
        
        <ContactSection>
          <ContactItem 
            href={`mailto:${PERSONAL_INFO.email}`} 
            $isDark={isDark}
          >
            <Icon>📧</Icon>
            {t('recruiter.personalInfo.contact.email')}
          </ContactItem>
          <ContactItem 
            href={PERSONAL_INFO.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={isDark}
          >
            <Icon>💼</Icon>
            {t('recruiter.personalInfo.contact.linkedin')}
          </ContactItem>
          <ContactItem 
            href={PERSONAL_INFO.github} 
            target="_blank" 
            rel="noopener noreferrer"
            $isDark={isDark}
          >
            <Icon>💻</Icon>
            {t('recruiter.personalInfo.contact.github')}
          </ContactItem>
        </ContactSection>
      </ContentWrapper>
    </HeaderContainer>
  )
}
