import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { CAREER_SUMMARY } from '../../constants/contact'
import { useThemeStore } from '../../stores/themeStore'

const DashboardContainer = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => 
    $isDark 
      ? 'rgba(26, 32, 44, 0.8)'
      : 'rgba(255, 255, 255, 0.9)'
  };
  backdrop-filter: blur(20px);
  border: 1px solid ${({ $isDark }) => 
    $isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'
  };
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };
`

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`

const HeaderContent = styled.div`
  flex: 1;
`

const ResumeDownloadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
  }
`

const ResumeButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ResumeButton = styled.button<{ $isDark: boolean; $language: 'ko' | 'en' | 'ja' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${({ $isDark, $language }) => {
    const colors = {
      ko: $isDark ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' : 'linear-gradient(45deg, #ff7675, #fd79a8)',
      en: $isDark ? 'linear-gradient(45deg, #4facfe, #00f2fe)' : 'linear-gradient(45deg, #74b9ff, #0984e3)',
      ja: $isDark ? 'linear-gradient(45deg, #a29bfe, #6c5ce7)' : 'linear-gradient(45deg, #fd79a8, #e84393)'
    }
    return colors[$language]
  }};
  
  color: white;
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? '0 4px 15px rgba(0, 0, 0, 0.3)'
      : '0 4px 15px rgba(0, 0, 0, 0.1)'
  };
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $isDark }) => 
      $isDark 
        ? '0 6px 20px rgba(0, 0, 0, 0.4)'
        : '0 6px 20px rgba(0, 0, 0, 0.15)'
    };
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ResumeLabel = styled.span<{ $isDark: boolean }>`
  font-size: 0.75rem;
  color: ${({ $isDark }) => $isDark ? '#a0aec0' : '#718096'};
  margin-bottom: 0.25rem;
`

const Title = styled.h2<{ $isDark: boolean }>`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2d3748'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '📊';
    font-size: 1.2rem;
  }
`

const Subtitle = styled.p<{ $isDark: boolean }>`
  margin: 0;
  color: ${({ $isDark }) => $isDark ? '#a0aec0' : '#718096'};
  font-size: 0.95rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const SkillsSection = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => 
    $isDark 
      ? 'rgba(45, 55, 72, 0.6)'
      : 'rgba(247, 250, 252, 0.8)'
  };
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${({ $isDark }) => 
    $isDark 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)'
  };
`

const SectionTitle = styled.h3<{ $isDark: boolean }>`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2d3748'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const SkillTag = styled.span<{ $isDark: boolean }>`
  display: inline-block;
  background: ${({ $isDark }) => 
    $isDark 
      ? 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)'
      : 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0.25rem 0.25rem 0.25rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`

const AchievementsSection = styled.div`
  margin-top: 2rem;
`

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const AchievementCard = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => 
    $isDark 
      ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
  };
  border: 1px solid ${({ $isDark }) => 
    $isDark 
      ? 'rgba(79, 172, 254, 0.2)'
      : 'rgba(102, 126, 234, 0.2)'
  };
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $isDark }) => 
      $isDark 
        ? '0 8px 25px rgba(79, 172, 254, 0.15)'
        : '0 8px 25px rgba(102, 126, 234, 0.15)'
    };
  }
`

const AchievementTitle = styled.h4<{ $isDark: boolean }>`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $isDark }) => $isDark ? '#e2e8f0' : '#2d3748'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '🎯';
    font-size: 0.9rem;
  }
`

const AchievementDescription = styled.p<{ $isDark: boolean }>`
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: ${({ $isDark }) => $isDark ? '#a0aec0' : '#718096'};
  line-height: 1.5;
`

const AchievementImpact = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => 
    $isDark 
      ? 'rgba(79, 172, 254, 0.15)'
      : 'rgba(102, 126, 234, 0.15)'
  };
  color: ${({ $isDark }) => 
    $isDark 
      ? '#4facfe'
      : '#667eea'
  };
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
`

const IndustryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`

const IndustryTag = styled.span<{ $isDark: boolean }>`
  background: ${({ $isDark }) => 
    $isDark 
      ? 'rgba(168, 85, 247, 0.2)'
      : 'rgba(168, 85, 247, 0.1)'
  };
  color: ${({ $isDark }) => 
    $isDark 
      ? '#c084fc'
      : '#a855f7'
  };
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${({ $isDark }) => 
    $isDark 
      ? 'rgba(168, 85, 247, 0.3)'
      : 'rgba(168, 85, 247, 0.2)'
  };
`

const AchievementDate = styled.div<{ $isDark: boolean }>`
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: ${({ $isDark }) => $isDark ? '#a0aec0' : '#718096'};
  text-align: right;
`

