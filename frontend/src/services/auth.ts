type Mode = 'demo' | 'jwt'
const AUTH_MODE: Mode = (import.meta as any).env.VITE_AUTH_MODE || 'demo'

export function isAuthenticated(): boolean {
  if (AUTH_MODE === 'demo') return true
  return !!localStorage.getItem('token')
}

export async function login(_id?: string, _pw?: string): Promise<void> {
  if (AUTH_MODE === 'demo') return
  // TODO: call real auth API, set token in localStorage
}

export function logout(): void {
  if (AUTH_MODE === 'demo') return
  localStorage.removeItem('token')
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}
