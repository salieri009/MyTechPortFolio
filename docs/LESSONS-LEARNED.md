# 🛠️ Lessons Learned & Troubleshooting

> **Project**: MyTechPortfolio  
> **Last Updated**: 2025-12-19

This document records key challenges encountered during project development, their solutions, and lessons learned.

---

## 📋 Table of Contents

- [Infrastructure & DevOps](#-infrastructure--devops)
- [Backend Development](#-backend-development)
- [Frontend Development](#-frontend-development)
- [CI/CD Pipeline](#-cicd-pipeline)

---

## 🏗️ Infrastructure & DevOps

### Issue #1: K8s Ingress CORS Problem

**Problem**: CORS errors occurred when Frontend and Backend were separated into different Services

**Solution**: Unified via Path-based Routing
```yaml
# k8s/all-in-one.yaml
spec:
  rules:
  - host: portfolio.example.com
    http:
      paths:
      - path: /api
        backend:
          service:
            name: backend-service
      - path: /
        backend:
          service:
            name: frontend-service
```

**Lesson**: Using path-based routing in K8s Ingress allows API calls on the same domain without CORS configuration

---

### Issue #2: Pod Security Context Configuration

**Problem**: Security warnings when containers ran as root

**Solution**: Run as non-root user
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  fsGroup: 1001
```

**Lesson**: Always configure non-root user for production K8s deployments

---

## ⚙️ Backend Development

### Issue #3: Migration from JPA to MongoDB

**Problem**: Initial design was JPA/MySQL but needed to change to MongoDB

**Solution**:
- `@Entity` → `@Document`
- `JpaRepository` → `MongoRepository`
- SQL Schema → JavaScript Document Model

**Lessons**: 
- Document-based DBs are flexible for schema changes, but documentation updates are easily missed
- Full documentation verification is required after migration

---

### Issue #4: JWT + OAuth2 Token Management

**Problem**: Authentication confusion due to mixing Google OAuth ID Token and Application JWT

**Solution**:
```
Google OAuth → ID Token → Backend Verification → Application JWT Issued
                                                        ↓
                                                  Client uses JWT
```

**Lesson**: Clearly separate OAuth Provider Token and Application Token roles

---

## 🎨 Frontend Development

### Issue #5: Mock Data to Real API Transition

**Problem**: Mock data logic was tightly coupled to components

**Solution**: Service Layer Abstraction
```typescript
// apiClient.ts - Branch by environment variable
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) return '/api'
  return import.meta.env.VITE_API_BASE_URL || '/api'
}
```

**Lesson**: Separating Service Layer from the start makes Mock↔Real transition smooth

---

### Issue #6: Styled Components Theme TypeScript Types

**Problem**: No autocomplete due to missing TypeScript types for theme object

**Solution**: Extend `styled.d.ts`
```typescript
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: { primary: string; ... }
    // ...
  }
}
```

**Lesson**: Theme type declaration is essential for initial setup when using CSS-in-JS

---

## 🔄 CI/CD Pipeline

### Issue #7: Azure Pipelines vs GitHub Actions Selection

**Problem**: Needed to support both platforms

**Solution**: Maintain dual pipelines
- `azure-pipelines.yml` - For Azure DevOps organization
- `.github/workflows/deploy-aks.yml` - For GitHub repository

**Lessons**: 
- Same result pipelines have significant syntax differences
- Minimize duplication through template reuse

---

### Issue #8: Docker Build Cache Optimization

**Problem**: Docker build time was too long in CI

**Solution**: Multi-stage build + Layer caching
```dockerfile
# Backend Dockerfile
FROM gradle:8-jdk21 AS builder
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon  # Cache dependencies first

COPY src ./src
RUN gradle bootJar --no-daemon
```

**Lesson**: Caching dependency layers first reduces build time by 50%+

---

## 📊 Key Metrics Improvements

| Item | Before | After | Improvement |
|------|--------|-------|-------------|
| Docker Build Time | ~8min | ~3min | -62% |
| CI Pipeline Total | ~15min | ~8min | -47% |
| Cold Start (Backend) | ~45s | ~25s | -44% |

---

## 🎯 Conclusion: Top 5 Key Lessons

1. **Infrastructure as Code is essential** - Manage K8s manifests and Pipelines as code
2. **Design environment separation early** - Structure that makes Mock/Dev/Prod transition easy
3. **Synchronize documentation** - Update docs when code changes
4. **Default security settings** - Non-root, Secret management, Trivy scan
5. **Dual CI/CD** - Support both Azure + GitHub for flexibility

---

*This document is continuously updated as the project progresses.*
