# Frontend-Backend Connectivity Status

## Current Status

### Frontend Server
- **Status**: ✅ Running
- **Port**: 5173
- **URL**: http://localhost:5173

### Backend Server
- **Status**: ❌ Not Running
- **Port**: 8080
- **Expected URL**: http://localhost:8080

## Configuration

### Frontend API Configuration
- **Base URL**: `/api` (development)
- **Proxy**: Vite proxy rewrites `/api` → `http://localhost:8080/api/v1`
- **File**: `frontend/vite.config.ts`

### Backend API Endpoints
- **Base Path**: `/api/v1`
- **Health Check**: `/actuator/health`
- **Journey Milestones**: `/api/v1/journey-milestones`

## How to Start Backend Server

### Option 1: Gradle Wrapper (Recommended)
```bash
cd backend
.\gradlew.bat bootRun
```

### Option 2: IDE
- Run `PortfolioApplication.java` from your IDE
- Ensure MongoDB is running on `localhost:27017`

## Troubleshooting

### Backend Server Not Starting
1. Check if MongoDB is running:
   ```bash
   # Check MongoDB connection
   mongosh mongodb://localhost:27017/portfolio
   ```

2. Check Java version:
   ```bash
   java -version  # Should be Java 21
   ```

3. Check port 8080 availability:
   ```bash
   netstat -ano | findstr :8080
   ```

### API Connection Issues
1. Verify Vite proxy configuration in `frontend/vite.config.ts`
2. Check backend CORS settings in `backend/src/main/resources/application.properties`
3. Verify backend server logs for errors

## Testing Connectivity

### Test Backend Health
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET
```

### Test API Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/journey-milestones" -Method GET
```

### Test Frontend Proxy
```powershell
Invoke-WebRequest -Uri "http://localhost:5173/api/journey-milestones" -Method GET
```

## Environment Variables

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE_URL=http://localhost:8080/api  # Optional, uses proxy in dev
```

### Backend (application.properties)
- Server port: 8080
- MongoDB: mongodb://localhost:27017/portfolio
- CORS: http://localhost:5173

