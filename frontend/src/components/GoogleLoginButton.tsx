import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

const LoginButton = styled.button`
  background: ${props => props.theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.lg};
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary[600]};
  }

  &:disabled {
    background: ${props => props.theme.colors.neutral[400]};
    cursor: not-allowed;
  }
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.border};
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

const AdminBadge = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.primary[500]};
  font-weight: 500;
`

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
`

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.md || '0 4px 12px rgba(0, 0, 0, 0.1)'};
  z-index: 1000;
  min-width: 200px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &:first-child {
    border-radius: ${props => props.theme.radius.lg} ${props => props.theme.radius.lg} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${props => props.theme.radius.lg} ${props => props.theme.radius.lg};
  }
`

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
`

const TwoFactorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`

const TwoFactorInput = styled.input`
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  width: 120px;
  font-size: 14px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const CancelButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.colors.border};
  }
`

const GoogleButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const GoogleButtonWrapper = styled.div`
  min-height: 40px;
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.theme.colors.neutral[300] || 'rgba(255, 255, 255, 0.25)'};
  border-top: 2px solid ${props => props.theme.colors.neutral[50] || 'rgba(255, 255, 255, 1)'};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

interface GoogleLoginProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginProps) {
  const { user, isAuthenticated, isLoading, error, setUser, setTokens, clearAuth, setLoading, setError } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [pendingCredential, setPendingCredential] = useState<string | null>(null)
  const googleButtonRef = useRef<HTMLDivElement>(null)

  // Memoized callback to prevent stale closures
  const handleGoogleResponseRef = useRef<(response: any) => Promise<void>>()

  useEffect(() => {
    let mounted = true

    const initializeGoogleSignIn = async () => {
      try {
        // Debug logs only in development
        if (import.meta.env.DEV) {
          console.log('=== Environment Check ===')
          console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
          console.log('MODE:', import.meta.env.MODE)
          console.log('========================')
        }

        await authService.initializeGoogleSignIn()

        // Check if component is still mounted before updating state
        if (!mounted || !googleButtonRef.current) return

        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
            callback: (response: any) => handleGoogleResponseRef.current?.(response),
            auto_select: false,
          })

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'medium',
            text: 'signin_with',
            shape: 'rectangular',
          })
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to initialize Google Sign-In:', err)
          setError('Failed to initialize Google Sign-In')
        }
      }
    }

    initializeGoogleSignIn()

    // Cleanup function to prevent memory leaks
    return () => {
      mounted = false
    }
  }, [setError])

  // Keep the ref in sync with the latest handler
  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) {
      setError('No credential received from Google')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const authResponse = await authService.loginWithGoogle(response.credential, twoFactorCode)

      if (authResponse.requiresTwoFactor) {
        setRequiresTwoFactor(true)
        setPendingCredential(response.credential)
        setLoading(false)
        return
      }

      // Success - store user data and tokens
      if (authResponse.userInfo) {
        setUser(authResponse.userInfo)
      }
      setTokens(authResponse.accessToken, authResponse.refreshToken)
      setRequiresTwoFactor(false)
      setPendingCredential(null)
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Keep the ref synchronized with the latest handler
  useEffect(() => {
    handleGoogleResponseRef.current = handleGoogleResponse
  })

  const handleTwoFactorSubmit = async () => {
    if (!pendingCredential || !twoFactorCode) {
      setError('Please enter the 2FA code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const authResponse = await authService.loginWithGoogle(pendingCredential, twoFactorCode)

      if (authResponse.userInfo) {
        setUser(authResponse.userInfo)
      }
      setTokens(authResponse.accessToken, authResponse.refreshToken)
      setRequiresTwoFactor(false)
      setPendingCredential(null)
      setTwoFactorCode('')
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '2FA verification failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      clearAuth()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (requiresTwoFactor) {
    return (
      <TwoFactorContainer>
        <TwoFactorInput
          type="text"
          placeholder="Enter 2FA code"
          value={twoFactorCode}
          onChange={(e) => setTwoFactorCode(e.target.value)}
          maxLength={6}
        />
        <ButtonGroup>
          <CancelButton
            onClick={() => {
              setRequiresTwoFactor(false)
              setPendingCredential(null)
              setTwoFactorCode('')
            }}
          >
            Cancel
          </CancelButton>
          <LoginButton onClick={handleTwoFactorSubmit} disabled={isLoading || !twoFactorCode}>
            {isLoading ? <LoadingSpinner /> : 'Verify'}
          </LoginButton>
        </ButtonGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </TwoFactorContainer>
    )
  }

  if (isAuthenticated && user) {
    return (
      <UserProfile>
        <Avatar src={user.profileImageUrl || '/default-avatar.png'} alt={user.displayName} />
        <UserInfo>
          <UserName>{user.displayName}</UserName>
          {user.role === 'ADMIN' && <AdminBadge>Admin</AdminBadge>}
        </UserInfo>
        <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          ▼
        </DropdownButton>
        <Dropdown isOpen={isDropdownOpen}>
          <DropdownItem onClick={() => setIsDropdownOpen(false)}>
            Profile
          </DropdownItem>
          {user.role === 'ADMIN' && (
            <DropdownItem onClick={() => setIsDropdownOpen(false)}>
              Admin Panel
            </DropdownItem>
          )}
          <DropdownItem onClick={handleLogout}>
            {isLoading ? 'Logging out...' : 'Logout'}
          </DropdownItem>
        </Dropdown>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </UserProfile>
    )
  }

  return (
    <GoogleButtonContainer>
      <GoogleButtonWrapper ref={googleButtonRef}>
        {/* Google Sign-In button will be rendered here */}
      </GoogleButtonWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </GoogleButtonContainer>
  )
}
