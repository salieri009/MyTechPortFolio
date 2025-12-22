---
title: "Upgrade Guides"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers", "DevOps Engineers"]
prerequisites: ["Version-History.md"]
related_docs: ["Refactoring-Guide.md", "../GUIDES/Deployment-Guide.md"]
maintainer: "Development Team"
---

# Upgrade Guides

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document provides checklists and procedures for upgrading major dependencies (Spring Boot, Java, MongoDB, Docker base image) in the backend application.

---

## General Upgrade Checklist

1. **Create Upgrade Branch**
   - Name: `upgrade/<dependency>-<version>`
2. **Update Dependency**
   - Modify `build.gradle`, Dockerfile, or configuration files
3. **Review Release Notes**
   - Highlight breaking changes or deprecated APIs
4. **Run Tests**
   - `./gradlew clean test`
   - Run integration tests & smoke tests
5. **Update Documentation**
   - `Version-History.md`
   - `Breaking-Changes.md` (if needed)
   - `Deployment-Guide.md`
6. **Coordinate Release**
   - Communicate with frontend/devops teams
   - Deploy to staging first

---

## Spring Boot Upgrade

### Steps
1. Update `build.gradle`:
   ```gradle
   id 'org.springframework.boot' version '3.3.4'
   ```
2. Upgrade plugin:
   ```gradle
   id 'io.spring.dependency-management' version '1.1.6'
   ```
3. Run dependency insight if conflicts arise:
   ```bash
   ./gradlew dependencyInsight --dependency spring-boot-starter
   ```
4. Run tests + start app locally
5. Update Docker image (ensure compatibility with Java version)

### Common Issues
- Deprecated configuration properties → check `spring-configuration-metadata.json`
- Security config changes → adjust `SecurityFilterChain`
- Actuator endpoint paths → verify `/actuator/health`

---

## Java Version Upgrade

### Steps
1. Update `build.gradle`:
   ```gradle
   java {
       sourceCompatibility = '21'
   }
   ```
2. Update Dockerfile base image (`eclipse-temurin:21-jre-alpine`)
3. Ensure CI/CD environment uses new JDK
4. Run full test suite

### Compatibility Notes
- Check third-party libraries for Java support
- Update IDE/project SDK settings
- Rebuild Docker image to include new JDK

---

## MongoDB Upgrade

### Steps
1. Review MongoDB release notes for breaking changes
2. Update driver version (via Spring Boot BOM)
3. Verify index creation & query compatibility
4. Backup database before upgrade
5. Run smoke tests that cover CRUD operations

### Tips
- Use MongoDB Atlas or managed service for seamless upgrades
- Test migrations in staging environment
- Monitor logs for `MongoCommandException`

---

## Docker Base Image Upgrade

### Steps
1. Update `FROM` lines in `backend/Dockerfile`
2. Rebuild image:
   ```bash
   docker build -t myportfolio-backend:<version> backend/
   ```
3. Scan image for vulnerabilities (Trivy/Grype)
4. Run container locally & run smoke tests

### Security
- Keep base image updated to reduce CVEs
- Use non-root user (already configured)
- Pin image versions to avoid unexpected changes

---

## Testing Requirements

- ✅ Unit Tests (`./gradlew clean test`)
- ✅ Integration Tests (MockMvc / @SpringBootTest)
- ✅ Smoke Tests (manual Postman collection)
- ✅ Performance checks (optional but recommended)

---

## Rollback Strategy

1. Keep previous Docker image / JAR artifact
2. Re-deploy previous version if issues arise
3. Restore database snapshot (if schema changed)
4. Document incident & mitigation steps

---

## Related Documentation

- [Version History](./Version-History.md)
- [Breaking Changes](./Breaking-Changes.md)
- [Deployment Guide](../GUIDES/Deployment-Guide.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

