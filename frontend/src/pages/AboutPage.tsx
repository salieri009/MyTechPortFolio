import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@components/common'
import { JourneyMilestoneSection } from '@components/sections/JourneyMilestoneSection'
import { SectionBridge } from '@components/sections/SectionBridge'
import { SectionPurpose } from '@components/sections/SectionPurpose'
import { InteractiveBackground } from '@components/organisms/InteractiveBackground/InteractiveBackground'
import { useThemeStore } from '../stores/themeStore'
import { CONTACT_INFO } from '../constants/contact'
import * as S from './AboutPage.styles'
import * as HomePageStyles from './HomePage.styles'

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
  
  // Scroll animation states
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const [isStoryVisible, setIsStoryVisible] = useState(false)
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false)
  const [isMissionVisible, setIsMissionVisible] = useState(false)
  
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
      {/* AboutHero Section */}
      <S.AboutHero ref={heroRef} id="about-hero" $isDark={isDark} role="banner" aria-label={t('about.hero.headline', 'About Me')}>
        <InteractiveBackground isDark={isDark} particleCount={120} connectionDistance={180} />
        <Container>
          <HomePageStyles.HeroContent>
            <HomePageStyles.HeroLeft>
              <HomePageStyles.Greeting>
                {t('about.hero.greeting', 'Hello, I am')} <HomePageStyles.Name>{t('about.hero.name', 'Jungwook Van')}</HomePageStyles.Name>
              </HomePageStyles.Greeting>
              <HomePageStyles.Headline>{t('about.hero.headline', 'Full Stack Developer')}</HomePageStyles.Headline>
              <HomePageStyles.Subtitle>{t('about.hero.subtitle', 'I enjoy solving problems and creating value through efficient and creative solutions. Specialized in web application development using React, TypeScript, and Spring Boot.')}</HomePageStyles.Subtitle>
              <HomePageStyles.CTAButtons>
                <HomePageStyles.PrimaryCTA to="/projects">{t('about.hero.cta.primary', 'View Projects')}</HomePageStyles.PrimaryCTA>
                <HomePageStyles.SecondaryCTA to="/feedback">{t('about.hero.cta.secondary', 'Contact Me')}</HomePageStyles.SecondaryCTA>
              </HomePageStyles.CTAButtons>
            </HomePageStyles.HeroLeft>
            <HomePageStyles.HeroRight>
              <S.ProfileImageWrapper>
                <S.ProfileImage 
                  src="/profile.jpg" 
                  alt={t('about.hero.name', 'Jungwook Van')}
                  loading="eager"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </S.ProfileImageWrapper>
              <HomePageStyles.SocialLinks>
                <HomePageStyles.SocialLink 
                  href={CONTACT_INFO.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('hero.cta.linkedin', 'LinkedIn Profile')}
                >
                  LinkedIn
                </HomePageStyles.SocialLink>
                <HomePageStyles.SocialLink 
                  href={`mailto:${CONTACT_INFO.email.student}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('hero.cta.email', 'Send Email')}
                >
                  Email
                </HomePageStyles.SocialLink>
              </HomePageStyles.SocialLinks>
            </HomePageStyles.HeroRight>
          </HomePageStyles.HeroContent>
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
                {t('about.story.title', 'My Journey')}
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
              <S.CardTitle id="education-title">{t('about.background.education.title', 'Education')}</S.CardTitle>
              <S.CardContent>{t('about.background.education.content', 'Computer Engineering at Jeonbuk National University, currently studying in Australia at UTS.')}</S.CardContent>
            </S.BackgroundCard>
            <S.BackgroundCard tabIndex={0} role="article" aria-labelledby="experience-title">
              <S.CardTitle id="experience-title">{t('about.background.experience.title', 'Experience')}</S.CardTitle>
              <S.CardContent>{t('about.background.experience.content', 'Served as an interpreter in the military, worked on various projects using React, TypeScript, and Spring Boot.')}</S.CardContent>
            </S.BackgroundCard>
            <S.BackgroundCard tabIndex={0} role="article" aria-labelledby="techStack-title">
              <S.CardTitle id="techStack-title">{t('about.background.techStack.title', 'Tech Stack')}</S.CardTitle>
              <S.CardContent>{t('about.background.techStack.content', 'React, TypeScript, Spring Boot, Node.js, MongoDB, and more.')}</S.CardContent>
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

      {/* JourneyMilestoneSection (100% reuse) */}
      <div id="journey" role="region" aria-label={t('journey.title', 'My Journey')}>
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
            <S.ValueCard tabIndex={0} role="article" aria-labelledby="innovation-title">
              <S.ValueIcon>💡</S.ValueIcon>
              <S.CardTitle id="innovation-title">{t('about.mission.values.innovation.title', 'Innovation')}</S.CardTitle>
              <S.CardContent>{t('about.mission.values.innovation.description', 'Creating innovative solutions using the latest technologies.')}</S.CardContent>
            </S.ValueCard>
            <S.ValueCard tabIndex={0} role="article" aria-labelledby="collaboration-title">
              <S.ValueIcon>🤝</S.ValueIcon>
              <S.CardTitle id="collaboration-title">{t('about.mission.values.collaboration.title', 'Collaboration')}</S.CardTitle>
              <S.CardContent>{t('about.mission.values.collaboration.description', 'Working with teams to create better results.')}</S.CardContent>
            </S.ValueCard>
            <S.ValueCard tabIndex={0} role="article" aria-labelledby="growth-title">
              <S.ValueIcon>📈</S.ValueIcon>
              <S.CardTitle id="growth-title">{t('about.mission.values.growth.title', 'Continuous Growth')}</S.CardTitle>
              <S.CardContent>{t('about.mission.values.growth.description', 'Continuously learning and growing to improve expertise.')}</S.CardContent>
            </S.ValueCard>
          </S.ValuesGrid>
          <S.MissionText>{t('about.mission.missionText', 'The goal is to create user-centered services that provide real value.')}</S.MissionText>
          <S.MissionText>{t('about.mission.visionText', 'I aim to always learn and apply new technologies to become a better developer.')}</S.MissionText>
          <HomePageStyles.CTAButtons style={{ marginTop: '0' }}>
            <HomePageStyles.PrimaryCTA to="/feedback">{t('about.mission.cta', "Let's Connect")}</HomePageStyles.PrimaryCTA>
          </HomePageStyles.CTAButtons>
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
    </>
  )
}
