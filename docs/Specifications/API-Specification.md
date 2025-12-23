# API Specification (Implementation-Ready)

> **Version**: 1.0.0  
> **Base URL**: `/api/v1`  
> **Last Updated**: 2025-11-15  
> **Status**: Production Ready

## Overview

This document provides a complete, implementation-ready API specification for the MyTechPortfolio backend. All endpoints follow RESTful conventions and return standardized responses.

## Base Configuration

- **Base URL**: `/api/v1`
- **API Version**: `v1` (defined in `ApiConstants.API_BASE_PATH`)
- **Content-Type**: `application/json`
- **Response Format**: Standardized `ApiResponse<T>` envelope
- **Authentication**: JWT Bearer token (for protected endpoints)
- **Documentation**: Swagger UI available at `/swagger-ui.html`

## Response Structure

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "error": null,
  "errorCode": null,
  "errors": null,
  "metadata": {
    "timestamp": "2025-11-15T10:30:00Z",
    "version": "v1",
    "requestId": "optional-request-id"
  }
}
```

### Error Response

```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": "Error message",
  "errorCode": "RESOURCE_NOT_FOUND",
  "errors": {
    "fieldName": "Validation error message"
  },
  "metadata": {
    "timestamp": "2025-11-15T10:30:00Z",
    "version": "v1",
    "requestId": "optional-request-id"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "total": 25,
    "items": [ ... ]
  },
  "message": null,
  "error": null
}
```

## Conventions

### Pagination
- **Parameter**: `page` (1-based, default: 1), `size` (default: 10, max: 100)
- **Response**: `{ page, size, total, items[] }`
- **Constants**: Defined in `ApiConstants` (DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)

### Sorting
- **Parameter**: `sort` in format `field,direction` (e.g., `endDate,DESC`)
- **Default**: `endDate,DESC` (defined in `ApiConstants.DEFAULT_SORT_FIELD`)
- **Directions**: `ASC`, `DESC`

### Filtering
- **Tech Stacks**: Comma-separated values (e.g., `techStacks=React,Spring Boot`)
- **Year**: Integer (e.g., `year=2024`)
- **Semester**: String (e.g., `semester=2024-1`)
- **Type**: String enum (e.g., `type=FRONTEND`)

### Dates
- **Format**: ISO-8601 (YYYY-MM-DD)
- **Example**: `2024-01-15`

### IDs
- **Format**: MongoDB ObjectId (24-character hex string)
- **Example**: `507f1f77bcf86cd799439011`
- **Validation**: Custom `@ValidMongoId` annotation

### Error Codes

Standardized error codes from `ErrorCode` enum:

- **4xx Client Errors**:
  - `VALIDATION_ERROR`: Input validation failed
  - `RESOURCE_NOT_FOUND`: Requested resource not found
  - `DUPLICATE_RESOURCE`: Resource already exists
  - `UNAUTHORIZED`: Authentication required
  - `FORBIDDEN`: Insufficient permissions
  - `BAD_REQUEST`: Invalid request format
  - `INVALID_ID_FORMAT`: Invalid ID format
  - `MISSING_PARAMETER`: Required parameter missing
  - `INVALID_PARAMETER_TYPE`: Invalid parameter type

- **5xx Server Errors**:
  - `INTERNAL_SERVER_ERROR`: Server internal error
  - `DATABASE_ERROR`: Database operation failed
  - `EXTERNAL_SERVICE_ERROR`: External service error

- **Authentication Errors**:
  - `AUTHENTICATION_FAILED`: Authentication failed
  - `TOKEN_EXPIRED`: JWT token expired
  - `TOKEN_INVALID`: Invalid JWT token
  - `INSUFFICIENT_PERMISSIONS`: Insufficient permissions

## Data Schemas

### ProjectSummaryResponse

```typescript
{
  id: string;              // MongoDB ObjectId
  title: string;           // 3-255 characters
  summary: string;         // 10-500 characters
  startDate: string;       // ISO-8601 date
  endDate: string;         // ISO-8601 date
  techStacks: string[];    // Array of tech stack names
  imageUrl?: string;       // Project thumbnail image URL
  isFeatured?: boolean;    // Whether project is featured
}
```

### ProjectDetailResponse

```typescript
{
  id: string;
  title: string;
  summary: string;
  description: string;     // 20-10000 characters, markdown supported
  startDate: string;
  endDate: string;
  githubUrl?: string;      // Valid URL or null
  demoUrl?: string;        // Valid URL or null
  techStacks: string[];    // Array of tech stack names
  relatedAcademics?: string[]; // Array of academic course names
}
```

### ProjectCreateRequest / ProjectUpdateRequest

```typescript
{
  title: string;                    // Required, 3-255 chars
  summary: string;                  // Required, 10-500 chars
  description: string;             // Required, 20-10000 chars
  startDate: string;                // Required, ISO-8601 date
  endDate: string;                  // Required, ISO-8601 date, must be after startDate
  githubUrl?: string;               // Optional, valid URL format
  demoUrl?: string;                 // Optional, valid URL format
  techStackIds: string[];           // Required, 1-20 MongoDB ObjectIds
  academicIds?: string[];           // Optional, 0-10 MongoDB ObjectIds
}
```

**Validation Rules**:
- `@NotBlank` on title, summary, description
- `@Size` constraints on all string fields
- `@ValidDateRange` ensures endDate > startDate
- `@ValidUrl` for githubUrl and demoUrl (allows empty)
- `@ValidMongoIdList` for techStackIds and academicIds

### AcademicResponse

```typescript
{
  id: string;              // MongoDB ObjectId
  name: string;            // Course name
  semester: string;        // e.g., "2024-1", "2학년 1학기"
  grade?: string;          // e.g., "A+", "B"
  description?: string;    // Course description
  relatedProjects?: {      // Only in detail response
    id: string;
    title: string;
  }[];
}
```

### TechStackResponse

```typescript
{
  id: string;              // MongoDB ObjectId
  name: string;            // e.g., "React", "Spring Boot"
  type: string;            // "FRONTEND" | "BACKEND" | "DATABASE" | "DEVOPS" | "OTHER"
}
```

### ContactRequest

```typescript
{
  name: string;            // Required, 2-100 chars
  email: string;          // Required, valid email format, max 255 chars
  company?: string;        // Optional, max 100 chars
  subject?: string;       // Optional, max 100 chars
  message: string;        // Required, 10-2000 chars
  phoneNumber?: string;   // Optional
  linkedInUrl?: string;   // Optional
  jobTitle?: string;      // Optional
  website?: string;       // Honeypot field (should be empty)
  referrer?: string;      // Optional, tracking
  source?: string;        // Optional, "portfolio", "project", "resume"
  projectId?: string;      // Optional, if contacting about specific project
}
```

**Validation Rules**:
- `@NotBlank` on name, email, message
- `@Email` on email
- `@Size` constraints on all fields
- Spam protection via honeypot field and rate limiting

### LoginResponse

```typescript
{
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;       // Seconds until expiration
  requiresTwoFactor?: boolean;
  sessionId?: string;
  userInfo?: {
    id: number;
    email: string;
    displayName: string;
    profileImageUrl?: string;
    role: string;
    twoFactorEnabled: boolean;
  };
}
```

### GoogleLoginRequest

```typescript
{
  googleIdToken: string;   // Required, JWT format, 100-5000 chars
  twoFactorCode?: string;  // Optional, exactly 6 digits
}
```

**Validation Rules**:
- `@NotBlank` on googleIdToken
- `@Pattern` validates JWT format: `^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$`
- `@Size` on twoFactorCode: exactly 6 digits

### Resume

```typescript
{
  id: string;              // MongoDB ObjectId
  version: string;        // "full", "software-engineer", "frontend", etc.
  title: string;           // e.g., "Full Stack Developer Resume"
  description?: string;    // Purpose of this resume version
  fileName: string;        // Original filename
  fileUrl: string;         // Azure Blob Storage URL
  fileType: string;        // "pdf", "docx"
  fileSize?: number;       // Size in bytes
  isActive: boolean;       // Primary resume flag
  isPublic: boolean;       // Downloadable by visitors
  downloadCount: number;  // Number of downloads
  metaDescription?: string;
  keywords?: string;       // Comma-separated
  previousVersionId?: string;
  createdAt: string;      // ISO-8601 datetime
  updatedAt: string;     // ISO-8601 datetime
  lastDownloadedAt?: string; // ISO-8601 datetime
}
```

### ProjectEngagement

```typescript
{
  id: string;              // MongoDB ObjectId
  projectId: string;       // MongoDB ObjectId
  sessionId: string;       // Browser session ID
  visitorId?: string;      // Anonymous or authenticated user ID
  viewDuration?: number;   // Time in seconds
  scrollDepth?: number;    // Percentage 0-100
  githubLinkClicked?: boolean;
  demoLinkClicked?: boolean;
  timesViewed?: number;    // Views in this session
  referrer?: string;       // Referrer URL
  source?: string;         // "direct", "search", "social", "referral"
  userAgent?: string;
  deviceType?: string;     // "mobile", "tablet", "desktop"
  browser?: string;
  country?: string;
  city?: string;
  ipAddress?: string;      // Hashed for privacy
  viewedAt: string;        // ISO-8601 datetime
  lastInteractionAt?: string; // ISO-8601 datetime
}
```

## Endpoints

### Projects API

#### GET `/api/v1/projects`

Get paginated list of projects with filtering and sorting.

**Query Parameters**:
- `page` (int, default: 1, min: 1): Page number
- `size` (int, default: 10, min: 1, max: 100): Page size
- `sort` (string, default: "endDate,DESC"): Sort field and direction
- `techStacks` (string, optional): Comma-separated tech stack names for filtering
- `year` (int, optional): Filter by project year

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "total": 25,
    "items": [ProjectSummaryResponse[]]
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid query parameters

#### GET `/api/v1/projects/{id}`

Get detailed project information.

**Path Parameters**:
- `id` (string, required): MongoDB ObjectId, validated with `@ValidMongoId`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": ProjectDetailResponse
}
```

