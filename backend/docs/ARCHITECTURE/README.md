---
title: "Backend Architecture Documentation"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers", "Architects"]
prerequisites: ["../README.md"]
related_docs: ["../../docs/ADR/README.md", "../../docs/Architecture/Backend-Refactoring.md"]
maintainer: "Development Team"
---

# Backend Architecture Documentation

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This directory contains comprehensive architecture documentation for the MyTechPortfolio backend application, including design decisions, system structure, and architectural patterns.

---

## 📚 Available Documents

| Document | Description | Status |
|----------|-------------|--------|
| [Design Decisions](./Design-Decisions.md) | ADR-style architectural decision records | ✅ Complete |
| [Package Organization](./Package-Organization.md) | Package structure and organization rationale | ⏳ In Progress |
| [Layered Architecture](./Layered-Architecture.md) | Controller-Service-Repository pattern | ⏳ In Progress |
| [Domain Model](./Domain-Model.md) | Domain entities and relationships | ⏳ Planned |
| [Security Architecture](./Security-Architecture.md) | JWT, authentication, authorization | ⏳ Planned |
| [Database Architecture](./Database-Architecture.md) | MongoDB schema design | ⏳ Planned |
| [API Design](./API-Design.md) | REST API design principles | ⏳ Planned |
| [Performance Architecture](./Performance-Architecture.md) | Caching, monitoring, optimization | ⏳ Planned |

---

## 🏗️ System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              http://localhost:5173                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     │ JWT Authentication
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Spring Boot)                       │
│              http://localhost:8080                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Controller  │→ │   Service    │→ │  Repository  │ │
│  │    Layer     │  │    Layer     │  │    Layer     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │         │
│         └──────────────────┴──────────────────┘         │
│                         │                               │
│                    Domain Layer                         │
└─────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Database                            │
│              mongodb://localhost:27017/portfolio         │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21
- **Database**: MongoDB
- **Build Tool**: Gradle
- **Security**: Spring Security + JWT
- **API Documentation**: SpringDoc OpenAPI

### Key Architectural Decisions

1. **[Spring Boot Framework](../../../docs/ADR/ADR-006-Spring-Boot-Framework.md)** - Enterprise-grade Java framework
2. **[MongoDB Database](../../../docs/ADR/ADR-007-MongoDB-Database.md)** - Flexible document database
3. **[Layered Architecture](../../../docs/ADR/ADR-008-Layered-Architecture.md)** - Controller-Service-Repository pattern

---

## 📖 Quick Navigation

### For New Developers
1. Start with [Design Decisions](./Design-Decisions.md) to understand why decisions were made
2. Read [Layered Architecture](./Layered-Architecture.md) to understand the structure
3. Review [Package Organization](./Package-Organization.md) to navigate the codebase

### For Architects
1. [Design Decisions](./Design-Decisions.md) - All architectural decisions
2. [Domain Model](./Domain-Model.md) - Entity relationships
3. [Security Architecture](./Security-Architecture.md) - Security design

### For Developers
1. [Layered Architecture](./Layered-Architecture.md) - How layers work
2. [Package Organization](./Package-Organization.md) - Where to find code
3. [API Design](./API-Design.md) - API conventions

---

## 🔗 Related Documentation

- [Backend Documentation Plan](../BACKEND_DOCUMENTATION_PLAN.md)
- [Architectural Decision Records](../../../docs/ADR/README.md)
- [Backend Refactoring Summary](../../../docs/Architecture/Backend-Refactoring.md)
- [API Specification](../../../docs/Specifications/API-Specification.md)
- [Database Specification](../../../docs/Specifications/Database-Specification.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active Development

