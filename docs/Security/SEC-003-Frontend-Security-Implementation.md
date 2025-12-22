# 🔐 Frontend Security Implementation Guide

## Overview
Detailed guide for security implementation in React + TypeScript based frontend.

---

## 🛡️ 1. Secure Authentication Flow

### 1.1 Enhanced Auth Store with Security
```typescript
// store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { encrypt, decrypt } from '../utils/encryption'

interface SecurityContext {
  sessionId: string
  lastActivity: number
  deviceFingerprint: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  securityContext: SecurityContext | null
  
  // Security methods
  updateLastActivity: () => void
  checkSessionValidity: () => boolean
  clearSecurityContext: () => void
  
  // Existing methods...
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      securityContext: null,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: true,
          error: null,
          securityContext: {
            sessionId: crypto.randomUUID(),
            lastActivity: Date.now(),
            deviceFingerprint: generateDeviceFingerprint()
          }
        })
      },

      setTokens: (accessToken, refreshToken) => {
        // Store access token in memory only
        set({ accessToken, isAuthenticated: true })
        
        // Store refresh token in secure cookie via API call
        storeRefreshTokenSecurely(refreshToken)
      },

      updateLastActivity: () => {
        const state = get()
        if (state.securityContext) {
          set({
            securityContext: {
              ...state.securityContext,
              lastActivity: Date.now()
            }
          })
        }
      },

      checkSessionValidity: () => {
        const state = get()
        if (!state.securityContext) return false
        
        const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
        const isValid = Date.now() - state.securityContext.lastActivity < SESSION_TIMEOUT
        
        if (!isValid) {
          get().clearAuth()
        }
        
        return isValid
      },

      clearAuth: () => {
        // Clear all auth data
        clearRefreshTokenSecurely()
        set({ 
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          securityContext: null
        })
      },

      clearSecurityContext: () => {
        set({ securityContext: null })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const item = localStorage.getItem(name)
          return item ? decrypt(item) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, encrypt(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      })),
      partialize: (state) => ({
        user: state.user,
        securityContext: state.securityContext
        // accessToken is NOT persisted for security
      })
    }
  )
)

// Security utility functions
function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx?.fillText('fingerprint', 2, 2)
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|')
  
  return btoa(fingerprint).slice(0, 32)
}

async function storeRefreshTokenSecurely(token: string) {
  // This would be an API call to set httpOnly cookie
  await fetch('/api/auth/set-refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    credentials: 'include'
  })
}

async function clearRefreshTokenSecurely() {
  await fetch('/api/auth/clear-refresh-token', {
    method: 'POST',
    credentials: 'include'
  })
}
```

