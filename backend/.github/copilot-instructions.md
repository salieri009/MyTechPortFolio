# MyTechPortfolio Backend Instructions

## Project Context
- **Framework**: Spring Boot 3.3
- **Language**: Java 21
- **Database**: MongoDB
- **Security**: Spring Security (JWT, OAuth2)

## Code Style & Patterns
- **API Architecture**:
  - **Controller**: Handles HTTP requests, validation, and response formatting.
  - **Service**: Contains business logic.
  - **Repository**: Extends `MongoRepository`.
- **Response Format**:
  - All controllers MUST return `ResponseEntity<ApiResponse<T>>`.
  - Use `ResponseUtil` class for building success/error responses.
- **DTO Pattern**:
  - **Strict Separation**: Use `dto/request` for inputs and `dto/response` for outputs.
  - **No Entities**: NEVER expose MongoDB `@Document` entities directly in API responses.
  - **Validation**: Use Jakarta Bean Validation (`@Valid`, `@NotNull`, etc.) on Request DTOs.
- **Documentation**:
  - Annotate all controllers and endpoints with Swagger/OpenAPI (`@Tag`, `@Operation`).

## Developer Workflow
- **Build**: `./gradlew build`
- **Run**: `./gradlew bootRun`
- **Test**: `./gradlew test`

## Key Files
- `src/main/java/com/mytechfolio/portfolio/constants/ApiConstants.java`: API endpoint paths.
- `src/main/java/com/mytechfolio/portfolio/util/ResponseUtil.java`: Response builder helper.
- `src/main/java/com/mytechfolio/portfolio/controller/`: REST Controllers.
