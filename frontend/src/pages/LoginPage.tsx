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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`

const LogoSection = styled.div`
  margin-bottom: 32px;
`

const Logo = styled.h1`
  font-size: 28px;
  color: #2d3748;
  margin: 0 0 8px 0;
  font-weight: 700;
`

const Subtitle = styled.p`
  color: #718096;
  margin: 0;
  font-size: 16px;
`

const SecurityNotice = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  text-align: left;
`

const SecurityTitle = styled.h3`
  font-size: 14px;
  color: #2d3748;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🔒';
    font-size: 16px;
  }
`

const SecurityList = styled.ul`
  margin: 0;
  padding-left: 16px;
  color: #4a5568;
  font-size: 13px;
  line-height: 1.5;
`

const SecurityItem = styled.li`
  margin-bottom: 4px;
`

const Footer = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  color: #718096;
  font-size: 12px;
  line-height: 1.4;
`

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 14px;
  text-align: left;
`

const LoadingSpinner = styled.div`
  border: 2px solid #e2e8f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const TwoFactorSection = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
`

const TwoFactorTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #2d3748;
  font-size: 16px;
`

const TokenInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
  letter-spacing: 0.2em;
  font-family: 'Courier New', monospace;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const VerifyButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #5a67d8;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
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
