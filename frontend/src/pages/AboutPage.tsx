import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@components/common'
import { JourneyMilestoneSection } from '@components/sections/JourneyMilestoneSection'
import { SectionBridge } from '@components/sections/SectionBridge'
import { SectionPurpose } from '@components/sections/SectionPurpose'
import { TechStackModal } from '@components/modals/TechStackModal'
import { InnovationIcon, CollaborationIcon, GrowthIcon } from '@components/icons/ValueIcons'
import { GraduationCapIcon, BriefcaseIcon, SettingsIcon } from '@components/icons/BackgroundIcons'
import { useThemeStore } from '../stores/themeStore'
import { useFeedbackModalStore } from '../stores/feedbackModalStore'
import { CONTACT_INFO } from '../constants/contact'
import * as S from './AboutPage.styles'
import * as HomePageStyles from './HomePage.styles'

// Tech Stack to Mission Value mapping
const TECH_VALUE_MAP: Record<string, string[]> = {
  'React': ['innovation'],
  'TypeScript': ['innovation', 'growth'],
  'Spring Boot': ['collaboration'],
  'Node.js': ['innovation', 'collaboration'],
  'MongoDB': ['innovation'],
  'PostgreSQL': ['collaboration'],
  'Docker': ['collaboration'],
  'Azure': ['innovation'],
}

// Scroll Indicator Component (reused from HomePage)
const ScrollIndicator = ({ isVisible }: { isVisible: boolean }) => (
  <HomePageStyles.ScrollIndicatorContainer $isVisible={isVisible}>
    <HomePageStyles.ScrollArrow aria-hidden="true" />
    <HomePageStyles.ScrollText>Scroll</HomePageStyles.ScrollText>
  </HomePageStyles.ScrollIndicatorContainer>
)

