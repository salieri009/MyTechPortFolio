# Frontend-Backend Connection Verification Checklist

## Enhanced Prompt for Connection Verification

**Objective**: Verify the end-to-end integration between the React Frontend and Spring Boot Backend, ensuring robustness, security, and correct error handling.
**Target**: Zero 50X errors; Graceful handling of 40X errors; Seamless user experience under network instability.

### Prerequisites
- [ ] Backend (Spring Boot) is running on port 8080 (or configured port).
- [ ] Frontend (Vite/React) is running on port 5173 (or configured port).
- [ ] MongoDB is up and reachable by the Backend.
- [ ] Environment variables (.env) are correctly loaded for both services.

### Test Scenarios

#### 1. Authentication & Security (The "Gatekeeper" Test)
- **Happy Path**: Login with valid credentials -> Receive JWT -> Store in memory/storage -> Access protected route.
- **Token Expiry**: Simulate expired access token -> Verify silent refresh flow (if implemented) or graceful logout.
- **Unauthorized Access**: Access protected route without token -> Verify 401 Unauthorized -> Redirect to Login.
- **Forbidden Access**: Access Admin route with User role -> Verify 403 Forbidden -> Show "Access Denied" UI (not 500).
- **CORS**: Verify requests from allowed origins (localhost:5173) succeed; others fail.

#### 2. API Connectivity & Data Integrity (The "Pipe" Test)
- **CRUD Operations**:
    - **Create**: POST data -> Verify 201 Created -> Verify DB insertion.
    - **Read**: GET data -> Verify 200 OK -> Verify JSON structure matches TypeScript interfaces.
    - **Update**: PUT/PATCH data -> Verify 200 OK -> Verify DB update.
    - **Delete**: DELETE data -> Verify 204 No Content -> Verify DB removal.
- **Data Consistency**: Refresh page after mutation -> Verify UI reflects new state (cache invalidation).

#### 3. Error Handling & Resilience (The "Safety Net" Test)
- **Client-Side Validation**: Submit invalid form data -> Verify UI error messages (no API call).
- **Server-Side Validation**: Bypass client validation (e.g., via Postman) -> Verify 400 Bad Request with field-specific error details.
- **Network Failure**: Simulate offline mode/slow network -> Verify Loading Skeletons -> Verify "Network Error" toast/banner (not white screen).
- **Server Failure**: Simulate 500 Internal Server Error (e.g., kill DB) -> Verify generic "Service Unavailable" message to user (no stack traces).
- **Route Not Found**: Request non-existent API endpoint -> Verify 404 Not Found -> Handle gracefully.

#### 4. Performance & UX (The "Speed" Test)
- **Loading States**: Verify spinners/skeletons appear immediately upon request initiation.
- **Debouncing**: Rapidly click buttons/inputs -> Verify only necessary requests are sent.
- **Response Time**: Ensure API responses are within acceptable limits (< 500ms for standard ops).

---

## Comprehensive Verification Checklist

### Phase 1: Environment & Setup
- [ ] **Backend Health**: `GET /actuator/health` returns `{"status": "UP"}`.
- [ ] **Database Connection**: Backend logs confirm MongoDB connection is established.
- [ ] **Frontend Config**: `VITE_API_BASE_URL` points to the correct backend URL.
- [ ] **Network**: No firewall/proxy blocking communication between Frontend and Backend containers/processes.

### Phase 2: Authentication Flow
- [ ] **Login Success**: `POST /api/v1/auth/login` returns 200 and JWT token.
- [ ] **Token Storage**: Token is securely stored (e.g., `localStorage` or `httpOnly` cookie).
- [ ] **Header Injection**: Subsequent requests include `Authorization: Bearer <token>`.
- [ ] **Logout**: `POST /api/v1/auth/logout` (if applicable) clears client state.
- [ ] **Auto-Redirect**: Unauthenticated access to `/dashboard` redirects to `/login`.

### Phase 3: API Interaction (React <-> Spring Boot)
- [ ] **Request Headers**: `Content-Type: application/json` is present.
- [ ] **Response Structure**:
    - [ ] Success: `{ success: true, data: ..., message: ... }`
    - [ ] Error: `{ success: false, error: "...", code: ... }`
- [ ] **Type Safety**: Frontend received data matches Zod schemas / TypeScript interfaces.
- [ ] **Date Handling**: ISO 8601 dates from backend are correctly parsed and formatted in UI.

### Phase 4: Error Handling Scenarios
- [ ] **400 Bad Request**:
    - [ ] Trigger: Send malformed JSON or missing required fields.
    - [ ] Check: Backend returns 400. Frontend displays "Invalid input" or specific field error.
- [ ] **401 Unauthorized**:
    - [ ] Trigger: Send request with invalid/expired token.
    - [ ] Check: Backend returns 401. Frontend redirects to login or attempts refresh.
- [ ] **403 Forbidden**:
    - [ ] Trigger: User tries to delete a resource they don't own.
    - [ ] Check: Backend returns 403. Frontend shows "Permission denied" notification.
- [ ] **404 Not Found**:
    - [ ] Trigger: `GET /api/v1/projects/99999`.
    - [ ] Check: Backend returns 404. Frontend shows "Project not found" or redirects to list.
- [ ] **500 Internal Server Error**:
    - [ ] Trigger: Force an exception in backend (dev mode only) or stop DB.
    - [ ] Check: Backend returns 500. Frontend shows "Something went wrong, please try again". **NO CRASH**.

### Phase 5: UI/UX Polish
- [ ] **Loading Indicators**: No "flicker" of empty content; skeletons or spinners are visible.
- [ ] **Button States**: Submit buttons are disabled (`disabled={isLoading}`) during request.
- [ ] **Toast Notifications**: Success/Error toasts appear and auto-dismiss.
- [ ] **Empty States**: Lists show "No items found" when array is empty, not blank space.

### Phase 6: Security Sanity Check
- [ ] **XSS Prevention**: React automatically escapes content; verify no `dangerouslySetInnerHTML` usage with user input.
- [ ] **Sensitive Data**: Passwords/Secrets are NOT returned in API responses (check Network tab).
- [ ] **Console Logs**: No `console.log` of sensitive data or tokens in Production build.
