# Test Cases Documentation Index

> **Document Version**: 1.0.0  
> **Last Updated**: 2025-11-19  
> **Author**: Technical Writing Team (30-year Senior Technical Writer)  
> **Status**: Active

## Overview

This document provides a comprehensive index of all test cases implemented in the MyTechPortfolio project, following Test-Driven Development (TDD) principles and industry best practices. The test suite ensures code quality, reliability, and maintainability across backend services, frontend components, and integration layers.

## Document Structure

This index is organized by test category, following the testing pyramid approach:

```
        /\
       /  \      E2E Tests (Few)
      /____\     
     /      \    Integration Tests (Some)
    /________\   
   /          \  Unit Tests (Many)
  /____________\
```

## Test Categories

### 1. Backend Unit Tests
**Location**: `backend/src/test/java/com/mytechfolio/portfolio/service/`  
**Coverage**: Service layer business logic, validation, and utilities

- [TC-BU-001: ProjectService Unit Tests](./TC-BU-001-ProjectService-Unit-Tests.md)
- [TC-BU-002: AcademicService Unit Tests](./TC-BU-002-AcademicService-Unit-Tests.md)
- [TC-BU-003: ContactService Unit Tests](./TC-BU-003-ContactService-Unit-Tests.md)
- [TC-BU-004: ValidationService Unit Tests](./TC-BU-004-ValidationService-Unit-Tests.md)
- [TC-BU-005: MongoIdValidator Unit Tests](./TC-BU-005-MongoIdValidator-Unit-Tests.md)

### 2. Backend Integration Tests
**Location**: `backend/src/test/java/com/mytechfolio/portfolio/controller/`  
**Coverage**: REST API endpoints, HTTP request/response handling

- [TC-BI-001: ProjectController Integration Tests](./TC-BI-001-ProjectController-Integration-Tests.md)
- [TC-BI-002: AcademicController Integration Tests](./TC-BI-002-AcademicController-Integration-Tests.md)

### 3. Frontend Unit Tests
**Location**: `frontend/src/components/`, `frontend/src/utils/`, `frontend/src/stores/`  
**Coverage**: React components, custom hooks, utility functions, state management

- [TC-FU: Frontend Unit Tests (28 Test Cases)](./TC-FU-Frontend-Unit-Tests.md)

### 4. Frontend-Backend Connectivity Tests
**Location**: `backend/src/test/java/com/mytechfolio/portfolio/integration/`  
**Coverage**: End-to-end connectivity, API communication, CORS, error handling

- [TC-FBC-001: Frontend-Backend Connectivity Tests (20 Test Cases)](./TC-FBC-001-Frontend-Backend-Connectivity-Tests.md)

## Test Execution Summary

### Current Status

| Category | Total Tests | Passed | Failed | Coverage |
|----------|-------------|--------|--------|----------|
| Backend Unit Tests | 15 | 14 | 1 | ~93% |
| Backend Integration Tests | 3 | 3 | 0 | 100% |
| Frontend Unit Tests | 28 | 28 | 0 | ~82% |
| Frontend-Backend Connectivity | 20 | 13 | 7 | 65% |
| **Total** | **66** | **58** | **8** | **~80%** |

### Test Execution Commands

#### Backend Tests
```bash
# Run all backend unit tests
cd backend
./gradlew.bat test --tests "*Test" --tests "!*IntegrationTest" --tests "!*ConnectivityTest"

# Run all integration tests
./gradlew.bat test --tests "*IntegrationTest"

# Run connectivity tests
./gradlew.bat test --tests "*ConnectivityTest"

# Run all backend tests
./gradlew.bat test
```

#### Frontend Tests
```bash
# Run all frontend unit tests
cd frontend
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test Button.test.tsx
```

## Test Coverage Goals

### Unit Tests
- **Target**: 80%+ code coverage
- **Current**: ~93% (exceeding target)
- **Focus Areas**: Business logic, validation, error handling

### Integration Tests
- **Target**: Critical paths covered
- **Current**: 100% of critical endpoints
- **Focus Areas**: API contracts, authentication, authorization

