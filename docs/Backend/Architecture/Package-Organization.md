---
title: "Package Organization"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Reference"
audience: ["Backend Developers", "Architects"]
prerequisites: ["README.md", "Layered-Architecture.md"]
related_docs: ["../../../docs/ADR/ADR-008-Layered-Architecture.md"]
maintainer: "Development Team"
---

# Package Organization

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This document explains the package structure and organization rationale for the MyTechPortfolio backend codebase.

---

## Package Structure

```
com.mytechfolio.portfolio/
├── config/              # Configuration classes
├── constants/           # Application constants
├── controller/          # REST controllers
│   └── base/           # Base controller classes
├── domain/              # Domain entities
│   └── admin/          # Admin domain entities
├── dto/                 # Data Transfer Objects
│   ├── auth/           # Authentication DTOs
│   ├── request/        # Request DTOs
│   └── response/       # Response DTOs
├── exception/          # Custom exceptions
├── filter/             # Servlet filters
├── mapper/             # Entity-DTO mappers
├── repository/         # MongoDB repositories
│   └── admin/         # Admin repositories
├── security/           # Security configuration
│   ├── config/        # Security configuration
│   ├── filter/        # Security filters
│   ├── service/       # Security services
│   └── util/          # Security utilities
├── service/            # Business logic services
│   └── storage/      # Storage services
├── util/               # Utility classes
└── validation/         # Custom validators
```

---

## Package Descriptions

### `config/` - Configuration Classes

**Purpose**: Spring Boot configuration classes and beans.

**Contents**:
- `ApplicationConfig.java` - Application-wide configuration
- `WebConfig.java` - Web configuration (CORS, etc.)
- `MongoConfig.java` - MongoDB configuration
- `SecurityConfig.java` - Security configuration
- `SwaggerConfig.java` - API documentation configuration
- `EmailConfig.java` - Email service configuration
- `LoggingConfig.java` - Logging configuration
- `CacheConfig.java` - Caching configuration
- `PerformanceConfig.java` - Performance monitoring configuration

**Conventions**:
- All classes annotated with `@Configuration`
- Use `@Bean` for bean definitions
- Group related configurations together
- Use `@Profile` for environment-specific configs

### `constants/` - Application Constants

**Purpose**: Centralized constants to avoid magic numbers and strings.

**Contents**:
- `ApiConstants.java` - API paths, versions, pagination defaults
- `SecurityConstants.java` - Security-related constants
- `ErrorCode.java` - Error code definitions

**Conventions**:
- All classes are `final` with private constructor
- Use `public static final` for constants
- Group related constants together
- Document constant purposes

### `controller/` - REST Controllers

**Purpose**: Handle HTTP requests and responses.

**Contents**:
- `ProjectController.java` - Project endpoints
- `AcademicController.java` - Academic endpoints
- `JourneyMilestoneController.java` - Journey milestone endpoints
- `ContactController.java` - Contact form endpoints
- `AuthController.java` - Authentication endpoints
- `base/AbstractCrudController.java` - Base CRUD controller
- `base/BaseController.java` - Base controller interface

**Conventions**:
- All classes annotated with `@RestController`
- Use `@RequestMapping` for base paths
- Extend base controllers when possible
- Keep controllers thin (delegate to services)
- Use constants for endpoint paths

### `domain/` - Domain Entities

**Purpose**: Domain entities representing business concepts.

**Contents**:
- `Project.java` - Project entity
- `Academic.java` - Academic record entity
- `JourneyMilestone.java` - Journey milestone entity
- `Contact.java` - Contact form entity
- `TechStack.java` - Tech stack entity
- `Testimonial.java` - Testimonial entity
- `Resume.java` - Resume entity
- `User.java` - User entity
- `admin/AdminUser.java` - Admin user entity
- `admin/AdminRole.java` - Admin role entity