export function AboutPage() {
  const { t } = useTranslation()
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  
  // Scroll animation states
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const [isStoryVisible, setIsStoryVisible] = useState(false)
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false)
  const [isMissionVisible, setIsMissionVisible] = useState(false)
  
  // Modal and interaction states
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(null)
  const [highlightedTech, setHighlightedTech] = useState<string | null>(null)
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null)
  const [expandedValue, setExpandedValue] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  
  // Scroll position preservation for modal
  const scrollPositionRef = useRef<number>(0)
  const valueCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  
  // Tech stacks for the Tech Stack card
  const techStacks = ['React', 'TypeScript', 'Spring Boot', 'Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Azure']
  
  // Handle tech stack tag click - navigate to projects page with filter
  const handleTechStackClick = (tech: string, e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/projects?techStacks=${encodeURIComponent(tech)}`)
  }
  
  // Handle value card click - open modal
  const handleValueCardClick = (valueId: string, e: React.MouseEvent) => {
    e.preventDefault()
    scrollPositionRef.current = window.scrollY
    setSelectedValue(valueId)
    document.body.style.overflow = 'hidden'
  }
  
  // Handle modal close
  const handleModalClose = useCallback(() => {
    const currentValue = selectedValue
    setSelectedValue(null)
    document.body.style.overflow = ''
    // Restore scroll position
    window.scrollTo(0, scrollPositionRef.current)
    // Return focus to the card that triggered the modal
    setTimeout(() => {
      const cardElement = valueCardRefs.current[currentValue || '']
      if (cardElement) {
        cardElement.focus()
      }
    }, 100)
  }, [selectedValue])
  
  // Handle Esc key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedValue) {
        handleModalClose()
      }
    }
    
    if (selectedValue) {
      document.addEventListener('keydown', handleEscKey)
      return () => {
        document.removeEventListener('keydown', handleEscKey)
      }
    }
  }, [selectedValue, handleModalClose])
  
  // Refs for IntersectionObserver
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const backgroundRef = useRef<HTMLElement>(null)
  const missionRef = useRef<HTMLElement>(null)

  // IntersectionObserver for scroll animations (HomePage.tsx pattern)
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) setIsHeroVisible(true)
            if (entry.target === storyRef.current) setIsStoryVisible(true)
            if (entry.target === backgroundRef.current) setIsBackgroundVisible(true)
            if (entry.target === missionRef.current) setIsMissionVisible(true)
          }
        })
      },
      observerOptions
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (storyRef.current) observer.observe(storyRef.current)
    if (backgroundRef.current) observer.observe(backgroundRef.current)
    if (missionRef.current) observer.observe(missionRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (storyRef.current) observer.unobserve(storyRef.current)
      if (backgroundRef.current) observer.unobserve(backgroundRef.current)
      if (missionRef.current) observer.unobserve(missionRef.current)
    }
  }, [])

  return (
    <>
      {/* AboutHero Section - 독립적인 레이아웃 */}
      <S.AboutHero ref={heroRef} id="about-hero" $isDark={isDark} role="banner" aria-label={t('about.hero.headline', 'About Me')}>
        <Container>
          <S.AboutHeroContent>
            {/* 좌측: 프로필 이미지 (시각적 중심) */}
            <S.AboutHeroLeft>
              <S.ProfileImageWrapper>
                <S.ProfileImage 
                  src="/profile.jpg" 
                  alt={t('about.hero.name', 'Jungwook Van')}
                  loading="eager"
                  $isDark={isDark}
                  onError={(e) => {
                    // Fallback to placeholder avatar if image fails to load
                    const target = e.currentTarget
                    // Theme-aware placeholder: light gray for light mode, dark gray for dark mode
                    const bgColor = isDark ? '#1F2937' : '#F3F4F6'
                    const iconColor = isDark ? '#6B7280' : '#9CA3AF'
                    target.src = `data:image/svg+xml;base64,${btoa(`<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="320" fill="${bgColor}"/><path d="M160 160C173.255 160 184 149.255 184 136C184 122.745 173.255 112 160 112C146.745 112 136 122.745 136 136C136 149.255 146.745 160 160 160Z" fill="${iconColor}"/><path d="M160 176C133.431 176 112 189.431 112 208V224H208V208C208 189.431 186.569 176 160 176Z" fill="${iconColor}"/></svg>`)}`
                    target.style.background = 'transparent'
                  }}
                />
              </S.ProfileImageWrapper>
            </S.AboutHeroLeft>
            
            {/* 우측: 텍스트 콘텐츠 */}
            <S.AboutHeroRight>
              <S.AboutHeroGreeting>
                {t('about.hero.greeting', 'Hello, I am')} <S.AboutHeroName>{t('about.hero.name', 'Jungwook Van')}</S.AboutHeroName>
              </S.AboutHeroGreeting>
              <S.AboutHeroHeadline>{t('about.hero.headline', 'Full Stack Developer')}</S.AboutHeroHeadline>
              <S.AboutHeroSubtitle>{t('about.hero.subtitle', 'I enjoy solving problems and creating value through efficient and creative solutions. Specialized in web application development using React, TypeScript, and Spring Boot.')}</S.AboutHeroSubtitle>
              <S.AboutHeroCTAButtons>
                <S.AboutHeroPrimaryCTA to="/projects">{t('about.hero.cta.primary', 'View Projects')}</S.AboutHeroPrimaryCTA>
                <S.AboutHeroSecondaryCTA 
                  as="button"
                  onClick={(e) => {
                    e.preventDefault()
                    const triggerElement = e.currentTarget
                    useFeedbackModalStore.getState().openModal(triggerElement)
                  }}
                  aria-label={t('about.hero.cta.secondary', 'Contact Me')}
                >
                  {t('about.hero.cta.secondary', 'Contact Me')}
                </S.AboutHeroSecondaryCTA>
              </S.AboutHeroCTAButtons>
              <S.AboutHeroSocialLinks>
                <S.AboutHeroSocialLink 
                  href={CONTACT_INFO.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('hero.cta.linkedin', 'LinkedIn Profile')}
                >
                  LinkedIn
                </S.AboutHeroSocialLink>
                <S.AboutHeroSocialLink 
                  href={`mailto:${CONTACT_INFO.email.student}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('hero.cta.email', 'Send Email')}
                >
                  Email
                </S.AboutHeroSocialLink>
              </S.AboutHeroSocialLinks>
            </S.AboutHeroRight>
          </S.AboutHeroContent>
        </Container>
        <ScrollIndicator isVisible={isHeroVisible} />
      </S.AboutHero>

      {/* SectionBridge: Hero to Story */}
      <SectionBridge 
        text={t('storytelling.heroToStory', 'The journey of a developer who enjoys solving problems')}
        variant="primary"
        diagonal={true}
        overlap={true}
      />

      {/* Story Section */}
      <S.StorySection ref={storyRef} role="region" aria-labelledby="story-title" aria-describedby="story-subtitle">
        <Container>
          <S.JourneyGrid>
            <S.TextColumn>
              <S.SectionTitle id="story-title" $isVisible={isStoryVisible}>
                {t('about.story.title', 'My Story')}
              </S.SectionTitle>
              <SectionPurpose text={t('about.story.purpose', 'Introducing the journey as a developer and the motivation behind creating this portfolio.')} />
              <S.SectionSubtitle id="story-subtitle" $isVisible={isStoryVisible}>
                {t('about.story.subtitle', 'This story tells how a passion for coding grew into becoming a professional developer.')}
              </S.SectionSubtitle>
              <S.StoryContent>
                <p>{t('about.story.content.paragraph1', 'My journey as a developer started with a curiosity about how things work. From building simple websites to developing full-stack applications, each project has been a learning opportunity.')}</p>
                <p>{t('about.story.content.paragraph2', 'Currently studying in Australia, I have been able to work on diverse projects that combine creativity with technical expertise. The experience of serving as an interpreter in the military helped me develop strong communication skills and a global perspective.')}</p>
                <p>{t('about.story.content.paragraph3', 'I believe that great software is built not just with code, but with understanding user needs and creating solutions that make a real difference. This portfolio represents that philosophy.')}</p>
              </S.StoryContent>
            </S.TextColumn>
            <S.StoryVisualColumn>
              <S.StoryImage 
                src="/images/developer-story.jpg" 
                alt={t('about.story.imageAlt', 'Developer working on a project')}
                loading="lazy"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none'
                }}
              />
            </S.StoryVisualColumn>
          </S.JourneyGrid>
        </Container>
      </S.StorySection>

      {/* SectionBridge: Story to Background */}
      <SectionBridge 
        text={t('storytelling.storyToBackground', 'Background and expertise')}
        variant="secondary"
        diagonal={true}
      />

      {/* Background Section */}
      <S.BackgroundSection ref={backgroundRef} role="region" aria-labelledby="background-title" aria-describedby="background-subtitle">
        <Container>
          <S.SectionTitle id="background-title" $isVisible={isBackgroundVisible}>
            {t('about.background.title', 'Background & Skills')}
          </S.SectionTitle>
          <SectionPurpose text={t('about.background.purpose', 'Educational background, career, and core technology stack.')} />
          <S.SectionSubtitle id="background-subtitle" $isVisible={isBackgroundVisible}>
            {t('about.background.subtitle', 'A solid foundation built through education and practical experience.')}
          </S.SectionSubtitle>
          <S.BackgroundGrid>
            <S.BackgroundCard tabIndex={0} role="article" aria-labelledby="education-title">
              <S.CardIcon aria-hidden="true">
                <GraduationCapIcon />
              </S.CardIcon>
              <S.CardTitle id="education-title">{t('about.background.education.title', 'Education')}</S.CardTitle>
              <S.CardContent>{t('about.background.education.content', 'Computer Engineering at Jeonbuk National University, currently studying in Australia at UTS.')}</S.CardContent>
              <S.DetailLabel>{t('about.background.education.period', 'Period')}</S.DetailLabel>
              <S.DetailValue>{t('about.background.education.periodValue', '2018 - Present')}</S.DetailValue>
              <S.DetailLabel>{t('about.background.education.location', 'Location')}</S.DetailLabel>
              <S.DetailValue>{t('about.background.education.locationValue', 'Jeonbuk National University, UTS (Australia)')}</S.DetailValue>
            </S.BackgroundCard>
            <S.BackgroundCard tabIndex={0} role="article" aria-labelledby="experience-title">
              <S.CardIcon aria-hidden="true">
                <BriefcaseIcon />
              </S.CardIcon>
              <S.CardTitle id="experience-title">{t('about.background.experience.title', 'Experience')}</S.CardTitle>
              <S.CardContent>{t('about.background.experience.content', 'Served as an interpreter in the military, worked on various projects using React, TypeScript, and Spring Boot.')}</S.CardContent>
              <S.DetailLabel>{t('about.background.experience.period', 'Period')}</S.DetailLabel>
              <S.DetailValue>{t('about.background.experience.periodValue', '2020 - 2022')}</S.DetailValue>
              <S.DetailLabel>{t('about.background.experience.location', 'Location')}</S.DetailLabel>
              <S.DetailValue>{t('about.background.experience.locationValue', 'Military Service, Various Projects')}</S.DetailValue>
            </S.BackgroundCard>
            <S.BackgroundCard 
              tabIndex={0} 
              role="article" 
              aria-labelledby="techStack-title"
              $isHighlighted={highlightedTech !== null}
            >
              <S.CardIcon aria-hidden="true">
                <SettingsIcon />
              </S.CardIcon>
              <S.CardTitle id="techStack-title">{t('about.background.techStack.title', 'Tech Stack')}</S.CardTitle>
              <S.CardContent>{t('about.background.techStack.content', 'Core technologies and frameworks I use in my projects.')}</S.CardContent>
              <S.TechStackTags>
                {techStacks.map((tech) => (
                  <S.TechStackTag
                    key={tech}
                    href={`/projects?techStacks=${encodeURIComponent(tech)}`}
                    onClick={(e) => handleTechStackClick(tech, e)}
                    role="link"
                    aria-label={`View projects using ${tech}`}
                  >
                    {tech}
                  </S.TechStackTag>
                ))}
              </S.TechStackTags>
              <S.TechStackCTA
                href="/projects"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/projects')
                }}
                role="link"
                aria-label="View all projects"
              >
                {t('about.background.techStack.viewAll', 'View All Projects ➔')}
              </S.TechStackCTA>
            </S.BackgroundCard>
          </S.BackgroundGrid>
        </Container>
      </S.BackgroundSection>

      {/* SectionBridge: Background to Journey */}
      <SectionBridge 
        text={t('storytelling.backgroundToJourney', 'Explore the growth process')}
        variant="secondary"
        diagonal={true}
      />

      {/* JourneyMilestoneSection (100% reuse) - Career Timeline */}
      <div id="journey" role="region" aria-label={t('journey.title', 'Career Timeline')}>
        <JourneyMilestoneSection />
      </div>

      {/* SectionBridge: Journey to Mission */}
      <SectionBridge 
        text={t('storytelling.journeyToMission', 'Mission and vision')}
        variant="secondary"
        diagonal={true}
      />

      {/* Mission & Vision Section */}
      <S.MissionVisionSection ref={missionRef} role="region" aria-labelledby="mission-title" aria-describedby="mission-subtitle">
        <Container>
          <S.SectionTitle id="mission-title" $isVisible={isMissionVisible}>
            {t('about.mission.title', 'Mission & Vision')}
          </S.SectionTitle>
          <SectionPurpose text={t('about.mission.purpose', 'Sharing the mission and technical vision as a developer.')} />
          <S.SectionSubtitle id="mission-subtitle" $isVisible={isMissionVisible}>
            {t('about.mission.subtitle', 'The values and principles that guide my work.')}
          </S.SectionSubtitle>
          <S.ValuesGrid>
            <S.ValueCard 
              ref={(el) => { valueCardRefs.current['innovation'] = el }}
              tabIndex={0} 
              role="button"
              aria-labelledby="innovation-title"
              aria-describedby="innovation-description"
              $isHighlighted={highlightedValue === 'innovation'}
              onClick={(e) => handleValueCardClick('innovation', e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleValueCardClick('innovation', e)
                }
              }}
            >
              <S.ValueIconContainer>
                <InnovationIcon size={48} />
              </S.ValueIconContainer>
              <S.CardTitle id="innovation-title">{t('about.mission.values.innovation.title', 'Innovation')}</S.CardTitle>
              <S.CardContent id="innovation-description">{t('about.mission.values.innovation.description', 'Creating innovative solutions using the latest technologies.')}</S.CardContent>
              <S.ValueCardHoverIndicator aria-hidden="true">
                <S.HoverIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </S.HoverIcon>
              </S.ValueCardHoverIndicator>
            </S.ValueCard>
            <S.ValueCard 
              ref={(el) => { valueCardRefs.current['collaboration'] = el }}
              tabIndex={0} 
              role="button"
              aria-labelledby="collaboration-title"
              aria-describedby="collaboration-description"
              $isHighlighted={highlightedValue === 'collaboration'}
              onClick={(e) => handleValueCardClick('collaboration', e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleValueCardClick('collaboration', e)
                }
              }}
            >
              <S.ValueIconContainer>
                <CollaborationIcon size={48} />
              </S.ValueIconContainer>
              <S.CardTitle id="collaboration-title">{t('about.mission.values.collaboration.title', 'Collaboration')}</S.CardTitle>
              <S.CardContent id="collaboration-description">{t('about.mission.values.collaboration.description', 'Working with teams to create better results.')}</S.CardContent>
              <S.ValueCardHoverIndicator aria-hidden="true">
                <S.HoverIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </S.HoverIcon>
              </S.ValueCardHoverIndicator>
            </S.ValueCard>
            <S.ValueCard 
              ref={(el) => { valueCardRefs.current['growth'] = el }}
              tabIndex={0} 
              role="button"
              aria-labelledby="growth-title"
              aria-describedby="growth-description"
              $isHighlighted={highlightedValue === 'growth'}
              onClick={(e) => handleValueCardClick('growth', e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleValueCardClick('growth', e)
                }
              }}
            >
              <S.ValueIconContainer>
                <GrowthIcon size={48} />
              </S.ValueIconContainer>
              <S.CardTitle id="growth-title">{t('about.mission.values.growth.title', 'Continuous Growth')}</S.CardTitle>
              <S.CardContent id="growth-description">{t('about.mission.values.growth.description', 'Continuously learning and growing to improve expertise.')}</S.CardContent>
              <S.ValueCardHoverIndicator aria-hidden="true">
                <S.HoverIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </S.HoverIcon>
              </S.ValueCardHoverIndicator>
            </S.ValueCard>
          </S.ValuesGrid>
          
          {/* Value Modal Overlay */}
          {selectedValue && (
            <S.ValueModalOverlay
              onClick={handleModalClose}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${selectedValue}-modal-title`}
            >
              <S.ValueModalContent
                onClick={(e) => e.stopPropagation()}
                role="document"
              >
                <S.ValueModalCloseButton
                  onClick={handleModalClose}
                  aria-label={t('about.mission.modal.close', 'Close modal')}
                >
                  <S.CloseIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </S.CloseIcon>
                </S.ValueModalCloseButton>
                <S.ValueModalIconContainer>
                  {selectedValue === 'innovation' && <InnovationIcon size={80} highlighted />}
                  {selectedValue === 'collaboration' && <CollaborationIcon size={80} highlighted />}
                  {selectedValue === 'growth' && <GrowthIcon size={80} highlighted />}
                </S.ValueModalIconContainer>
                <S.ValueModalTitle id={`${selectedValue}-modal-title`}>
                  {selectedValue === 'innovation' && t('about.mission.values.innovation.title', 'Innovation')}
                  {selectedValue === 'collaboration' && t('about.mission.values.collaboration.title', 'Collaboration')}
                  {selectedValue === 'growth' && t('about.mission.values.growth.title', 'Continuous Growth')}
                </S.ValueModalTitle>
                <S.ValueModalDescription>
                  {selectedValue === 'innovation' && t('about.mission.values.innovation.description', 'Creating innovative solutions using the latest technologies.')}
                  {selectedValue === 'collaboration' && t('about.mission.values.collaboration.description', 'Working with teams to create better results.')}
                  {selectedValue === 'growth' && t('about.mission.values.growth.description', 'Continuously learning and growing to improve expertise.')}
                </S.ValueModalDescription>
                <S.ValueModalDetail>
                  {selectedValue === 'innovation' && t('about.mission.values.innovation.detail', 'I actively explore cutting-edge technologies and frameworks to solve complex problems. This includes experimenting with new patterns, optimizing performance, and building scalable architectures that stand the test of time.')}
                  {selectedValue === 'collaboration' && t('about.mission.values.collaboration.detail', 'I believe that the best solutions emerge from diverse perspectives. Through effective communication, code reviews, pair programming, and knowledge sharing, I contribute to building stronger teams and better products.')}
                  {selectedValue === 'growth' && t('about.mission.values.growth.detail', 'Learning is a lifelong journey. I regularly engage with technical communities, contribute to open-source projects, attend conferences, and take on challenging projects that push me beyond my comfort zone.')}
                </S.ValueModalDetail>
              </S.ValueModalContent>
            </S.ValueModalOverlay>
          )}
          <S.MissionVisionTextContainer $isVisible={isMissionVisible}>
            <S.MissionText $isVisible={isMissionVisible}>
              <S.MissionLabel>{t('about.mission.missionLabel', 'Mission')}</S.MissionLabel>
              {t('about.mission.missionText', 'The goal is to create user-centered services that provide real value.')}
            </S.MissionText>
            <S.MissionText $isVisible={isMissionVisible}>
              <S.MissionLabel>{t('about.mission.visionLabel', 'Vision')}</S.MissionLabel>
              {t('about.mission.visionText', 'I aim to always learn and apply new technologies to become a better developer.')}
            </S.MissionText>
          </S.MissionVisionTextContainer>
        </Container>
      </S.MissionVisionSection>

      {/* SectionBridge: Mission to Contact */}
      <SectionBridge 
        text={t('storytelling.missionToContact', 'Want to work together?')}
        variant="primary"
        diagonal={true}
      />

      {/* Contact Section */}
      <S.ContactSection role="region" aria-labelledby="contact-title" aria-label={t('about.contact.title', 'Contact Information')}>
    <Container>
          <S.ContactTitle id="contact-title">{t('about.contact.title', 'Contact')}</S.ContactTitle>
          
          <S.ContactClosingMessage>
            {t('about.contact.closingMessage', 'Ready to build something great?')}
          </S.ContactClosingMessage>
          
          <S.ContactInfo>
            <S.ContactItem tabIndex={0}>
              <S.ContactLabel>{t('about.contact.email', 'Email')}:</S.ContactLabel>
              <S.ContactValue 
                href={`mailto:${CONTACT_INFO.email.student}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('about.contact.email', 'Email')}
              >
                {CONTACT_INFO.email.display}
              </S.ContactValue>
            </S.ContactItem>
            
            <S.ContactItem tabIndex={0}>
              <S.ContactLabel>{t('about.contact.linkedin', 'LinkedIn')}:</S.ContactLabel>
              <S.ContactValue 
                href={CONTACT_INFO.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('about.contact.linkedin', 'LinkedIn Profile')}
              >
                {CONTACT_INFO.linkedin.display}
              </S.ContactValue>
            </S.ContactItem>
          </S.ContactInfo>

          <S.ContactButtons>
            <S.ContactButton 
              href={`mailto:${CONTACT_INFO.email.student}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('about.contact.sendEmail', 'Send Email')}
            >
              {t('about.contact.sendEmail', 'Send Email')}
            </S.ContactButton>
            
            <S.ContactButton 
              href={CONTACT_INFO.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('about.contact.connectLinkedIn', 'Connect on LinkedIn')}
            >
              {t('about.contact.connectLinkedIn', 'Connect on LinkedIn')}
            </S.ContactButton>
          </S.ContactButtons>
    </Container>
      </S.ContactSection>
      
      {/* Tech Stack Modal */}
      {selectedTechStack && (
        <TechStackModal
          techStack={selectedTechStack}
          onClose={() => setSelectedTechStack(null)}
        />
      )}
    </>
  )
}