**Error Responses**:
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Project not found

#### POST `/api/v1/projects`

Create a new project.

**Request Body**: `ProjectCreateRequest`

**Response**: `201 Created`
```json
{
  "success": true,
  "data": ProjectDetailResponse,
  "message": "Project created successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `409 Conflict`: Duplicate resource

#### PUT `/api/v1/projects/{id}`

Update an existing project.

**Path Parameters**:
- `id` (string, required): MongoDB ObjectId

**Request Body**: `ProjectUpdateRequest`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": ProjectDetailResponse,
  "message": "Project updated successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors or invalid ID
- `404 Not Found`: Project not found

#### DELETE `/api/v1/projects/{id}`

Delete a project.

**Path Parameters**:
- `id` (string, required): MongoDB ObjectId

**Response**: `204 No Content`

**Error Responses**:
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Project not found

### Academics API

#### GET `/api/v1/academics`

Get paginated list of academic courses.

**Query Parameters**:
- `page` (int, default: 1, min: 1): Page number
- `size` (int, default: 10, min: 1, max: 100): Page size
- `semester` (string, optional, default: ""): Filter by semester

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "total": 15,
    "items": [AcademicResponse[]]
  }
}
```

#### GET `/api/v1/academics/{id}`

Get detailed academic course information with related projects.