**Conventions**:
- Annotate with `@Document(collection = "...")`
- Use `@Id` for MongoDB ID
- Use `@Indexed` for frequently queried fields
- Use Lombok annotations (`@Data`, `@Builder`, etc.)
- Keep entities focused on data structure

### `dto/` - Data Transfer Objects

**Purpose**: Objects for transferring data between layers.

**Structure**:
```
dto/
├── auth/              # Authentication DTOs
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   └── GoogleLoginRequest.java
├── request/           # Request DTOs
│   ├── ProjectCreateRequest.java
│   ├── ProjectUpdateRequest.java
│   └── ...
└── response/         # Response DTOs
    ├── ProjectResponse.java
    ├── ApiResponse.java
    └── ...
```

**Conventions**:
- Separate request and response DTOs
- Use descriptive names (e.g., `ProjectCreateRequest`)
- Include validation annotations
- Use immutable DTOs when possible
- Document DTO fields

### `exception/` - Custom Exceptions

**Purpose**: Custom exception classes for error handling.

**Contents**:
- `ResourceNotFoundException.java` - Resource not found (404)
- `DuplicateResourceException.java` - Duplicate resource (409)
- `GlobalExceptionHandler.java` - Global exception handler

**Conventions**:
- Extend appropriate base exceptions
- Include error codes
- Provide meaningful messages
- Use `@RestControllerAdvice` for global handler

### `filter/` - Servlet Filters

**Purpose**: HTTP request/response filters.

**Contents**:
- `PerformanceMonitoringFilter.java` - Performance monitoring

**Conventions**:
- Extend `OncePerRequestFilter` or implement `Filter`
- Use `@Component` or `@Configuration`
- Document filter purpose and order

### `mapper/` - Entity-DTO Mappers

**Purpose**: Convert between entities and DTOs.

**Contents**:
- `ProjectMapper.java` - Project entity-DTO mapping
- `AcademicMapper.java` - Academic entity-DTO mapping
- `Mapper.java` - Base mapper interface
- `EntityMapper.java` - Entity mapper interface

**Conventions**:
- Use interface-based mappers
- Implement base mapper interface
- Provide entity-to-DTO and DTO-to-entity methods
- Handle null values gracefully

### `repository/` - MongoDB Repositories

**Purpose**: Data access layer for MongoDB.

**Contents**:
- `ProjectRepository.java` - Project data access
- `AcademicRepository.java` - Academic data access
- `JourneyMilestoneRepository.java` - Journey milestone data access
- `admin/AdminUserRepository.java` - Admin user data access

**Conventions**:
- Extend `MongoRepository<Entity, String>`
- Use Spring Data query methods
- Add custom queries when needed
- Document complex queries

### `security/` - Security Configuration

**Purpose**: Security-related classes.

**Structure**:
```
security/
├── config/           # Security configuration
│   ├── SecurityConfig.java
│   └── SecurityConfigNew.java
├── filter/           # Security filters
│   └── JwtAuthenticationFilter.java
├── service/          # Security services
│   ├── CustomUserDetailsService.java
│   └── GoogleOAuthService.java
├── util/             # Security utilities
│   ├── JwtUtil.java
│   └── TwoFactorAuthUtil.java
└── dto/              # Security DTOs
```

**Conventions**:
- Keep security code isolated
- Use Spring Security annotations
- Document security configurations
- Follow security best practices

### `service/` - Business Logic Services

**Purpose**: Business logic and orchestration.

**Contents**:
- `ProjectService.java` - Project business logic
- `AcademicService.java` - Academic business logic
- `JourneyMilestoneService.java` - Journey milestone business logic
- `BaseService.java` - Base service interface
- `BaseServiceImpl.java` - Base service implementation
- `EmailService.java` - Email service
- `storage/StorageService.java` - Storage service interface
- `storage/LocalStorageService.java` - Local storage implementation

**Conventions**:
- Annotate with `@Service`
- Implement base service interface when possible
- Keep business logic in services, not controllers
- Use transactions when needed
- Document service methods

