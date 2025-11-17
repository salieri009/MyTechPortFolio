---
title: "First Day Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["New Backend Developers"]
prerequisites: ["README.md"]
related_docs: ["Development-Setup.md", "../GUIDES/README.md"]
maintainer: "Development Team"
---

# First Day Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

Welcome to the MyTechPortfolio backend team! Complete the checklist below on your first day to get fully onboarded.

---

## ✅ Access & Accounts

- [ ] GitHub access to `MyPortFolio` repository
- [ ] MongoDB (Atlas or local) credentials
- [ ] Password manager entry (JWT secret, SMTP creds) – request from DevOps
- [ ] Access to documentation portal / Notion (if applicable)
- [ ] Add SSH key to GitHub

---

## 🛠 Local Environment Setup

1. **Clone repository**
   ```bash
   git clone git@github.com:salieri009/MyPortFolio.git
   cd MyPortFolio
   ```
2. **Install required tools**
   - Java 21 (Temurin)
   - Gradle (wrapper bundled)
   - Docker (optional)
   - MongoDB (local or Docker)
   - IDE (IntelliJ IDEA recommended)
3. **Copy `.env.example` → `.env`** (or request environment variables)
4. **Start MongoDB**
   ```bash
   docker run -d --name mongo -p 27017:27017 mongo:7
   ```
5. **Run backend**
   ```bash
   SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun
   ```
6. **Verify health endpoint**
   ```bash
   curl http://localhost:8080/api/actuator/health
   ```

---

## 🔍 Codebase Orientation

- Scan `backend/README.md`
- Review `docs/Architecture/Backend-Refactoring.md`
- Open `backend/src/main/java/com/mytechfolio/portfolio/` and review package structure
- Run tests: `./gradlew clean test`
- Explore API via Postman / Thunder Client (import collection if available)

---

## 🧪 First Contribution

Pick one of the following as your first task:
- Fix a typo in documentation (`docs/` directory)
- Add/Improve a unit test for an existing service
- Triage a low-priority GitHub issue
- Update onboarding docs with missing info

Submit a small pull request with clear description.

---

## 📣 Communication

- Join team Slack/Teams channel
- Attend daily stand-up (share intro + current status)
- Schedule 1:1 with mentor/buddy
- Add short bio to team wiki (optional)

---

**Need help?** Reach out in `#backend-help` Slack channel or tag `@backend-leads`.

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

