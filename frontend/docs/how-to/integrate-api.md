# Integrate API

이 가이드는 백엔드 API와 통신하는 방법을 설명합니다.

## 목차

- [API 클라이언트 개요](#api-클라이언트-개요)
- [서비스 레이어 생성](#서비스-레이어-생성)
- [컴포넌트에서 사용](#컴포넌트에서-사용)
- [에러 처리](#에러-처리)
- [로딩 상태 관리](#로딩-상태-관리)
- [모범 사례](#모범-사례)

## API 클라이언트 개요

프로젝트는 **Axios**를 사용하여 HTTP 요청을 처리합니다. API 클라이언트는 `src/services/apiClient.ts`에 정의되어 있습니다.

### 기본 설정

```typescript
// src/services/apiClient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## 서비스 레이어 생성

### 1. 서비스 파일 생성

`src/services/` 디렉토리에 새 서비스 파일을 만듭니다:

```typescript
// src/services/contacts.ts
import { apiClient } from './apiClient'
import type { Contact } from '../types/domain'

export interface CreateContactRequest {
  name: string
  email: string
  message: string
}

export interface ContactResponse {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export const contactService = {
  // 연락처 생성
  create: async (data: CreateContactRequest): Promise<ContactResponse> => {
    const response = await apiClient.post<ContactResponse>('/contacts', data)
    return response.data
  },
  
  // 연락처 목록 조회
  getAll: async (): Promise<ContactResponse[]> => {
    const response = await apiClient.get<ContactResponse[]>('/contacts')
    return response.data
  },
  
  // 연락처 상세 조회
  getById: async (id: string): Promise<ContactResponse> => {
    const response = await apiClient.get<ContactResponse>(`/contacts/${id}`)
    return response.data
  },
  
  // 연락처 삭제
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/contacts/${id}`)
  },
}
```

### 2. 타입 정의

타입은 `src/types/domain.ts`에 정의합니다:

```typescript
// src/types/domain.ts
export interface Contact {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}
```

## 컴포넌트에서 사용

### 1. React Query 사용 (권장)

React Query를 사용하여 데이터 페칭을 관리합니다:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { contactService } from '@services/contacts'

function ContactList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactService.getAll(),
  })
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <div>
      {data?.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  )
}
```

### 2. 직접 사용 (간단한 경우)

간단한 경우 직접 사용할 수 있습니다:

```typescript
import { useState, useEffect } from 'react'
import { contactService } from '@services/contacts'

function ContactList() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const data = await contactService.getAll()
        setContacts(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchContacts()
  }, [])
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <div>
      {contacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  )
}
```

## 에러 처리

### 1. 전역 에러 핸들러

`src/services/apiClient.ts`에 인터셉터를 추가합니다:

```typescript
// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전 처리 (인증 토큰 추가 등)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리
    if (error.response?.status === 401) {
      // 인증 오류 처리
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 2. 컴포넌트에서 에러 처리

```typescript
try {
  const data = await contactService.create(formData)
  // 성공 처리
} catch (error) {
  if (error.response?.status === 400) {
    // 잘못된 요청
    setError('입력 정보를 확인해주세요.')
  } else if (error.response?.status === 500) {
    // 서버 오류
    setError('서버 오류가 발생했습니다.')
  } else {
    // 기타 오류
    setError('오류가 발생했습니다.')
  }
}
```

## 로딩 상태 관리

로딩 상태를 명확하게 표시합니다:

```typescript
const [loading, setLoading] = useState(false)

const handleSubmit = async (data: FormData) => {
  setLoading(true)
  try {
    await contactService.create(data)
    // 성공 처리
  } catch (error) {
    // 에러 처리
  } finally {
    setLoading(false)
  }
}

return (
  <form onSubmit={handleSubmit}>
    {/* 폼 필드 */}
    <button type="submit" disabled={loading}>
      {loading ? '제출 중...' : '제출하기'}
    </button>
  </form>
)
```

## 모범 사례

### 1. 타입 안정성

- 모든 API 응답에 타입을 정의하세요
- TypeScript를 활용하여 타입 안정성을 보장하세요

### 2. 에러 처리

- 모든 API 호출에 에러 처리를 추가하세요
- 사용자에게 명확한 에러 메시지를 표시하세요

### 3. 성능

- 불필요한 API 호출을 피하세요
- 캐싱을 적절히 활용하세요
- 로딩 상태를 명확하게 표시하세요

### 4. 보안

- 민감한 정보는 서버로 전송하지 마세요
- 인증 토큰을 안전하게 관리하세요

## 관련 문서

- [Services Reference](../reference/services-reference.md) - 서비스 API 참조
- [Types Reference](../reference/types-reference.md) - 타입 정의 참조


