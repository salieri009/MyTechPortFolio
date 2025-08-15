import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

const LoginButton = styled.button`
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #3367d6;
  }

  &:disabled {
    background: #ccc;
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
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`

const ErrorMessage = styled.div`
  color: #dc3545;
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
  border-radius: 4px;
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
  border-radius: 4px;
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
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
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

  useEffect(() => {
    initializeGoogleSignIn()
  }, [])

  const initializeGoogleSignIn = async () => {
    try {
      console.log('=== 환경변수 확인 ===')
      console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
      console.log('NODE_ENV:', import.meta.env.MODE)
      console.log('DEV:', import.meta.env.DEV)
      console.log('==================')
      
      await authService.initializeGoogleSignIn()
      
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
          callback: handleGoogleResponse,
          auto_select: false,
        })

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'medium',
          text: 'signin_with',
          shape: 'rectangular',
        })
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error)
      setError('Failed to initialize Google Sign-In')
    }
  }

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
      setUser(authResponse.userInfo)
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

  const handleTwoFactorSubmit = async () => {
    if (!pendingCredential || !twoFactorCode) {
      setError('Please enter the 2FA code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const authResponse = await authService.loginWithGoogle(pendingCredential, twoFactorCode)
      
      setUser(authResponse.userInfo)
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
        <Avatar src={user.pictureUrl || '/default-avatar.png'} alt={user.name} />
        <UserInfo>
          <UserName>{user.name}</UserName>
          {user.isAdmin && <AdminBadge>Admin</AdminBadge>}
        </UserInfo>
        <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          ▼
        </DropdownButton>
        <Dropdown isOpen={isDropdownOpen}>
          <DropdownItem onClick={() => setIsDropdownOpen(false)}>
            Profile
          </DropdownItem>
          {user.isAdmin && (
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
