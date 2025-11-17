---
title: "Development Setup"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers"]
prerequisites: ["../README.md"]
related_docs: ["First-Day-Guide.md", "../GUIDES/Testing-Guide.md"]
maintainer: "Development Team"
---

# Development Setup

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

Follow this guide to set up your local environment for backend development.

---

## 1. System Requirements

| Component | Recommended Version |
|-----------|---------------------|
| OS | macOS 13+, Windows 11, Ubuntu 22.04 |
| Java | Temurin/OpenJDK 21 |
| Gradle | 8.x (wrapper included) |
| Node.js | 20+ (for running frontend alongside) |
| Docker | 24+ (optional but recommended) |
| MongoDB | 6.x+ (local or cloud) |

---

## 2. Clone Repository

```bash
git clone git@github.com:salieri009/MyPortFolio.git
cd MyPortFolio
```

---

## 3. Java & IDE Setup

1. Install **Temurin JDK 21** via SDKMAN, Homebrew, or official installer.
2. Configure IDE (IntelliJ IDEA recommended):
   - Set Project SDK to Java 21
   - Enable Lombok plugin
   - Enable annotation processing
   - Import Gradle project using wrapper

---

## 4. MongoDB Setup

### Option A: Local Install
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start server:
  ```bash
  mongod --dbpath ~/data/mongodb
  ```

### Option B: Docker
```bash
docker run -d --name mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  mongo:7
```

### Option C: MongoDB Atlas
- Create free cluster
- Whitelist IP or use VPC peering
- Set `MONGODB_URI` accordingly

---

## 5. Environment Variables

Create `.env` (or export variables) with:

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

Use `direnv`, `doppler`, or IDE run configurations to load env vars.

---

## 6. Run Backend Locally

```bash
# From repository root
cd backend

# Clean & run tests
./gradlew clean test

# Run dev profile
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun

# Alternatively, run built JAR
SPRING_PROFILES_ACTIVE=dev java -jar build/libs/*-SNAPSHOT.jar
```

> Health check: `curl http://localhost:8080/api/actuator/health`

---

## 7. Run Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server proxies `/api` → `http://localhost:8080/api/v1`.

---

## 8. Testing & Tooling

- Unit/Integration tests: `./gradlew clean test`
- Static analysis (if enabled): `./gradlew check`
- API docs: `http://localhost:8080/swagger-ui.html`
- Postman collection: request from team or import from `/postman`

---

## 9. Troubleshooting

| Issue | Resolution |
|-------|------------|
| `Cannot find symbol lombok` | Ensure Lombok plugin & annotation processing enabled |
| `MongoDB connection refused` | Verify `mongod` running and URI correct |
| `Port 8080 in use` | Stop conflicting service or set `SERVER_PORT=8081` |
| `JWT secret missing` | Set `JWT_SECRET` env var |
| `CORS errors` | Verify `cors.allowed-origins` includes frontend host |

---

## 10. Helpful Commands

```bash
# Format code (if Spotless configured)
./gradlew spotlessApply

# Tail application logs
tail -f backend/build/server.log

# Clean Gradle cache (if issues)
./gradlew --stop && rm -rf ~/.gradle/caches
```

---

**Need help?** Ask in `#backend-help` or contact your mentor.

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

