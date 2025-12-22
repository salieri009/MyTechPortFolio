# Backend Server Start Guide

## Current Status

### ✅ Frontend
- **Port**: 5173
- **Status**: Running
- **URL**: http://localhost:5173

### ❌ Backend
- **Port**: 8080
- **Status**: Not running
- **Required Service**: MongoDB (port 27017)

## How to Start Backend Server

### 1. Check and Start MongoDB

#### If MongoDB is installed:
```powershell
# Check MongoDB service
Get-Service | Where-Object { $_.Name -like "*mongo*" }

# Start MongoDB service (admin privileges required)
Start-Service MongoDB
```

#### If MongoDB is not installed:
1. [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start service after installation

#### Or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Start Backend Server

#### Method 1: Gradle Wrapper (Recommended)
```powershell
cd backend
.\gradlew.bat bootRun
```

#### Method 2: Run from IDE
- Run `PortfolioApplication.java` in IntelliJ IDEA or Eclipse
- Optionally add `--spring.profiles.active=dev` in Run Configuration

### 3. Verify Server Start

When server starts, verify with following commands:
```powershell
# Health Check
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET

# API Test
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/journey-milestones" -Method GET
```

## Troubleshooting

### Port 8080 already in use
```powershell
# Check process using port
netstat -ano | findstr :8080

# Kill process (after checking PID)
Stop-Process -Id <PID>
```

### MongoDB Connection Error
1. Verify MongoDB is running
2. Check MongoDB URI in `application.properties`:
   ```
   spring.data.mongodb.uri=mongodb://localhost:27017/portfolio
   ```

### Java Version Issue
- Java 21 is required
- Check: `java -version`
- Install: [Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)

## Frontend-Backend Connection Verification

### 1. Direct Backend Access
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/journey-milestones" -Method GET
```

### 2. Access via Frontend Proxy
```powershell
Invoke-WebRequest -Uri "http://localhost:5173/api/journey-milestones" -Method GET
```

### 3. Verify in Browser
- Developer Tools (F12) → Network tab
- Check `/api/journey-milestones` request
- Status Code 200 indicates success

## Environment Variables Setup

### Frontend (.env file)
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend
- Configure in `application.properties` file
- Check MongoDB URI, JWT Secret, etc.