### 1.2 Secure HTTP Client with Auto-Retry
```typescript
// services/secureHttpClient.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'

class SecureHttpClient {
  private baseURL: string
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (error?: any) => void
  }> = []

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Add security headers
        config.headers = {
          ...config.headers,
          'X-Requested-With': 'XMLHttpRequest',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }

        // Add CSRF token if available
        const csrfToken = this.getCSRFToken()
        if (csrfToken) {
          config.headers['X-CSRF-TOKEN'] = csrfToken
        }

        // Add auth token
        const accessToken = useAuthStore.getState().accessToken
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }

        // Update last activity
        useAuthStore.getState().updateLastActivity()

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    axios.interceptors.response.use(
      (response) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error)
    )
  }

  private handleSuccessResponse(response: AxiosResponse) {
    // Log successful requests for security monitoring
    if (response.config.method !== 'get') {
      console.log(`Secure request completed: ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }
    return response
  }

  private async handleErrorResponse(error: any) {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        }).catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      this.isRefreshing = true

      try {
        const newToken = await this.refreshToken()
        this.processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        this.processQueue(refreshError, null)
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        this.isRefreshing = false
      }
    }

    // Handle other security-related errors
    if (error.response?.status === 429) {
      this.handleRateLimitError(error)
    }

    return Promise.reject(error)
  }

  private async refreshToken(): Promise<string> {
    const response = await axios.post(`${this.baseURL}/auth/refresh`, {}, {
      withCredentials: true // Include httpOnly cookie
    })
    
    const { accessToken } = response.data.data
    useAuthStore.getState().setTokens(accessToken, '')
    return accessToken
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
    this.failedQueue = []
  }

  private getCSRFToken(): string | null {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null
  }

  private handleRateLimitError(error: any) {
    const retryAfter = error.response.headers['retry-after']
    if (retryAfter) {
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`)
      // Could implement exponential backoff here
    }
  }

  // Public methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get(`${this.baseURL}${url}`, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.post(`${this.baseURL}${url}`, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.put(`${this.baseURL}${url}`, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.delete(`${this.baseURL}${url}`, config)
    return response.data
  }
}

export const secureHttpClient = new SecureHttpClient()
```

---

## 🔒 2. Content Security & XSS Prevention

### 2.1 HTML Sanitization for Rich Text
```typescript
// utils/sanitizer.ts
import DOMPurify from 'dompurify'

export class ContentSanitizer {
  private static readonly ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'del', 'ins',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ]

  private static readonly ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height', 'title'],
    'code': ['class'],
    'pre': ['class'],
    'table': ['class'],
    'th': ['scope'],
    'td': ['colspan', 'rowspan']
  }

  static sanitizeHtml(html: string, options?: {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
  }): string {
    const config = {
      ALLOWED_TAGS: options?.allowedTags || this.ALLOWED_TAGS,
      ALLOWED_ATTR: options?.allowedAttributes || this.ALLOWED_ATTRIBUTES,
      ALLOW_DATA_ATTR: false,
      FORBID_SCRIPT: true,
      FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style', 'iframe', 'form'],
      FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'style'],
      KEEP_CONTENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      SANITIZE_DOM: true
    }

    // Additional security: remove potential data URLs
    const sanitized = DOMPurify.sanitize(html, config)
    return this.removeDataUrls(sanitized)
  }

  static sanitizeText(text: string): string {
    return text
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  private static removeDataUrls(html: string): string {
    return html.replace(/data:(?!image\/(png|jpg|jpeg|gif|svg\+xml))[^;]*;base64[^"'\s]*/gi, '')
  }

  static validateImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      const allowedProtocols = ['http:', 'https:']
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']
      
      return allowedProtocols.includes(urlObj.protocol) &&
             allowedExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext))
    } catch {
      return false
    }
  }

  static validateLinkUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      const allowedProtocols = ['http:', 'https:', 'mailto:']
      const blockedDomains = ['javascript', 'data', 'vbscript']
      
      return allowedProtocols.includes(urlObj.protocol) &&
             !blockedDomains.some(domain => urlObj.hostname.includes(domain))
    } catch {
      return false
    }
  }
}
```

### 2.2 Secure Rich Text Editor Component
```typescript
// components/SecureRichTextEditor.tsx
import React, { useCallback, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ContentSanitizer } from '../utils/sanitizer'

interface SecureRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function SecureRichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  readOnly = false 
}: SecureRichTextEditorProps) {
  
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: handleImageUpload,
        link: handleLinkCreation
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [])

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image'
  ]

  const handleChange = useCallback((content: string) => {
    // Sanitize content before updating state
    const sanitized = ContentSanitizer.sanitizeHtml(content)
    onChange(sanitized)
  }, [onChange])

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file')
          return
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('Image size must be less than 5MB')
          return
        }

        // Upload to secure endpoint
        uploadImageSecurely(file).then(url => {
          const quill = (window as any).Quill
          const range = quill.getSelection()
          quill.insertEmbed(range.index, 'image', url)
        }).catch(error => {
          console.error('Image upload failed:', error)
          alert('Image upload failed')
        })
      }
    }
  }, [])

  const handleLinkCreation = useCallback(() => {
    const url = prompt('Enter link URL:')
    if (url) {
      if (!ContentSanitizer.validateLinkUrl(url)) {
        alert('Invalid or unsafe URL')
        return
      }
      
      const quill = (window as any).Quill
      const range = quill.getSelection()
      quill.format('link', url)
    }
  }, [])

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  )
}

async function uploadImageSecurely(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${useAuthStore.getState().accessToken}`
    }
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  const result = await response.json()
  return result.data.url
}
```

---

## 🔐 3. Encryption & Secure Storage

### 3.1 Client-Side Encryption Utilities
```typescript
// utils/encryption.ts
export class ClientEncryption {
  private static readonly ALGORITHM = 'AES-GCM'
  private static readonly KEY_LENGTH = 256
  private static readonly IV_LENGTH = 12

  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    )
  }

  static async encrypt(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data)
      
      const key = await this.getOrCreateKey()
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        key,
        dataBuffer
      )
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encryptedBuffer), iv.length)
      
      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error('Encryption failed:', error)
      return data // Fallback to plain text
    }
  }

  static async decrypt(encryptedData: string): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      )
      
      const iv = combined.slice(0, this.IV_LENGTH)
      const encrypted = combined.slice(this.IV_LENGTH)
      
      const key = await this.getOrCreateKey()
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        key,
        encrypted
      )
      
      const decoder = new TextDecoder()
      return decoder.decode(decryptedBuffer)
    } catch (error) {
      console.error('Decryption failed:', error)
      return encryptedData // Fallback to encrypted text
    }
  }

  private static async getOrCreateKey(): Promise<CryptoKey> {
    const keyData = localStorage.getItem('encryption_key')
    
    if (keyData) {
      try {
        const keyBuffer = new Uint8Array(
          atob(keyData).split('').map(char => char.charCodeAt(0))
        )
        
        return await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: this.ALGORITHM },
          false,
          ['encrypt', 'decrypt']
        )
      } catch (error) {
        console.warn('Failed to import stored key, generating new one')
      }
    }
    
    // Generate new key
    const key = await this.generateKey()
    const keyBuffer = await crypto.subtle.exportKey('raw', key)
    const keyString = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)))
    localStorage.setItem('encryption_key', keyString)
    
    return key
  }
}