**Path Parameters**:
- `id` (string, required): MongoDB ObjectId, validated with `@ValidMongoId`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": AcademicResponse // Includes relatedProjects
}
```

**Error Responses**:
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Academic course not found

### Tech Stacks API

#### GET `/api/v1/techstacks`

Get list of technology stacks.

**Query Parameters**:
- `type` (string, optional): Filter by type ("FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "OTHER")

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [TechStackResponse[]]
}
```

**Note**: This endpoint is cached for performance.

### Authentication API

#### POST `/api/v1/auth/google`

Authenticate using Google OAuth ID token.

**Request Body**: `GoogleLoginRequest`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": LoginResponse,
  "message": "Login successful"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid token format
- `401 Unauthorized`: Authentication failed

#### POST `/api/v1/auth/github`

Authenticate using GitHub OAuth access token.

**Request Body**: `GitHubLoginRequest`

```typescript
{
  accessToken: string;     // Required, GitHub OAuth access token
  twoFactorCode?: string;  // Optional, exactly 6 digits
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": LoginResponse,
  "message": "Login successful"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid token format
- `401 Unauthorized`: Authentication failed (invalid GitHub token or email not accessible)

#### POST `/api/v1/auth/refresh`

Refresh access token using refresh token.

**Headers**:
- `Authorization: Bearer {refreshToken}`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": LoginResponse,
  "message": "Token refreshed successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid or expired refresh token

#### POST `/api/v1/auth/logout`

Logout and invalidate token.

**Headers**:
- `Authorization: Bearer {accessToken}`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

#### GET `/api/v1/auth/profile`

Get current user profile.

**Headers**:
- `Authorization: Bearer {accessToken}` (optional)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": UserInfo
}
```

**Error Responses**:
- `401 Unauthorized`: Token missing or invalid

### Contact API

#### POST `/api/v1/contact`

Submit contact form with spam protection.

**Request Body**: `ContactRequest`

**Response**: `201 Created`
```json
{
  "success": true,
  "data": null,
  "message": "Thank you for your message. I'll get back to you soon!"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded

**Security Features**:
- Honeypot field validation
- Rate limiting per IP address
- Input sanitization
- Spam detection

### Resumes API

#### GET `/api/v1/resumes`

Get all available resume versions.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [Resume[]]
}
```

#### GET `/api/v1/resumes/primary`

