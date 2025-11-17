---
title: "Refactoring Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers", "Architects"]
prerequisites: ["../ARCHITECTURE/Layered-Architecture.md"]
related_docs: ["Breaking-Changes.md", "../GUIDES/Adding-New-Domain.md"]
maintainer: "Development Team"
---

# Refactoring Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

Use this guide when performing structural refactors (package reorganization, service decomposition, architecture changes) in the backend codebase.

---

## Refactoring Principles

1. **Single Responsibility**: Each refactor should target one concern (e.g., move DTOs, rename packages)
2. **Backward Compatibility**: Avoid breaking APIs unless coordinated via `Breaking-Changes.md`
3. **Small Steps**: Break big refactors into commits/PRs under 400 LOC when possible
4. **Comprehensive Tests**: Run unit + integration tests after each major change
5. **Documentation First**: Update docs/diagrams before or alongside code

---

## Standard Refactor Workflow

1. **Plan**
   - Define scope (e.g., "split `ProjectService` into smaller services")
   - Identify affected areas (controllers, DTOs, tests)
   - Update `BREAKING-CHANGES.md` if public API changes

2. **Prepare**
   - Create feature branch (`refactor/project-service`)
   - Add TODOs or design notes if needed

3. **Execute**
   - Move/rename packages using IDE refactor tools
   - Keep commit history clean (one logical change per commit)
   - Update imports, tests, configuration

4. **Verify**
   - Run `./gradlew clean test`
   - Run integration tests (`@SpringBootTest` / MockMvc)
   - Manually test critical endpoints if needed

5. **Document**
   - Update related documentation (architecture diagrams, guides)
   - Update `Version-History.md` if release-worthy
   - Communicate change to team (Slack, PR description)

---

## Common Refactor Scenarios

### 1. Moving Entities/DTOs
- Use IDE rename/move
- Update package imports everywhere
- Run unit tests for impacted modules

### 2. Splitting Services
- Extract new service class
- Move relevant methods + tests
- Update controllers to call new service
- Mark old service methods as deprecated (temporary) if necessary

### 3. Changing DTO Structure
- Introduce new DTO alongside old one
- Update mapper + service logic
- Communicate change to frontend team
- Update tests + documentation
- Remove deprecated DTO once clients migrate

### 4. Renaming Endpoints
- Update `ApiConstants` first
- Add temporary redirects (if possible)
- Update frontend/mobile clients
- Document in `Breaking-Changes.md`

### 5. Package Renames
- Use IDE-safe rename (Refactor > Rename)
- Ensure package-info.java updated if present
- Run `./gradlew spotlessApply` if using formatter

---

## Tooling & Automation

- **IDE Refactors**: IntelliJ IDEA > Refactor > Rename/Move
- **Spotless/Formatters**: `./gradlew spotlessApply` (if configured)
- **Tests**: `./gradlew clean test`
- **CI**: Ensure CI pipeline runs after large refactor PRs

---

## Post-Refactor Checklist

- [ ] All tests pass (`./gradlew clean test`)
- [ ] Documentation updated (Architecture, Guides, Patterns)
- [ ] API clients notified (if necessary)
- [ ] Feature flags removed (if used)
- [ ] Breaking changes documented
- [ ] Branch merged & deleted after review

---

## Related Documentation

- [Breaking Changes](./Breaking-Changes.md)
- [Version History](./Version-History.md)
- [Adding New Domain Guide](../GUIDES/Adding-New-Domain.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