// Export simplified functions for use in other modules
export const encrypt = ClientEncryption.encrypt.bind(ClientEncryption)
export const decrypt = ClientEncryption.decrypt.bind(ClientEncryption)
```

### 3.2 Secure Form Validation
```typescript
// utils/secureValidation.ts
export class SecureFormValidator {
  
  static validateEmail(email: string): { isValid: boolean; message?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!email) {
      return { isValid: false, message: 'Email is required' }
    }
    
    if (email.length > 254) {
      return { isValid: false, message: 'Email is too long' }
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format' }
    }
    
    // Check for potentially malicious patterns
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+=/i
    ]
    
    if (dangerousPatterns.some(pattern => pattern.test(email))) {
      return { isValid: false, message: 'Invalid characters in email' }
    }
    
    return { isValid: true }
  }

  static validateBlogTitle(title: string): { isValid: boolean; message?: string } {
    if (!title || title.trim().length === 0) {
      return { isValid: false, message: 'Title is required' }
    }
    
    if (title.length > 255) {
      return { isValid: false, message: 'Title must be less than 255 characters' }
    }
    
    // Check for XSS patterns
    const xssPatterns = [
      /<script/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+=/i
    ]
    
    if (xssPatterns.some(pattern => pattern.test(title))) {
      return { isValid: false, message: 'Title contains prohibited content' }
    }
    
    return { isValid: true }
  }

  static validateBlogContent(content: string): { isValid: boolean; message?: string } {
    if (!content || content.trim().length === 0) {
      return { isValid: false, message: 'Content is required' }
    }
    
    if (content.length > 100000) { // 100KB limit
      return { isValid: false, message: 'Content is too long' }
    }
    
    // The content will be sanitized by ContentSanitizer
    // This is just a basic check for obviously malicious content
    const maliciousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
      /javascript:[\s\S]*?[;"']/gi
    ]
    
    if (maliciousPatterns.some(pattern => pattern.test(content))) {
      return { isValid: false, message: 'Content contains prohibited elements' }
    }
    
    return { isValid: true }
  }

  static validateSlug(slug: string): { isValid: boolean; message?: string } {
    if (!slug) {
      return { isValid: false, message: 'Slug is required' }
    }
    
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    
    if (!slugRegex.test(slug)) {
      return { isValid: false, message: 'Slug can only contain lowercase letters, numbers, and hyphens' }
    }
    
    if (slug.length < 3 || slug.length > 100) {
      return { isValid: false, message: 'Slug must be between 3 and 100 characters' }
    }
    
    return { isValid: true }
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }
}
```

---

## 🔍 4. Security Monitoring & Alerts

### 4.1 Client-Side Security Monitor
```typescript
// services/securityMonitor.ts
export class SecurityMonitor {
  private static instance: SecurityMonitor
  private anomalyCount = 0
  private lastReportTime = 0
  private readonly REPORT_INTERVAL = 60000 // 1 minute

