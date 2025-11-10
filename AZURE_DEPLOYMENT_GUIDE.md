# Azure 배포 가이드

## 🚀 Azure Container Apps를 사용한 포트폴리오 배포

### 사전 요구사항

1. **Azure CLI 설치**
   ```bash
   # Windows
   winget install Microsoft.AzureCLI
   
   # macOS
   brew install azure-cli
   
   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Docker 설치**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치

3. **Azure 계정 및 구독**
   - Azure 계정 생성
   - 구독 ID 확인

### 1단계: 환경 설정

```bash
# 1. Azure CLI 로그인
az login

# 2. 구독 확인
az account show

# 3. 환경 변수 파일 생성
chmod +x create-env.sh
./create-env.sh

# 4. .env 파일 수정 (필요시)
# Azure 구독 ID, 리소스 그룹명 등을 실제 값으로 변경
```

### 2단계: 로컬 테스트

```bash
# 1. Docker Compose로 로컬 테스트
docker-compose up -d

# 2. 백엔드 상태 확인
curl http://localhost:8080/api/actuator/health

# 3. 프론트엔드 접속
# 브라우저에서 http://localhost:80 접속

# 4. 컨테이너 중지
docker-compose down
```

### 3단계: Azure 배포

```bash
# 1. 배포 스크립트 실행 권한 부여
chmod +x azure-deploy.sh

# 2. Azure 배포 실행
./azure-deploy.sh production

# 3. 배포 상태 확인
az containerapp list --resource-group portfolio-rg
```

### 4단계: 배포 후 설정

#### 4.1 도메인 설정 (선택사항)
```bash
# 커스텀 도메인 추가
az containerapp hostname add \
  --name portfolio-frontend \
  --resource-group portfolio-rg \
  --hostname your-domain.com
```

#### 4.2 SSL 인증서 설정
```bash
# Azure에서 자동으로 SSL 인증서 관리
# 별도 설정 불필요
```

#### 4.3 모니터링 설정
```bash
# Application Insights 활성화
az monitor app-insights component create \
  --app portfolio-insights \
  --location koreacentral \
  --resource-group portfolio-rg \
  --application-type web
```

### 5단계: CI/CD 파이프라인 설정

#### GitHub Actions 워크플로우 생성

`.github/workflows/azure-deploy.yml` 파일 생성:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  AZURE_RESOURCE_GROUP: portfolio-rg
  AZURE_CONTAINER_REGISTRY: portfolioacr

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Azure login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Build and push images
      run: |
        az acr build --registry $AZURE_CONTAINER_REGISTRY --image portfolio-backend:latest ./backend
        az acr build --registry $AZURE_CONTAINER_REGISTRY --image portfolio-frontend:latest ./frontend
    
    - name: Deploy to Container Apps
      run: |
        az containerapp update --name portfolio-backend --resource-group $AZURE_RESOURCE_GROUP --image $AZURE_CONTAINER_REGISTRY.azurecr.io/portfolio-backend:latest
        az containerapp update --name portfolio-frontend --resource-group $AZURE_RESOURCE_GROUP --image $AZURE_CONTAINER_REGISTRY.azurecr.io/portfolio-frontend:latest
```

### 6단계: 문제 해결

#### 일반적인 문제들

1. **CORS 오류**
   ```bash
   # 백엔드 CORS 설정 확인
   az containerapp show --name portfolio-backend --resource-group portfolio-rg --query properties.configuration.ingress.fqdn
   ```

2. **MongoDB 연결 오류**
   ```bash
   # MongoDB 컨테이너 상태 확인
   az container show --name portfolio-mongodb --resource-group portfolio-rg
   ```

3. **이미지 빌드 실패**
   ```bash
   # 로컬에서 이미지 빌드 테스트
   docker build -t portfolio-backend:test ./backend
   docker build -t portfolio-frontend:test ./frontend
   ```

#### 로그 확인
```bash
# 백엔드 로그
az containerapp logs show --name portfolio-backend --resource-group portfolio-rg

# 프론트엔드 로그
az containerapp logs show --name portfolio-frontend --resource-group portfolio-rg
```

### 7단계: 비용 최적화

#### 비용 절약 팁

1. **스케일링 설정 조정**
   ```bash
   # 최소 복제본 수 줄이기
   az containerapp update --name portfolio-backend --resource-group portfolio-rg --min-replicas 0 --max-replicas 1
   ```

2. **리소스 크기 조정**
   ```bash
   # CPU/메모리 사용량 줄이기
   az containerapp update --name portfolio-backend --resource-group portfolio-rg --cpu 0.5 --memory 1Gi
   ```

3. **개발 환경용 별도 리소스 그룹**
   ```bash
   # 개발 환경은 더 작은 리소스 사용
   ./azure-deploy.sh development
   ```

### 8단계: 보안 강화

#### 보안 설정

1. **환경 변수 암호화**
   ```bash
   # Azure Key Vault 사용
   az keyvault create --name portfolio-kv --resource-group portfolio-rg --location koreacentral
   ```

2. **네트워크 보안**
   ```bash
   # VNet 통합
   az containerapp env create --name portfolio-env-secure --resource-group portfolio-rg --location koreacentral --infrastructure-subnet-resource-id /subscriptions/.../subnets/default
   ```

### 9단계: 모니터링 및 알림

#### 모니터링 설정

```bash
# Application Insights 연결
az containerapp update --name portfolio-backend --resource-group portfolio-rg --set-env-vars APPLICATIONINSIGHTS_CONNECTION_STRING="your-connection-string"
```

### 10단계: 백업 및 복구

#### 데이터 백업

```bash
# MongoDB 백업
az container exec --name portfolio-mongodb --resource-group portfolio-rg --exec-command "mongodump --out /backup"
```

---

## 📊 배포 완료 후 확인사항

### 체크리스트

- [ ] 백엔드 API 응답 확인
- [ ] 프론트엔드 페이지 로딩 확인
- [ ] Google OAuth 로그인 테스트
- [ ] 프로젝트 목록 조회 테스트
- [ ] 기술 스택 목록 조회 테스트
- [ ] 학업 과정 목록 조회 테스트
- [ ] CORS 오류 확인
- [ ] SSL 인증서 확인
- [ ] 성능 테스트
- [ ] 모니터링 설정 확인

### 유용한 명령어

```bash
# 리소스 그룹 삭제 (전체 삭제)
az group delete --name portfolio-rg --yes

# 특정 리소스만 삭제
az containerapp delete --name portfolio-backend --resource-group portfolio-rg
az containerapp delete --name portfolio-frontend --resource-group portfolio-rg

# 비용 확인
az consumption usage list --billing-period-name 202401
```

---

## 🆘 지원

문제가 발생하면 다음을 확인하세요:

1. **로그 확인**: `az containerapp logs show`
2. **상태 확인**: `az containerapp show`
3. **네트워크 확인**: `az network nsg rule list`
4. **Azure 상태**: [Azure Status](https://status.azure.com/)

## 📞 연락처

- GitHub Issues: [프로젝트 이슈 페이지]
- 이메일: [your-email@example.com]
