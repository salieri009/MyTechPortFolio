---
title: "Common Pitfalls"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers"]
prerequisites: ["Development-Setup.md"]
related_docs: ["../PATTERNS/README.md", "../GUIDES/Testing-Guide.md"]
maintainer: "Development Team"
---

# Common Pitfalls & How to Avoid Them

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

Learn from past incidents and avoid recurring mistakes when working on the backend codebase.

---

## 1. Missing Environment Variables

**Symptoms**: Application fails to start, `JWT_SECRET` null, email service errors.  
**Fix**: Ensure `.env` or deployment environment provides required variables (see `Development-Setup.md`).

---

## 2. MongoDB Connectivity Issues

**Symptoms**: `com.mongodb.MongoSocketOpenException`, connection refused.  
**Fixes**:
- Verify `mongod` running (`docker ps` or system service)
- Check `MONGODB_URI` (auth, host, port)
- For Docker, ensure network bridging (`--network` or use `host.docker.internal`)

---

## 3. Skipping DTO/Mapper Updates

**Symptoms**: Serialization errors, missing fields in responses.  
**Best Practice**: Whenever you add entity fields:
- Update DTOs
- Update mappers
- Update tests & documentation

---

## 4. Hardcoded Paths / Strings

**Symptoms**: Inconsistent routes, duplicated constants.  
**Fix**: Use `ApiConstants`, `SecurityConstants`, `ResponseUtil`.  
Never hardcode `/api/v1/...` directly in controllers or tests.

---

## 5. Unauthorized Responses in Dev

**Symptoms**: `401 Unauthorized` when calling protected endpoints locally.  
**Fix**:
- Login via `/api/v1/auth/login`
- Add `Authorization: Bearer <token>` header
- Disable token injection only for specific tests (MockMvc with `@WithMockUser`)

---

## 6. CORS Errors

**Symptoms**: Frontend `CORS policy: No 'Access-Control-Allow-Origin' header`.  
**Fix**:
- Update `cors.allowed-origins` in `application.properties` or env var
- Ensure frontend uses same protocol/host/port as configured

---

## 7. Tests Failing Randomly

**Common Causes**:
- Shared test data (not isolated)
- Using real clock/time-sensitive tests
- Relying on external services

**Solutions**:
- Use unique IDs per test
- Mock time (use `Clock` abstraction)
- Mock external dependencies / use Testcontainers

---

## 8. Failing to Update Documentation

**Reminder**: Code changes that affect APIs, architecture, or setup **must** update relevant docs:
- Patterns
- Guides
- Migration/Onboarding
- CHANGELOG

---

## 9. Large PRs / Refactors

**Risk**: Harder to review, higher merge conflict chance.  
**Recommendation**:
- Target <400 LOC per PR
- Split refactors into multiple steps
- Use draft PRs for early feedback

---

## 10. Production Secrets in Logs

**NEVER** log secrets, tokens, or PII.  
When logging, use placeholders (e.g., `log.info("User {} logged in", userId);`).  
Review logs before sharing externally.

---

**Keep this list updated!** If you hit a new issue, document it here to help the next developer.

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