  static getInstance(): SecurityMonitor {
    if (!this.instance) {
      this.instance = new SecurityMonitor()
    }
    return this.instance
  }

  init() {
    this.setupGlobalErrorHandler()
    this.setupCSPViolationHandler()
    this.setupPerformanceMonitoring()
    this.setupDevToolsDetection()
  }

  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      // Check for potential security-related errors
      if (this.isSecurityRelatedError(event.error)) {
        this.reportSecurityEvent('script_error', {
          message: event.message,
          filename: event.filename,
          line: event.lineno,
          column: event.colno
        })
      }
    })

    window.addEventListener('unhandledrejection', (event) => {
      if (this.isSecurityRelatedError(event.reason)) {
        this.reportSecurityEvent('promise_rejection', {
          reason: event.reason?.message || 'Unknown rejection'
        })
      }
    })
  }

  private setupCSPViolationHandler() {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.reportSecurityEvent('csp_violation', {
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition
      })
    })
  }

  private setupPerformanceMonitoring() {
    // Monitor for potential DoS attacks through excessive resource usage
    setInterval(() => {
      if (performance.memory) {
        const memory = (performance.memory as any)
        if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB threshold
          this.reportSecurityEvent('high_memory_usage', {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize
          })
        }
      }
    }, 30000) // Check every 30 seconds
  }

  private setupDevToolsDetection() {
    let devtools = false
    const element = new Image()
    Object.defineProperty(element, 'id', {
      get: () => {
        devtools = true
        this.reportSecurityEvent('devtools_opened', {
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }
    })
    
    setInterval(() => {
      devtools = false
      console.log(element)
      console.clear()
    }, 1000)
  }

  private isSecurityRelatedError(error: any): boolean {
    if (!error) return false
    
    const securityKeywords = [
      'script', 'eval', 'inject', 'xss', 'csrf', 
      'unauthorized', 'forbidden', 'cors'
    ]
    
    const errorMessage = error.message?.toLowerCase() || ''
    return securityKeywords.some(keyword => errorMessage.includes(keyword))
  }

  private async reportSecurityEvent(type: string, data: any) {
    this.anomalyCount++
    
    // Rate limiting for reports
    const now = Date.now()
    if (now - this.lastReportTime < this.REPORT_INTERVAL) {
      return
    }
    
    this.lastReportTime = now
    
    try {
      await fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().accessToken}`
        },
        body: JSON.stringify({
          type,
          data,
          anomalyCount: this.anomalyCount,
          timestamp: now,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (error) {
      console.warn('Failed to report security event:', error)
    }
  }

  // Manual reporting method for application-specific events
  reportCustomEvent(type: string, data: any) {
    this.reportSecurityEvent(`custom_${type}`, data)
  }
}

// Initialize security monitoring
export const securityMonitor = SecurityMonitor.getInstance()
```

### 4.2 Secure Error Boundary
```typescript
// components/SecureErrorBoundary.tsx
import React, { Component, ReactNode } from 'react'
import { securityMonitor } from '../services/securityMonitor'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  errorInfo: string | null
}

export class SecureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      errorInfo: error.message 
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report security-related errors
    securityMonitor.reportCustomEvent('react_error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('React Error Boundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Something went wrong</h3>
          <p>We apologize for the inconvenience. The error has been reported.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 🚀 5. Implementation Checklist

### Phase 1: Core Security (Week 1)
- [x] ✅ Secure authentication flow implemented
- [x] ✅ Token storage security enhanced
- [x] ✅ HTTP client security features added
- [x] ✅ Input validation and sanitization

### Phase 2: Content Security (Week 2)
- [x] ✅ CSP headers configuration
- [x] ✅ XSS prevention in rich text editor
- [x] ✅ Client-side encryption utilities
- [x] ✅ Secure form validation

### Phase 3: Monitoring (Week 3)
- [x] ✅ Security event monitoring
- [x] ✅ Error boundary with security reporting
- [x] ✅ Performance monitoring for DoS detection
- [x] ✅ DevTools detection

### Phase 4: Testing & Hardening (Week 4)
- [ ] 🔄 Security penetration testing
- [ ] 🔄 Performance testing under load
- [ ] 🔄 Browser compatibility testing
- [ ] 🔄 Accessibility compliance

---

*This guide is designed to meet frontend security requirements in production environments.*