### Connectivity Tests
- **Target**: Main user flows covered
- **Current**: 65% (needs improvement)
- **Focus Areas**: API communication, error handling, CORS

## TDD Workflow Documentation

### Red-Green-Refactor Cycle

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Test Naming Conventions

All tests follow the pattern: `should{ExpectedBehavior}When{Condition}`

Examples:
- `shouldCreateProjectWhenValidRequest()`
- `shouldThrowExceptionWhenProjectNotFound()`
- `shouldReturnEmptyListWhenNoProjectsExist()`

### Test Structure

Each test follows the Given-When-Then structure:

```java
@Test
void shouldCreateProjectWhenValidRequest() {
    // Given - Setup test data and mocks
    ProjectCreateRequest request = new ProjectCreateRequest(...);
    
    // When - Execute the method under test
    ProjectDetailResponse result = projectService.createProject(request);
    
    // Then - Verify the results
    assertThat(result).isNotNull();
    assertThat(result.getTitle()).isEqualTo("Test Project");
    verify(projectRepository).save(any(Project.class));
}
```

## Test Data Management

### Test Fixtures
- Test data builders for consistent test data creation
- Reusable mock objects and fixtures
- Isolated test data per test method

### Test Isolation
- Each test is independent
- No shared state between tests
- Proper cleanup using `@Transactional` or manual cleanup

## Continuous Integration

### Azure Pipelines Integration
- Tests run automatically on every commit
- Test results published to Azure DevOps
- Code coverage reports generated with JaCoCo

### Test Reports
- JUnit XML reports: `backend/build/reports/tests/test/`
- HTML reports: `backend/build/reports/tests/test/index.html`
- Coverage reports: `backend/build/reports/jacoco/test/html/`

## Maintenance Guidelines

### When to Update Tests
1. **New Features**: Add tests before implementing (TDD)
2. **Bug Fixes**: Add regression tests for bugs
3. **Refactoring**: Update tests to reflect new structure
4. **API Changes**: Update integration tests for API contract changes

### Test Maintenance Best Practices
1. Keep tests simple and focused
2. One assertion per test concept
3. Use descriptive test names
4. Remove obsolete tests
5. Update tests when requirements change

## Related Documentation

- [Azure Pipeline Management](./AZURE_PIPELINE_MANAGEMENT.md)
- [Testing Patterns](../../backend/docs/PATTERNS/Testing-Patterns.md)
- [Service Patterns](../../backend/docs/PATTERNS/Service-Patterns.md)
- [Controller Patterns](../../backend/docs/PATTERNS/Controller-Patterns.md)
- [Repository Patterns](../../backend/docs/PATTERNS/Repository-Patterns.md)

## Document Maintenance

**Last Updated**: 2025-11-19  
**Next Review**: 2025-12-19  
**Maintained By**: Development Team  
**Status**: Active

---

## Quick Links

### By Test Type
- [All Unit Tests](#1-backend-unit-tests)
- [All Integration Tests](#2-backend-integration-tests)
- [All Connectivity Tests](#3-frontend-backend-connectivity-tests)

### By Component
- [Project Service Tests](./TC-BU-001-ProjectService-Unit-Tests.md)
- [Academic Service Tests](./TC-BU-002-AcademicService-Unit-Tests.md)
- [Contact Service Tests](./TC-BU-003-ContactService-Unit-Tests.md)
- [Validation Tests](./TC-BU-004-ValidationService-Unit-Tests.md)
- [MongoDB ID Validator Tests](./TC-BU-005-MongoIdValidator-Unit-Tests.md)
- [Project API Tests](./TC-BI-001-ProjectController-Integration-Tests.md)
- [Academic API Tests](./TC-BI-002-AcademicController-Integration-Tests.md)
- [Frontend Unit Tests](./TC-FU-Frontend-Unit-Tests.md)
- [Connectivity Tests](./TC-FBC-001-Frontend-Backend-Connectivity-Tests.md)

---

**Note**: This index is automatically maintained. When new test cases are added, update this document accordingly.

