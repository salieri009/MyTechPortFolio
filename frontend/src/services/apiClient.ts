import axios from 'axios'

// Azure 배포를 위한 API 기본 URL 설정
const getApiBaseUrl = () => {
  // 개발 환경에서는 프록시 사용
  if (import.meta.env.DEV) {
    return '/api'
  }
  
  // 프로덕션 환경에서는 환경 변수 사용
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  if (apiBaseUrl) {
    return apiBaseUrl
  }
  
  // 기본값
  return '/api'
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
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

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
