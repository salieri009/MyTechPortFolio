---
title: "Breaking Changes & Mitigations"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers", "Frontend Developers", "DevOps Engineers"]
prerequisites: ["Version-History.md"]
related_docs: ["Refactoring-Guide.md", "../GUIDES/API-Versioning.md", "../../docs/CHANGELOG.md"]
maintainer: "Development Team"
---

# Breaking Changes & Mitigations

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document lists backend changes that break backward compatibility, along with migration guidance.

---

## Summary Table

| Version | Area | Breaking Change | Impact | Mitigation |
|---------|------|-----------------|--------|------------|
| 1.0.0 | API | `/api/projects` → `/api/v1/projects` | Frontend must update base path | Update API client base URL or use proxy rewrite |
| 1.0.0 | Auth | JWT required for protected endpoints | Admin portal & private APIs require token | Implement login flow & attach `Authorization: Bearer <token>` |
| 1.0.0 | DTO | `ProjectResponse` split into `ProjectSummaryResponse` & `ProjectDetailResponse` | Clients consuming old response shape break | Update clients to new DTOs; use summary for lists, detail for specifics |
| 1.0.0 | Database | Switched primary storage to MongoDB | Legacy SQL migrations no longer auto-run | Use MongoDB; SQL scripts retained for compatibility only |
| 0.9.0 | Auth | Admin endpoints moved under `/api/v1/admin/**` | Old admin URLs return 404 | Update admin client routes to new prefix |

---

## Detailed Notes

### 1. API Versioned Paths
- **Change**: All REST endpoints now under `/api/v1/`
- **Impact**: Frontend, mobile clients must update base URLs
- **Mitigation**:
  - Update Axios base URL (`/api/v1`)
  - Configure proxy rewrite (`/api -> http://localhost:8080/api/v1`)
  - Use `ApiConstants` for new endpoints when adding code

### 2. JWT Enforcement
- **Change**: Protected endpoints require JWT token
- **Impact**: Admin portal, testing scripts must authenticate
- **Mitigation**:
  - Call `/api/v1/auth/login` to obtain token
  - Store token securely (HTTP-only cookie or memory)
  - Attach `Authorization: Bearer <token>` header
  - Use Postman environment variables for testing

### 3. DTO Restructuring
- **Change**: Single DTO replaced with summary/detail DTOs
- **Impact**: Clients expecting old fields break
- **Mitigation**:
  - For list views, use `ProjectSummaryResponse`
  - For detail views, use `ProjectDetailResponse`
  - Update API docs & TypeScript interfaces

### 4. MongoDB Adoption
- **Change**: MongoDB is now the primary data store
- **Impact**: SQL migrations no longer applied automatically
- **Mitigation**:
  - Ensure MongoDB instance available per environment
  - Update `MONGODB_URI` env var
  - Retain SQL scripts for data export/import if needed

### 5. Admin Route Changes (Legacy)
- **Change**: Admin endpoints moved under `/api/v1/admin/**`
- **Impact**: Old admin clients fail with 404
- **Mitigation**:
  - Update admin client routes/API client
  - Update documentation & Postman collections

---

## Communication Plan

When introducing breaking changes:
1. Update this document & `Version-History.md`
2. Send change summary to frontend/mobile/devops stakeholders
3. Provide migration instructions & timeline
4. Maintain temporary compatibility layer if feasible

---

## Related Documentation

- [Version History](./Version-History.md)
- [Refactoring Guide](./Refactoring-Guide.md)
- [API Versioning Guide](../GUIDES/API-Versioning.md)
- [CHANGELOG](../../docs/CHANGELOG.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

