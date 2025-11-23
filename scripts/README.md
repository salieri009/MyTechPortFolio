# Connection Verification Scripts

## Overview

These scripts execute comprehensive connection verification checks based on `frontend/docs/CONNECTION_VERIFICATION_CHECKLIST.md`.

## Usage

### Option 1: Run from Frontend Directory (Recommended)

```bash
cd frontend
node ../scripts/verify-connection.js
```

### Option 2: Run with npx

```bash
cd frontend
npx node ../scripts/verify-connection.js
```

### Option 3: Add to package.json

Add this to `frontend/package.json`:

```json
{
  "scripts": {
    "verify:connection": "node ../scripts/verify-connection.js"
  }
}
```

Then run:
```bash
cd frontend
npm run verify:connection
```

## Prerequisites

- Backend server running on `http://localhost:8080`
- Frontend server running on `http://localhost:5173` (optional, for CORS tests)
- MongoDB running (for backend to connect)

## Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:8080/api`)
- `FRONTEND_URL`: Frontend URL for CORS tests (default: `http://localhost:5173`)

## What It Checks

### Phase 1: Environment & Setup
- ✅ Backend Health (`/actuator/health`)
- ✅ CORS Configuration

### Phase 3: API Interaction
- ✅ API Connectivity
- ✅ Request Headers (X-Request-ID, X-Response-Time)

### Phase 4: Error Handling
- ✅ 404 Not Found handling
- ✅ 400 Bad Request handling

### Phase 4: Performance & UX
- ✅ Response Time (< 500ms target)

## Output

The script generates a comprehensive report with:
- Summary statistics (Pass/Fail/Warn/Skip counts)
- Detailed results grouped by phase
- Response times for each test
- Error details when tests fail

## Exit Codes

- `0`: All tests passed or only warnings
- `1`: One or more tests failed


