# 🚀 MyPortfolio 배포 가이드

완벽한 포트폴리오 웹사이트를 Docker와 Azure로 배포하는 종합 가이드입니다.

## 📋 목차

1. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
2. [Docker 컨테이너 실행](#docker-컨테이너-실행)
3. [Azure 배포](#azure-배포)
4. [환경 변수 설정](#환경-변수-설정)
5. [모니터링 및 로깅](#모니터링-및-로깅)

## 🛠️ 로컬 개발 환경 설정

### 사전 요구사항
- Docker Desktop 4.0+
- Node.js 18+
- Java 21+
- Git

### 1. 저장소 클론
```bash
git clone https://github.com/salieri009/MyTechPortfolio.git
cd MyTechPortfolio
```

### 2. 환경 변수 설정
```bash
# 환경변수 템플릿 복사
cp environment.template .env

# .env 파일 편집 (실제 값으로 변경)
nano .env
```

### 3. 개발 서버 실행
```bash
# 개발 환경 (핫 리로드 지원)
docker-compose -f docker-compose.dev.yml up -d

# 프로덕션 환경 테스트
docker-compose up -d
```

## 🐳 Docker 컨테이너 실행

### 개발 모드
```bash
# 개발 컨테이너 실행
docker-compose -f docker-compose.dev.yml up -d

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f

# 컨테이너 중지
docker-compose -f docker-compose.dev.yml down
```

### 프로덕션 모드
```bash
# 프로덕션 컨테이너 실행
docker-compose up -d

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 컨테이너 중지
docker-compose down
```

### 개별 서비스 관리
```bash
# 백엔드만 재시작
docker-compose restart backend

# 프론트엔드만 재빌드
docker-compose up --build frontend

# MongoDB 데이터 확인
docker exec -it portfolio-mongodb mongosh
```

## ☁️ Azure 배포

### 1. Azure CLI 설치 및 로그인
```bash
# Azure CLI 설치 (macOS)
brew install azure-cli

# Azure 로그인
az login

# 구독 확인
az account list --output table
```

### 2. 자동 배포 스크립트 실행
```bash
# 실행 권한 부여
chmod +x azure-deploy.sh

# 환경변수 설정
export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"
export MONGO_ROOT_PASSWORD="secure_password"
export JWT_SECRET="very_long_jwt_secret"
export GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# 배포 실행
./azure-deploy.sh production
```

### 3. 수동 Azure 리소스 생성

#### Container Registry 생성
```bash
az acr create \
    --resource-group portfolio-rg \
    --name portfolioacr \
    --sku Basic \
    --admin-enabled true
```

#### Container Apps Environment 생성
```bash
az containerapp env create \
    --name portfolio-env \
    --resource-group portfolio-rg \
    --location koreacentral
```

#### MongoDB 배포 (Azure Container Instance)
```bash
az container create \
    --resource-group portfolio-rg \
    --name portfolio-mongodb \
    --image mongo:7.0 \
    --dns-name-label portfolio-mongodb-unique \
    --ports 27017 \
    --environment-variables \
        MONGO_INITDB_ROOT_USERNAME=admin \
        MONGO_INITDB_ROOT_PASSWORD=$MONGO_ROOT_PASSWORD
```

### 4. CI/CD 파이프라인 설정

GitHub Secrets에 다음 값들을 추가하세요:

```
AZURE_CREDENTIALS={"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}
AZURE_CONTAINER_REGISTRY=portfolioacr.azurecr.io
AZURE_RESOURCE_GROUP=portfolio-rg
AZURE_CONTAINER_APP_NAME=portfolio-backend
AZURE_ACR_USERNAME=portfolioacr
AZURE_ACR_PASSWORD=acr_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_BASE_URL=https://portfolio-backend.azurecontainerapps.io/api
```

## 📊 환경 변수 설정

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `MONGO_ROOT_PASSWORD` | MongoDB 루트 비밀번호 | `securePassword123!` |
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 | `GOCSPX-abcdef123456` |
| `JWT_SECRET` | JWT 서명 비밀키 (64자 이상) | `myVeryLongAndSecureJWTSecret...` |
| `GA_MEASUREMENT_ID` | Google Analytics 측정 ID | `G-XXXXXXXXXX` |

### 선택적 환경 변수

| 변수명 | 기본값 | 설명 |
|--------|---------|------|
| `CORS_ALLOWED_ORIGINS` | `*` | CORS 허용 도메인 |
| `VITE_USE_BACKEND_API` | `true` | 백엔드 API 사용 여부 |

## 📈 모니터링 및 로깅

### 로컬 환경 모니터링
```bash
# 컨테이너 상태 확인
docker-compose ps

# 리소스 사용량 확인
docker stats

# 로그 실시간 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
```

### Azure 환경 모니터링
```bash
# Container App 상태 확인
az containerapp show \
    --name portfolio-backend \
    --resource-group portfolio-rg

# 로그 스트림 확인
az containerapp logs show \
    --name portfolio-backend \
    --resource-group portfolio-rg \
    --follow
```

### Google Analytics 확인
1. [Google Analytics 4](https://analytics.google.com/)에서 실시간 데이터 확인
2. 사용자 플로우, 페이지 조회수, 이벤트 추적 확인
3. 커스텀 대시보드 설정

## 🚨 문제 해결

### 자주 발생하는 문제들

#### 1. MongoDB 연결 실패
```bash
# MongoDB 컨테이너 상태 확인
docker logs portfolio-mongodb

# 네트워크 연결 확인
docker network ls
docker network inspect myportfolio_portfolio-network
```

#### 2. Google OAuth 인증 실패
- Google Cloud Console에서 OAuth 설정 확인
- Authorized redirect URIs 설정 확인
- 클라이언트 ID/Secret 값 확인

#### 3. 빌드 실패
```bash
# 캐시 클리어 후 재빌드
docker-compose build --no-cache

# 의존성 문제 확인
docker-compose run --rm backend ./gradlew dependencies
docker-compose run --rm frontend npm audit
```

### 로그 위치
- Frontend: `./logs/frontend/`
- Backend: `./logs/backend/`
- MongoDB: Docker 컨테이너 로그

## 📚 추가 자료

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)

## 🤝 기여 가이드

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

---

## 🆘 지원

문제가 발생하면 다음을 확인해주세요:

1. [Issues](https://github.com/salieri009/MyTechPortfolio/issues)에서 유사한 문제 검색
2. 로그 파일 확인
3. 환경 변수 설정 재확인
4. Docker 컨테이너 상태 확인

추가 도움이 필요하면 새로운 Issue를 생성해주세요! 🚀
