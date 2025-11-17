---
title: "Backend Deployment Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["DevOps Engineers", "Backend Developers"]
prerequisites: ["./Security-Implementation.md", "../BACKEND_DOCUMENTATION_PLAN.md"]
related_docs: ["../PATTERNS/Security-Patterns.md", "./Database-Migrations.md"]
maintainer: "Development Team"
---

# Backend Deployment Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide covers how to build and deploy the MyTechPortfolio backend application in development, staging, and production environments.

---

## 1. Build Artifacts

### Requirements
- Java 21 (Temurin recommended)
- Gradle 8.x (wrapper included)
- Docker (optional, for container deployment)
- MongoDB (managed service or self-hosted)

### Build Commands

```bash
# Clean and run unit tests
./gradlew clean test

# Build executable JAR
./gradlew bootJar

# Build Docker image
docker build -t myportfolio-backend:latest backend/
```

JAR output: `backend/build/libs/mytechportfolio-backend-<version>.jar`

---

## 2. Environment Configuration

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod`, `stage`, or `dev` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret (min 32 chars) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins (`https://salieri009.studio`) |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP configuration |
| `EMAIL_FROM`, `EMAIL_OWNER` | Email metadata |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth credentials |
| `SPRING_MAIL_*` | Email configuration overrides |
| `SPRING_SERVER_PORT` | Optional (default 8080) |

### Sample `.env` (development only)

```env
SPRING_PROFILES_ACTIVE=dev
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=local-dev-secret-change-me
CORS_ALLOWED_ORIGINS=http://localhost:5173
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=dev@example.com
MAIL_PASSWORD=dev-password
EMAIL_FROM=noreply@example.com
EMAIL_OWNER=owner@example.com
```

> **Never commit `.env` files or production secrets**.

---

## 3. Running Locally

### 1. Start MongoDB

- Option A: Local install `mongod --dbpath <path>`
- Option B: Docker  
  ```bash
  docker run -d --name mongo \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=root \
    -e MONGO_INITDB_ROOT_PASSWORD=secret \
    mongo:7
  ```

### 2. Run Backend

```bash
# Development profile (hot reload with Spring DevTools if enabled)
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun

# Production-like run
SPRING_PROFILES_ACTIVE=prod java -jar build/libs/*-SNAPSHOT.jar
```

---

## 4. Docker Deployment

### Build & Run

```bash
# Build image
docker build -t registry.example.com/myportfolio/backend:1.0.0 backend/

# Run container
docker run -d --name backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e MONGODB_URI=mongodb://mongodb:27017/portfolio \
  -e JWT_SECRET=${JWT_SECRET} \
  -e CORS_ALLOWED_ORIGINS=https://salieri009.studio \
  registry.example.com/myportfolio/backend:1.0.0
```

### Dockerfile Highlights
- Multi-stage build (Gradle builder + Temurin JRE)
- Non-root user (`appuser`)
- Health check (`/api/actuator/health`)
- JVM tuning via `JAVA_OPTS`

---

## 5. Reverse Proxy (Nginx Example)

```nginx
server {
    listen 80;
    server_name api.myportfolio.com;

    location / {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

Use Certbot/Let’s Encrypt or managed certificates for HTTPS.

---

## 6. Deployment Checklist

### Before Deployment
- [ ] All unit/integration tests pass (`./gradlew clean test`)
- [ ] Linting/static analysis (if configured)
- [ ] Update `CHANGELOG.md`
- [ ] Tag release in Git (`git tag v1.0.0 && git push origin v1.0.0`)

### Deployment Steps
1. Build artifact or Docker image
2. Upload to artifact registry (e.g., AWS ECR, GitHub Packages)
3. Update environment variables/secrets
4. Apply database migrations (if using SQL mode)
5. Deploy container or start service
6. Verify health endpoint (`/api/actuator/health`)
7. Run smoke tests (basic API calls)

### Post-Deployment
- [ ] Monitor logs/metrics for anomalies
- [ ] Verify user flows (login, CRUD operations)
- [ ] Update incident/runbook if issues found

---

## 7. Monitoring & Logging

- **Health Check**: `/api/actuator/health`
- **Metrics**: Integrate Spring Actuator metrics (optionally with Prometheus)
- **Logging**:
  - Use structured logging (`requestId` included via `LoggingConfig`)
  - Stream logs to centralized system (ELK, CloudWatch, etc.)
  - Mask sensitive data before logging

---

## Rollback Strategy

1. Keep previous version image/JAR available
2. Re-deploy previous version using same environment variables
3. Restore database snapshot if schema-breaking changes occurred
4. Communicate rollback to stakeholders

---

## Related Documentation

- [Security Implementation](./Security-Implementation.md)
- [Database Migrations](./Database-Migrations.md)
- [Testing Guide](./Testing-Guide.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