export const CareerSummaryDashboard: React.FC = () => {
  const { t } = useTranslation()
  const isDark = useThemeStore((state: any) => state.isDark)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long' 
    })
  }
  
  // 이력서 다운로드 함수
  const downloadResume = (language: 'ko' | 'en' | 'ja') => {
    const fileNames = {
      ko: 'resume-korean.txt',
      en: 'English Resume.pdf', 
      ja: 'resume-japanese.txt'
    }
    
    const displayNames = {
      ko: 'salieri009_이력서_한국어.txt',
      en: 'salieri009_Resume_English.pdf',
      ja: 'salieri009_履歴書_日本語.txt'
    }
    
    const filePath = `/resumes/${fileNames[language]}`
    
    // 파일 다운로드
    const link = document.createElement('a')
    link.href = filePath
    link.download = displayNames[language]
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // 번역된 성과 데이터 생성 (현재 공백으로 설정)
  const translatedAchievements = [
    {
      title: t('recruiter.careerSummary.achievements.performance.title') || '',
      description: t('recruiter.careerSummary.achievements.performance.description') || '',
      impact: t('recruiter.careerSummary.achievements.performance.impact') || '',
      date: CAREER_SUMMARY.achievements[0].date
    },
    {
      title: t('recruiter.careerSummary.achievements.userExperience.title') || '',
      description: t('recruiter.careerSummary.achievements.userExperience.description') || '',
      impact: t('recruiter.careerSummary.achievements.userExperience.impact') || '',
      date: CAREER_SUMMARY.achievements[1].date
    },
    {
      title: t('recruiter.careerSummary.achievements.codeQuality.title') || '',
      description: t('recruiter.careerSummary.achievements.codeQuality.description') || '',
      impact: t('recruiter.careerSummary.achievements.codeQuality.impact') || '',
      date: CAREER_SUMMARY.achievements[2].date
    }
  ]
  
  return (
    <DashboardContainer $isDark={isDark}>
      <Header>
        <HeaderContent>
          <Title $isDark={isDark}>
            {t('recruiter.careerSummary.title')}
          </Title>
          <Subtitle $isDark={isDark}>
            {t('recruiter.careerSummary.subtitle')}
          </Subtitle>
        </HeaderContent>
        
        <ResumeDownloadSection>
          <ResumeLabel $isDark={isDark}>
            📄 {t('recruiter.careerSummary.resumeDownload.label', '이력서 다운로드')}
          </ResumeLabel>
          <ResumeButtonGroup>
            <ResumeButton 
              $isDark={isDark} 
              $language="ko"
              onClick={() => downloadResume('ko')}
              title={t('recruiter.careerSummary.resumeDownload.korean', '한국어 이력서 다운로드')}
            >
              🇰🇷 한국어
            </ResumeButton>
            <ResumeButton 
              $isDark={isDark} 
              $language="en"
              onClick={() => downloadResume('en')}
              title={t('recruiter.careerSummary.resumeDownload.english', 'English Resume Download')}
            >
              🇺🇸 English
            </ResumeButton>
            <ResumeButton 
              $isDark={isDark} 
              $language="ja"
              onClick={() => downloadResume('ja')}
              title={t('recruiter.careerSummary.resumeDownload.japanese', '日本語履歴書ダウンロード')}
            >
              🇯🇵 日本語
            </ResumeButton>
          </ResumeButtonGroup>
        </ResumeDownloadSection>
      </Header>
      
      <Grid>
        <SkillsSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>
            🛠️ {t('recruiter.careerSummary.sections.coreSkills')}
          </SectionTitle>
          <div>
            {CAREER_SUMMARY.primarySkills.map((skill, index) => (
              <SkillTag key={index} $isDark={isDark}>
                {skill}
              </SkillTag>
            ))}
          </div>
        </SkillsSection>
        
        <SkillsSection $isDark={isDark}>
          <SectionTitle $isDark={isDark}>
            🎯 {t('recruiter.careerSummary.sections.expertise')}
          </SectionTitle>
          <IndustryTags>
            {CAREER_SUMMARY.industryFocus.map((industry, index) => (
              <IndustryTag key={index} $isDark={isDark}>
                {industry}
              </IndustryTag>
            ))}
          </IndustryTags>
        </SkillsSection>
      </Grid>
      
      <AchievementsSection>
        <SectionTitle $isDark={isDark}>
          🏆 {t('recruiter.careerSummary.sections.achievements')}
        </SectionTitle>
        <AchievementGrid>
          {translatedAchievements.map((achievement, index) => {
            // 모든 필드가 비어있으면 카드를 숨김
            if (!achievement.title && !achievement.description && !achievement.impact) {
              return null;
            }
            
            return (
              <AchievementCard key={index} $isDark={isDark}>
                <AchievementTitle $isDark={isDark}>
                  {achievement.title || t('recruiter.careerSummary.placeholder.preparing')}
                </AchievementTitle>
                <AchievementDescription $isDark={isDark}>
                  {achievement.description || t('recruiter.careerSummary.placeholder.comingSoon')}
                </AchievementDescription>
                <AchievementImpact $isDark={isDark}>
                  {achievement.impact || t('recruiter.careerSummary.placeholder.measuring')}
                </AchievementImpact>
                <AchievementDate $isDark={isDark}>
                  {formatDate(achievement.date)}
                </AchievementDate>
              </AchievementCard>
            );
          })}
        </AchievementGrid>
      </AchievementsSection>
    </DashboardContainer>
  )
}
