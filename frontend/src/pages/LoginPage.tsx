import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { useAuthStore } from '../store/authStore'
import { securityMonitor } from '../services/securityMonitor'

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[500]} 0%, ${props => props.theme.colors.primary[600]} 100%);
  padding: ${props => props.theme.spacing[5]}; /* 4-point system: 20px */
`

const LoginCard = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows['2xl']};
  padding: ${props => props.theme.spacing[10]}; /* 4-point system: 40px */
  width: 100%;
  max-width: ${props => props.theme.spacing[105]}; /* 4-point system: 420px */
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
    background: linear-gradient(90deg, ${props => props.theme.colors.primary[500]}, ${props => props.theme.colors.primary[600]});
  }
`

const LogoSection = styled.div`
  margin-bottom: ${props => props.theme.spacing[8]}; /* 4-point system: 32px */
`

const Logo = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const SecurityNotice = styled.div`
  background: ${props => props.theme.colors.neutral[50]};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  padding: ${props => props.theme.spacing[4]};
  margin: ${props => props.theme.spacing[6]} 0;
  text-align: left;
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[800]};
    border-color: ${props.theme.colors.neutral[700]};
  `}
`

const SecurityTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`

const SecurityList = styled.ul`
  margin: 0;
  padding-left: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const SecurityItem = styled.li`
  margin-bottom: ${props => props.theme.spacing[1]}; /* 4-point system: 4px */
`

const Footer = styled.div`
  margin-top: ${props => props.theme.spacing[8]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  line-height: ${props => props.theme.typography.lineHeight.normal};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}15;
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.radius.md};
  margin: ${props => props.theme.spacing[4]} 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: left;
  border: 1px solid ${props => props.theme.colors.error}40;
  font-family: ${props => props.theme.typography.fontFamily.primary};
`

const LoadingSpinner = styled.div`
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  width: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  height: ${props => props.theme.spacing[6]}; /* 4-point system: 24px */
  animation: spin 1s linear infinite;
  margin: ${props => props.theme.spacing[6]} auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const TwoFactorSection = styled.div`
  margin-top: ${props => props.theme.spacing[6]};
  padding: ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.neutral[50]};
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid ${props => props.theme.colors.border};
  
  ${props => props.theme.mode === 'dark' && `
    background: ${props.theme.colors.neutral[800]};
    border-color: ${props.theme.colors.neutral[700]};
  `}
`

const TwoFactorTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`

const TokenInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  text-align: center;
  letter-spacing: 0.2em;
  font-family: ${props => props.theme.typography.fontFamily.primary};
  margin-bottom: ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[500]}20;
  }
`

const VerifyButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  /* H1: Visibility of System Status - Hover feedback */
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary[600]};
    transform: translateY(-${props => props.theme.spacing[0.5]}); /* 4-point system: 4px */
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  /* H3: User Control & Freedom - Focus state */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary[500]};
    outline-offset: ${props => props.theme.spacing[1]};
  }

  &:active:not(:disabled) {
    background: ${props => props.theme.colors.primary[700]};
    transform: translateY(0);
  }

  &:disabled {
    background: ${props => props.theme.colors.neutral[300]};
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }
`

export function LoginPage() {
  const navigate = useNavigate()
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    user,
    twoFactorRequired,
    verifyTwoFactor,
    clearError
  } = useAuthStore()
  
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    // Initialize security monitoring
    securityMonitor.init()
    
    // Check if already authenticated
    if (isAuthenticated && user) {
      navigate('/', { replace: true })
    }

    // Clear any previous errors
    clearError()

    // Log login page access
    securityMonitor.reportCustomEvent('login_page_access', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    })
  }, [isAuthenticated, user, navigate, clearError])

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!twoFactorToken || twoFactorToken.length !== 6) {
      return
    }

    setIsVerifying(true)
    
    try {
      await verifyTwoFactor(twoFactorToken)
      // Navigation will happen automatically via useEffect
    } catch (error) {
      securityMonitor.reportCustomEvent('2fa_verification_failed', {
        timestamp: Date.now(),
        token_length: twoFactorToken.length
      })
    } finally {
      setIsVerifying(false)
      setTwoFactorToken('')
    }
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setTwoFactorToken(value)
  }

  if (twoFactorRequired) {
    return (
      <LoginContainer>
        <LoginCard>
          <LogoSection>
            <Logo>Two-Factor Authentication</Logo>
            <Subtitle>Enter your 6-digit code from Google Authenticator</Subtitle>
          </LogoSection>

          <TwoFactorSection>
            <TwoFactorTitle>🔐 Verification Code</TwoFactorTitle>
            <form onSubmit={handleTwoFactorSubmit}>
              <TokenInput
                type="text"
                value={twoFactorToken}
                onChange={handleTokenChange}
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
              />
              <VerifyButton 
                type="submit" 
                disabled={twoFactorToken.length !== 6 || isVerifying}
              >
                {isVerifying ? <LoadingSpinner /> : 'Verify Code'}
              </VerifyButton>
            </form>
          </TwoFactorSection>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <Footer>
            If you don't have access to your authenticator app, please contact support.
          </Footer>
        </LoginCard>
      </LoginContainer>
    )
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <Logo>MyTech Portfolio</Logo>
          <Subtitle>Secure Admin Access</Subtitle>
        </LogoSection>

        <SecurityNotice>
          <SecurityTitle>Security Features</SecurityTitle>
          <SecurityList>
            <SecurityItem>Google OAuth 2.0 authentication</SecurityItem>
            <SecurityItem>Two-factor authentication (2FA)</SecurityItem>
            <SecurityItem>Role-based access control</SecurityItem>
            <SecurityItem>Session security monitoring</SecurityItem>
          </SecurityList>
        </SecurityNotice>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <GoogleLoginButton />
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Footer>
          This is a secure admin portal. Only authorized users with admin privileges 
          can access blog management features. All login attempts are monitored and logged.
        </Footer>
      </LoginCard>
    </LoginContainer>
  )
}
