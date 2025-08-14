# EmailJS 설정 가이드

## 1. EmailJS 계정 생성 및 설정

### 회원가입 및 서비스 생성
1. [EmailJS](https://www.emailjs.com/) 방문
2. 계정 생성 (무료 플랜: 월 200회 무료)
3. 새 서비스 생성 (Gmail, Outlook 등 연동)

### 이메일 템플릿 생성
EmailJS 대시보드에서 이메일 템플릿을 다음과 같이 생성:

```html
Subject: [포트폴리오 피드백] {{subject}}

From: {{from_name}} <{{from_email}}>
To: {{to_email}}

HTML 템플릿:
{{{html_content}}}

Plain Text 템플릿:
{{{plain_content}}}
```

## 2. 환경 변수 설정

`.env` 파일을 생성하여 다음 변수들을 설정:

```env
# EmailJS 설정
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here  
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_FEEDBACK_EMAIL=your.email@example.com

# 기타 설정
VITE_USE_BACKEND_API=false
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 3. 설정 값 확인 방법

EmailJS 대시보드에서:
- **Service ID**: Email Services > 서비스 선택 > Service ID
- **Template ID**: Email Templates > 템플릿 선택 > Template ID  
- **Public Key**: Account > API Keys > Public Key

## 4. 테스트

개발자 도구 콘솔에서 설정 상태 확인:
```javascript
// EmailJS 설정 상태 체크
import { getEmailConfigStatus } from '@services/email'
console.log(getEmailConfigStatus())

// 테스트 이메일 전송
import { testEmailConnection } from '@services/email'
testEmailConnection()
```

## 5. 주의사항

- `.env` 파일은 `.gitignore`에 추가되어 있어 Git에 커밋되지 않습니다
- 프로덕션 환경에서는 환경 변수를 별도로 설정해야 합니다
- EmailJS 무료 플랜 제한: 월 200회, 초당 1회
- 실제 이메일 전송을 위해서는 유효한 EmailJS 설정이 필요합니다
