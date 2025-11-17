---
title: "Architectural Decision Records (ADR)"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Developers", "Architects"]
prerequisites: ["Architecture/README.md"]
related_docs: ["Architecture/README.md", "Specifications/API-Specification.md"]
maintainer: "Development Team"
---

# Architectural Decision Records (ADR)

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

This directory contains Architectural Decision Records (ADRs) that document major architecture choices, trade-offs, and rationale for the MyTechPortfolio project.

---

## What are ADRs?

ADRs are documents that capture important architectural decisions made along with their context and consequences. They help:

- Understand why certain technologies or patterns were chosen
- Track the evolution of the architecture
- Onboard new team members
- Make informed decisions about future changes

---

## ADR Format

Each ADR follows this structure:

```markdown
# ADR-001: Title

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[The issue motivating this decision]

## Decision
[The change that we're proposing or have agreed to implement]

## Consequences
[What becomes easier or more difficult to do]
```

---

## Available ADRs

| ADR | Title | Status | Description |
|-----|-------|--------|-------------|
| [ADR-001](./ADR-001-React-TypeScript-Stack.md) | React + TypeScript Stack Selection | Accepted | Decision to use React 18+ with TypeScript 5.5+ as the frontend framework |
| [ADR-002](./ADR-002-Zustand-State-Management.md) | Zustand for State Management | Accepted | Decision to use Zustand instead of Redux for state management |
| [ADR-003](./ADR-003-Styled-Components.md) | Styled Components for Styling | Accepted | Decision to use Styled Components for CSS-in-JS styling solution |
| [ADR-004](./ADR-004-Atomic-Design-Pattern.md) | Atomic Design Pattern | Accepted | Decision to organize components using Atomic Design methodology |
| [ADR-005](./ADR-005-React-Router-Routing.md) | React Router v6 Routing Strategy | Accepted | Decision to use React Router v6 with code splitting and lazy loading |
| [ADR-006](./ADR-006-Spring-Boot-Framework.md) | Spring Boot Framework Selection | Accepted | Decision to use Spring Boot 3.3.4 with Java 21 as the backend framework |
| [ADR-007](./ADR-007-MongoDB-Database.md) | MongoDB as Database | Accepted | Decision to use MongoDB instead of relational database for flexible schema |
| [ADR-008](./ADR-008-Layered-Architecture.md) | Layered Architecture Pattern | Accepted | Decision to use Controller-Service-Repository-Domain layered architecture |

### Planned ADRs

The following architectural decisions should be documented as ADRs:

1. **Technology Stack Selection** ✅ (Complete)
   - ✅ React + TypeScript choice (ADR-001)
   - ✅ Zustand for state management (ADR-002)
   - ✅ Styled Components for styling (ADR-003)
   - ✅ React Router v6 for routing (ADR-005)

2. **Architecture Patterns** ✅ (Partially Complete)
   - ✅ Atomic Design Pattern adoption (ADR-004)
   - ⏳ Service layer pattern for API calls
   - ⏳ Component composition strategy

3. **Performance Decisions**
   - ⏳ Code splitting strategy (covered in ADR-005)
   - ⏳ Lazy loading implementation (covered in ADR-005)
   - ⏳ Image optimization approach

4. **State Management** ✅ (Complete)
   - ✅ Zustand over Redux decision (ADR-002)
   - ⏳ Store organization pattern
   - ⏳ Admin vs regular user state separation

### Creating New ADRs

When creating a new ADR:

1. Use the format: `ADR-XXX-Title.md` (e.g., `ADR-001-React-TypeScript-Stack.md`)
2. Follow the ADR format template below
3. Update this README to include the new ADR
4. Link related ADRs together

---

## Related Documentation

- [Architecture Documentation](../Architecture/README.md)
- [API Specification](../Specifications/API-Specification.md)
- [Frontend Architecture](../Architecture/Frontend-Architecture.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team

