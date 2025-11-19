# Backend Server 시작 가이드

## 현재 상태

### ✅ Frontend
- **포트**: 5173
- **상태**: 실행 중
- **URL**: http://localhost:5173

### ❌ Backend
- **포트**: 8080
- **상태**: 실행 중이 아님
- **필요한 서비스**: MongoDB (포트 27017)

## 백엔드 서버 시작 방법

### 1. MongoDB 확인 및 시작

#### MongoDB가 설치되어 있는 경우:
```powershell
# MongoDB 서비스 확인
Get-Service | Where-Object { $_.Name -like "*mongo*" }

# MongoDB 서비스 시작 (관리자 권한 필요)
Start-Service MongoDB
```

#### MongoDB가 설치되어 있지 않은 경우:
1. [MongoDB Community Server 다운로드](https://www.mongodb.com/try/download/community)
2. 설치 후 서비스 시작

#### 또는 Docker 사용:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. 백엔드 서버 시작

#### 방법 1: Gradle Wrapper (권장)
```powershell
cd backend
.\gradlew.bat bootRun
```

#### 방법 2: IDE에서 실행
- IntelliJ IDEA 또는 Eclipse에서 `PortfolioApplication.java` 실행
- Run Configuration에서 `--spring.profiles.active=dev` 추가 가능

### 3. 서버 시작 확인

서버가 시작되면 다음 명령어로 확인:
```powershell
# Health Check
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET

# API 테스트
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/journey-milestones" -Method GET
```

## 문제 해결

### 포트 8080이 이미 사용 중인 경우
```powershell
# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :8080

# 프로세스 종료 (PID 확인 후)
Stop-Process -Id <PID>
```

### MongoDB 연결 오류
1. MongoDB가 실행 중인지 확인
2. `application.properties`의 MongoDB URI 확인:
   ```
   spring.data.mongodb.uri=mongodb://localhost:27017/portfolio
   ```

### Java 버전 문제
- Java 21이 필요합니다
- 확인: `java -version`
- 설치: [Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)

## 프론트엔드-백엔드 연결 확인

### 1. 백엔드 직접 접근
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/journey-milestones" -Method GET
```

### 2. 프론트엔드 프록시를 통한 접근
```powershell
Invoke-WebRequest -Uri "http://localhost:5173/api/journey-milestones" -Method GET
```

### 3. 브라우저에서 확인
- 개발자 도구 (F12) → Network 탭
- `/api/journey-milestones` 요청 확인
- Status Code가 200이면 정상

## 환경 변수 설정

### Frontend (.env 파일 생성)
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend
- `application.properties` 파일에서 설정
- MongoDB URI, JWT Secret 등 확인

