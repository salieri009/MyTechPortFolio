import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

const GITHUB_CLIENT_ID = import.meta.env?.VITE_GITHUB_CLIENT_ID || ''

const GitHubButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px 24px;
  background: #24292e;
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.lg};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    background: #1b1f23;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${props => props.theme.colors.neutral[400]};
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const GitHubIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: currentColor;
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`

const TwoFactorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

const TwoFactorInput = styled.input`
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  font-size: 14px;
  text-align: center;
  letter-spacing: 4px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const CancelButton = styled.button`
  flex: 1;
  padding: 10px;
  background: ${props => props.theme.colors.neutral[100]};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.colors.neutral[200]};
  }
`

const VerifyButton = styled.button`
  flex: 1;
  padding: 10px;
  background: #24292e;
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.md};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #1b1f23;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

interface GitHubLoginProps {
    onSuccess?: () => void
    onError?: (error: string) => void
}

export function GitHubLoginButton({ onSuccess, onError }: GitHubLoginProps) {
    const { setUser, setTokens, setLoading, setError, isLoading, error } = useAuthStore()
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
    const [twoFactorCode, setTwoFactorCode] = useState('')
    const [pendingAccessToken, setPendingAccessToken] = useState<string | null>(null)

    /**
     * Initiate GitHub OAuth flow
     * Opens a popup window for GitHub authorization
     */
    const handleGitHubLogin = async () => {
        if (!GITHUB_CLIENT_ID) {
            const errorMsg = 'GitHub Client ID is not configured'
            setError(errorMsg)
            onError?.(errorMsg)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Generate state for CSRF protection
            const state = Math.random().toString(36).substring(2, 15)
            sessionStorage.setItem('github_oauth_state', state)

            // Build GitHub OAuth URL
            const redirectUri = `${window.location.origin}/auth/github/callback`
            const scope = 'user:email read:user'

            const authUrl = `https://github.com/login/oauth/authorize?` +
                `client_id=${GITHUB_CLIENT_ID}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `scope=${encodeURIComponent(scope)}&` +
                `state=${state}`

            // Open popup for OAuth flow
            const popup = window.open(
                authUrl,
                'GitHub Login',
                'width=500,height=700,left=100,top=100'
            )

            // Listen for callback message from popup
            const handleMessage = async (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return
                if (event.data.type !== 'github-oauth-callback') return

                window.removeEventListener('message', handleMessage)
                popup?.close()

                const { code, state: returnedState, error: oauthError } = event.data

                if (oauthError) {
                    setLoading(false)
                    const errorMsg = `GitHub OAuth error: ${oauthError}`
                    setError(errorMsg)
                    onError?.(errorMsg)
                    return
                }

                // Verify state for CSRF protection
                const savedState = sessionStorage.getItem('github_oauth_state')
                if (returnedState !== savedState) {
                    setLoading(false)
                    const errorMsg = 'OAuth state mismatch - possible CSRF attack'
                    setError(errorMsg)
                    onError?.(errorMsg)
                    return
                }
                sessionStorage.removeItem('github_oauth_state')

                try {
                    // Exchange code for access token via backend
                    const authResponse = await authService.loginWithGitHub(code, twoFactorCode || undefined)

                    if (authResponse.requiresTwoFactor) {
                        setRequiresTwoFactor(true)
                        setPendingAccessToken(code)
                        setLoading(false)
                        return
                    }

                    // Success - store user data and tokens
                    if (authResponse.userInfo) {
                        setUser(authResponse.userInfo)
                    }
                    setTokens(authResponse.accessToken, authResponse.refreshToken)
                    onSuccess?.()
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : 'GitHub authentication failed'
                    setError(errorMsg)
                    onError?.(errorMsg)
                } finally {
                    setLoading(false)
                }
            }

            window.addEventListener('message', handleMessage)

            // Handle popup close without completing OAuth
            const checkPopup = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkPopup)
                    setLoading(false)
                }
            }, 500)

        } catch (err) {
            setLoading(false)
            const errorMsg = err instanceof Error ? err.message : 'Failed to start GitHub login'
            setError(errorMsg)
            onError?.(errorMsg)
        }
    }

    /**
     * Handle 2FA verification
     */
    const handleTwoFactorSubmit = async () => {
        if (!pendingAccessToken || !twoFactorCode) {
            setError('Please enter the 2FA code')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const authResponse = await authService.loginWithGitHub(pendingAccessToken, twoFactorCode)

            if (authResponse.userInfo) {
                setUser(authResponse.userInfo)
            }
            setTokens(authResponse.accessToken, authResponse.refreshToken)
            setRequiresTwoFactor(false)
            setPendingAccessToken(null)
            setTwoFactorCode('')
            onSuccess?.()
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : '2FA verification failed'
            setError(errorMsg)
            onError?.(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    // Render 2FA input if required
    if (requiresTwoFactor) {
        return (
            <TwoFactorContainer>
                <TwoFactorInput
                    type="text"
                    placeholder="Enter 2FA code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    autoFocus
                />
                <ButtonGroup>
                    <CancelButton
                        onClick={() => {
                            setRequiresTwoFactor(false)
                            setPendingAccessToken(null)
                            setTwoFactorCode('')
                            setError(null)
                        }}
                    >
                        Cancel
                    </CancelButton>
                    <VerifyButton
                        onClick={handleTwoFactorSubmit}
                        disabled={isLoading || twoFactorCode.length !== 6}
                    >
                        {isLoading ? <LoadingSpinner /> : 'Verify'}
                    </VerifyButton>
                </ButtonGroup>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </TwoFactorContainer>
        )
    }

    return (
        <>
            <GitHubButton onClick={handleGitHubLogin} disabled={isLoading}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <GitHubIcon viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </GitHubIcon>
                        Sign in with GitHub
                    </>
                )}
            </GitHubButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
    )
}
