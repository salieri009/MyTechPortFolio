import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

const CallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
`

const LoadingCard = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing[8]};
  text-align: center;
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto ${props => props.theme.spacing[4]};

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const Message = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`

/**
 * GitHub OAuth Callback Handler
 * 
 * This page receives the OAuth callback from GitHub after user authorization.
 * It extracts the authorization code and state, then sends them to the parent
 * window (the login page popup opener) for processing.
 */
export function GitHubCallbackPage() {
    const [searchParams] = useSearchParams()

    useEffect(() => {
        // Extract callback parameters
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Send message to parent window (popup opener)
        if (window.opener) {
            window.opener.postMessage(
                {
                    type: 'github-oauth-callback',
                    code,
                    state,
                    error: error || undefined,
                    errorDescription: errorDescription || undefined
                },
                window.location.origin
            )
        } else {
            // If opened directly (not via popup), redirect to login page
            window.location.href = '/login?error=oauth_callback_failed'
        }
    }, [searchParams])

    return (
        <CallbackContainer>
            <LoadingCard>
                <Spinner />
                <Message>Completing GitHub authentication...</Message>
            </LoadingCard>
        </CallbackContainer>
    )
}