### `util/` - Utility Classes

**Purpose**: Reusable utility functions.

**Contents**:
- `ResponseUtil.java` - Response formatting utilities
- `PaginationUtil.java` - Pagination utilities
- `DateUtil.java` - Date utilities
- `StringUtil.java` - String utilities
- `InputSanitizer.java` - Input sanitization
- `PerformanceMetrics.java` - Performance metrics

**Conventions**:
- All classes are `final` with private constructor
- Use `public static` methods
- Keep utilities focused and single-purpose
- Document utility methods

### `validation/` - Custom Validators

**Purpose**: Custom validation logic.

**Contents**:
- `MongoIdValidator.java` - MongoDB ID validation
- `MongoIdListValidator.java` - MongoDB ID list validation
- `UrlValidator.java` - URL validation
- `DateRangeValidator.java` - Date range validation
- `ValidationService.java` - Validation service
- `ValidMongoId.java` - MongoDB ID annotation
- `ValidUrl.java` - URL annotation
- `ValidDateRange.java` - Date range annotation

**Conventions**:
- Implement `ConstraintValidator`
- Create corresponding annotation
- Provide clear error messages
- Document validation rules

---

## Package Organization Principles

### 1. Layer-Based Organization

Packages are organized by architectural layers:
- **Presentation Layer**: `controller/`
- **Business Layer**: `service/`
- **Data Access Layer**: `repository/`
- **Domain Layer**: `domain/`

### 2. Feature-Based Subpackages

Some packages have feature-based subpackages:
- `domain/admin/` - Admin-related entities
- `dto/auth/` - Authentication DTOs
- `security/config/` - Security configuration

### 3. Cross-Cutting Concerns

Cross-cutting concerns are in dedicated packages:
- `config/` - Configuration
- `exception/` - Exception handling
- `util/` - Utilities
- `validation/` - Validation

### 4. Naming Conventions

- **Packages**: lowercase, singular nouns
- **Classes**: PascalCase, descriptive names
- **Interfaces**: Start with `I` or descriptive name (e.g., `BaseService`)
- **Abstract Classes**: Start with `Abstract` (e.g., `AbstractCrudController`)

---

## Adding New Packages

### When to Create a New Package

1. **New Layer**: When adding a new architectural layer
2. **Feature Grouping**: When grouping related features
3. **Cross-Cutting Concern**: When adding a new cross-cutting concern
4. **Third-Party Integration**: When integrating a new third-party library

### Package Creation Guidelines

1. **Follow Existing Structure**: Maintain consistency
2. **Document Purpose**: Add package description
3. **Update This Document**: Update package organization docs
4. **Consider Dependencies**: Ensure proper dependency flow

---

## Dependency Rules

### Allowed Dependencies

```
controller → service → repository → domain
     ↓         ↓          ↓
   dto      dto       domain
     ↓         ↓
  mapper    mapper
```

### Dependency Rules

1. **Controllers** can depend on:
   - Services
   - DTOs
   - Mappers
   - Constants
   - Exceptions

2. **Services** can depend on:
   - Repositories
   - Domain entities
   - DTOs
   - Mappers
   - Utilities
   - Other services

3. **Repositories** can depend on:
   - Domain entities
   - Spring Data MongoDB

4. **Domain** should have minimal dependencies:
   - Only framework annotations (MongoDB, Lombok)

### Forbidden Dependencies

- ❌ Controllers should NOT depend on repositories
- ❌ Services should NOT depend on controllers
- ❌ Domain should NOT depend on DTOs or services
- ❌ Repositories should NOT depend on services

---

## Related Documentation

- [Layered Architecture](./Layered-Architecture.md) - Architecture pattern details
- [ADR-008: Layered Architecture](../../../docs/ADR/ADR-008-Layered-Architecture.md) - Architecture decision
- [Backend Refactoring Summary](../../../docs/Architecture/Backend-Refactoring.md) - Refactoring decisions

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