Get the primary (active) resume.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": Resume
}
```

**Error Responses**:
- `404 Not Found`: No active resume found

#### GET `/api/v1/resumes/{id}/download`

Download resume file and track download.

**Path Parameters**:
- `id` (string, required): Resume MongoDB ObjectId

**Response**: `200 OK`
- Content-Type: `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="{fileName}"`
- Body: Binary file content

**Error Responses**:
- `404 Not Found`: Resume not found or file not accessible

#### GET `/api/v1/resumes/statistics`

Get download statistics for all resumes.

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "version1": 150,
    "version2": 75,
    ...
  }
}
```

### Project Engagement API

#### POST `/api/v1/engagement/track`

Track project engagement metrics.

**Request Body**: `ProjectEngagement` (partial, server enriches with IP, user agent)

**Response**: `201 Created`
```json
{
  "success": true,
  "data": ProjectEngagement
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data

#### PATCH `/api/v1/engagement/{engagementId}`

Update engagement with interaction data.

**Path Parameters**:
- `engagementId` (string, required): Engagement MongoDB ObjectId

**Query Parameters**:
- `viewDuration` (long, optional): View duration in seconds
- `scrollDepth` (int, optional): Scroll depth percentage (0-100)
- `githubLinkClicked` (boolean, optional): Whether GitHub link was clicked
- `demoLinkClicked` (boolean, optional): Whether demo link was clicked

**Response**: `200 OK`
```json
{
  "success": true,
  "data": null
}
```

#### GET `/api/v1/engagement/projects/{projectId}/stats`

Get engagement statistics for a specific project.

**Path Parameters**:
- `projectId` (string, required): Project MongoDB ObjectId

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalViews": 150,
    "averageViewDuration": 45,
    "averageScrollDepth": 75,
    "githubClicks": 30,
    "demoClicks": 25,
    "highValueEngagements": 12
  }
}
```

#### GET `/api/v1/engagement/projects/most-engaged`

Get projects with highest engagement scores.

**Query Parameters**:
- `limit` (int, default: 10): Number of projects to return

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "projectId": "507f1f77bcf86cd799439011",
      "projectTitle": "My Tech Portfolio",
      "engagementScore": 85,
      "totalViews": 200,
      "averageViewDuration": 60
    },
    ...
  ]
}
```

## Validation Rules

### Custom Validators

- **@ValidMongoId**: Validates MongoDB ObjectId format (24 hex characters)
- **@ValidMongoIdList**: Validates array of MongoDB ObjectIds with size constraints
- **@ValidUrl**: Validates URL format (allows empty for optional fields)
- **@ValidDateRange**: Ensures endDate is after startDate

### Bean Validation

- **@NotBlank**: Field cannot be null, empty, or whitespace
- **@NotNull**: Field cannot be null
- **@Size**: String length constraints (min, max)
- **@Email**: Valid email format
- **@Min / @Max**: Numeric value constraints
- **@Pattern**: Regex pattern validation

## Security

### CORS Configuration

- **Allowed Origins**: Configurable via `cors.allowed-origins` property
  - Default: `http://localhost:5173`, `http://localhost:3000`, `https://salieri009.studio`
- **Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`
- **Allowed Headers**: `Content-Type`, `Authorization`, `X-Requested-With`
- **Max Age**: 3600 seconds (1 hour)
- **Allow Credentials**: Configurable (default: false)

### Authentication

- **JWT Bearer Token**: Required for protected endpoints
- **Token Format**: `Authorization: Bearer {token}`
- **Token Expiration**: Configurable via `SecurityConstants`
- **Refresh Token**: Long-lived token for obtaining new access tokens

### Rate Limiting

- Contact form: Rate limited per IP address
- All endpoints: Configurable rate limiting (future implementation)

### Input Sanitization

- All user inputs are sanitized using `InputSanitizer`
- XSS prevention via output encoding
- SQL Injection prevention via parameterized queries (MongoDB)

## Error Handling

All errors follow the standardized `ApiResponse` format with appropriate HTTP status codes:

- **400 Bad Request**: Validation errors, invalid parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

Error responses include:
- `errorCode`: Standardized error code from `ErrorCode` enum
- `error`: Human-readable error message
- `errors`: Field-specific validation errors (Map<String, String>)

## Mock Parity

For frontend development, mock functions should:
- Return the same `ApiResponse<T>` envelope structure
- Include `metadata` with timestamp
- Apply pagination, sorting, and filtering client-side
- Return appropriate error responses for error scenarios
- Match exact field names and types from this specification

## Testing

### Health Check

- **Endpoint**: `/actuator/health` (Spring Boot Actuator)
- **Response**: `200 OK` with health status

### Swagger Documentation

- **UI**: `/swagger-ui.html`
- **API Docs**: `/v3/api-docs`
- All endpoints are documented with OpenAPI 3.0 annotations

## Versioning

- Current version: `v1`
- Version is included in base path: `/api/v1`
- Future versions will use `/api/v2`, etc.
- Backward compatibility maintained within major versions
