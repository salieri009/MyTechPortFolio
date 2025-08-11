import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
})

const AUTH_MODE = (import.meta as any).env.VITE_AUTH_MODE || 'demo'

api.interceptors.request.use((config) => {
  if (AUTH_MODE === 'jwt') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
