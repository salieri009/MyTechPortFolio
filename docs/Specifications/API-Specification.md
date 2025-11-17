---
title: "API Specification"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Specification"
audience: ["Developers", "API Consumers"]
prerequisites: ["Getting-Started.md"]
related_docs: ["Database-Specification.md", "Architecture/README.md"]
maintainer: "Development Team"
---

# API Specification

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

This document provides a comprehensive specification for the MyTechPortfolio REST API. All endpoints follow RESTful principles and return JSON responses.

**Base URL**: `/api/v1`

**API Version**: v1

---

## Authentication

### JWT Authentication

Most endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <token>
```

### Public Endpoints

The following endpoints are publicly accessible:
- `GET /api/v1/projects`
- `GET /api/v1/projects/{id}`
- `GET /api/v1/academics`
- `GET /api/v1/academics/{id}`
- `GET /api/v1/techstacks`
- `GET /api/v1/journey-milestones`
- `GET /api/v1/testimonials`
- `GET /actuator/health`

### Admin Endpoints

Admin endpoints require roles: `CONTENT_MANAGER`, `ADMIN`, or `SUPER_ADMIN`

---

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found",
    "details": { ... }
  },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "page": 1,
    "size": 10,
    "totalElements": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## Endpoints

### Projects

#### Get All Projects
- **GET** `/api/v1/projects`
- **Query Parameters**:
  - `page` (default: 1, min: 1)
  - `size` (default: 10, min: 1, max: 100)
  - `sort` (default: "endDate,DESC")
  - `status` (optional: PLANNING, IN_PROGRESS, COMPLETED, ARCHIVED)
  - `isFeatured` (optional: true/false)
- **Response**: `PageResponse<ProjectResponse>`

#### Get Project by ID
- **GET** `/api/v1/projects/{id}`
- **Path Parameters**: `id` (MongoDB ObjectId)
- **Response**: `ProjectResponse`

#### Create Project (Admin)
- **POST** `/api/v1/projects`
- **Auth**: Required (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
- **Request Body**: `ProjectCreateRequest`
- **Response**: `ProjectResponse` (201 Created)

#### Update Project (Admin)
- **PUT** `/api/v1/projects/{id}`
- **Auth**: Required (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
- **Request Body**: `ProjectUpdateRequest`
- **Response**: `ProjectResponse`

#### Delete Project (Admin)
- **DELETE** `/api/v1/projects/{id}`
- **Auth**: Required (CONTENT_MANAGER, ADMIN, SUPER_ADMIN)
- **Response**: 204 No Content

### Academics

#### Get All Academics
- **GET** `/api/v1/academics`
- **Query Parameters**:
  - `page` (default: 1)
  - `size` (default: 10)
  - `semester` (optional filter)
- **Response**: `PageResponse<AcademicResponse>`

#### Get Academic by ID
- **GET** `/api/v1/academics/{id}`
- **Response**: `AcademicResponse`

#### Create Academic (Admin)
- **POST** `/api/v1/academics`
- **Auth**: Required
- **Request Body**: `AcademicCreateRequest`
- **Response**: `AcademicResponse` (201 Created)

#### Update Academic (Admin)
- **PUT** `/api/v1/academics/{id}`
- **Auth**: Required
- **Request Body**: `AcademicUpdateRequest`
- **Response**: `AcademicResponse`

#### Delete Academic (Admin)
- **DELETE** `/api/v1/academics/{id}`
- **Auth**: Required
- **Response**: 204 No Content

### Journey Milestones

#### Get All Milestones
- **GET** `/api/v1/journey-milestones`
- **Response**: `List<JourneyMilestoneResponse>` (ordered by year)

#### Get Milestone by ID
- **GET** `/api/v1/journey-milestones/{id}`
- **Response**: `JourneyMilestoneResponse`

#### Create Milestone (Admin)
- **POST** `/api/v1/journey-milestones`
- **Auth**: Required
- **Request Body**: `JourneyMilestoneCreateRequest`
- **Response**: `JourneyMilestoneResponse` (201 Created)

#### Update Milestone (Admin)
- **PUT** `/api/v1/journey-milestones/{id}`
- **Auth**: Required
- **Request Body**: `JourneyMilestoneUpdateRequest`
- **Response**: `JourneyMilestoneResponse`

#### Delete Milestone (Admin)
- **DELETE** `/api/v1/journey-milestones/{id}`
- **Auth**: Required
- **Response**: 204 No Content

### Tech Stacks

#### Get All Tech Stacks
- **GET** `/api/v1/techstacks`
- **Response**: `List<TechStackResponse>`

### Testimonials

#### Get All Testimonials
- **GET** `/api/v1/testimonials`
- **Response**: `List<TestimonialResponse>`

#### Get Featured Testimonials
- **GET** `/api/v1/testimonials/featured`
- **Response**: `List<TestimonialResponse>`

### Health Check

#### Health Check
- **GET** `/actuator/health`
- **Response**: Health status

---

## Data Models

### ProjectResponse

```json
{
  "id": "string",
  "title": "string",
  "summary": "string",
  "description": "string",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "githubUrl": "string",
  "demoUrl": "string",
  "isFeatured": true,
  "status": "COMPLETED",
  "viewCount": 0,
  "techStackIds": ["string"],
  "relatedAcademicIds": ["string"],
  "createdAt": "2025-01-27T10:00:00Z",
  "updatedAt": "2025-01-27T10:00:00Z"
}
```

### AcademicResponse

```json
{
  "id": "string",
  "subjectCode": "string",
  "name": "string",
  "semester": "string",
  "grade": "HIGH_DISTINCTION",
  "creditPoints": 6,
  "marks": 92,
  "description": "string",
  "status": "COMPLETED",
  "year": 2025,
  "semesterType": "SPRING",
  "createdAt": "2025-01-27T10:00:00Z",
  "updatedAt": "2025-01-27T10:00:00Z"
}
```

### JourneyMilestoneResponse

```json
{
  "id": "string",
  "year": "2025",
  "title": "string",
  "description": "string",
  "icon": "string",
  "techStack": ["string"],
  "status": "COMPLETED",
  "technicalComplexity": 3,
  "projectCount": 5,
  "codeMetrics": {
    "linesOfCode": 10000,
    "commits": 150,
    "repositories": 3
  },
  "keyAchievements": [
    {
      "title": "string",
      "description": "string",
      "impact": "string"
    }
  ],
  "skillProgression": [
    {
      "name": "string",
      "level": 4,
      "category": "FRONTEND"
    }
  ],
  "createdAt": "2025-01-27T10:00:00Z",
  "updatedAt": "2025-01-27T10:00:00Z"
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `RESOURCE_NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_RESOURCE` | 409 | Resource already exists |
| `VALIDATION_FAILED` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `INTERNAL_SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

API rate limiting may be applied to prevent abuse. Check response headers for rate limit information.

---

## CORS

CORS is configured for the following origins:
- `http://localhost:5173`
- `http://localhost:3000`
- `https://salieri009.studio`

---

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## Related Documentation

- [Database Specification](./Database-Specification.md)
- [Architecture Overview](../Architecture/README.md)
- [Getting Started Guide](../Getting-Started.md)

---

**Last Updated**: November 17, 2025  
**Maintained By**: Development Team


