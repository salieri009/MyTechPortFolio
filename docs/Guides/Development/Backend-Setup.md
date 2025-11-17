---
title: "Backend Setup Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers"]
prerequisites: ["Getting-Started.md"]
related_docs: ["Frontend-Setup.md", "Specifications/API-Specification.md"]
maintainer: "Development Team"
---

# Backend Setup Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

This guide provides step-by-step instructions for setting up the backend development environment for MyTechPortfolio.

---

## Prerequisites

- **Java**: 21 or higher
- **Gradle**: 8.0 or higher (included via Gradle Wrapper)
- **MongoDB**: 7.0 or higher
- **Git**: 2.30.0 or higher

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/salieri009/MyTechPortfolio.git
cd MyTechPortfolio/backend
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp ../environment.template .env
```

Edit `.env` with your configuration:

```properties
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mytechfolio

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email (optional)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-password
```

### 3. Start MongoDB

#### Option A: Docker (Recommended)

```bash
docker-compose -f ../docker-compose.dev.yml up mongodb-dev -d
```

#### Option B: Local Installation

```bash
# Start MongoDB service
mongod --dbpath /data/db
```

### 4. Run the Application

```bash
./gradlew bootRun
# Windows: gradlew.bat bootRun
```

The API will be available at `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## Available Commands

### Development

```bash
./gradlew bootRun          # Run application
./gradlew build            # Build project
./gradlew clean            # Clean build artifacts
```

### Testing

```bash
./gradlew test             # Run all tests
./gradlew test --tests "*Test"  # Run specific test
./gradlew test --info      # Run with detailed output
```

### Code Quality

```bash
./gradlew check            # Run all checks
./gradlew spotlessCheck    # Check code formatting
./gradlew spotlessApply    # Apply code formatting
```

---

## Project Structure

```
backend/
?œâ??€ src/
??  ?œâ??€ main/
??  ??  ?œâ??€ java/
??  ??  ??  ?”â??€ com/mytechfolio/portfolio/
??  ??  ??      ?œâ??€ controller/    # REST controllers
??  ??  ??      ?œâ??€ service/        # Business logic
??  ??  ??      ?œâ??€ repository/    # Data access
??  ??  ??      ?œâ??€ domain/        # Domain entities
??  ??  ??      ?œâ??€ dto/           # Data transfer objects
??  ??  ??      ?œâ??€ security/     # Security configuration
??  ??  ??      ?”â??€ config/        # Configuration classes
??  ??  ?”â??€ resources/
??  ??      ?œâ??€ application.properties
??  ??      ?”â??€ application-dev.properties
??  ?”â??€ test/
??      ?”â??€ java/          # Test classes
?œâ??€ build.gradle           # Build configuration
?”â??€ settings.gradle        # Project settings
```

---

## Development Workflow

### Adding a New Endpoint

1. Create controller in `controller/`
2. Create service in `service/`
3. Create repository if needed
4. Add DTOs in `dto/`
5. Update API documentation
6. Write tests

### Database Changes

1. Update domain entity
2. Create migration if needed
3. Update repository
4. Update service layer
5. Test database operations

---

## API Documentation

### Swagger UI

Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

### API Endpoints

Base URL: `http://localhost:8080/api/v1`

See [API Specification](../Specifications/API-Specification.md) for complete API documentation.

---

## Troubleshooting

### MongoDB Connection Failed

```bash
# Check MongoDB is running
mongosh --eval "db.version()"

# Verify connection string in .env
# Check firewall settings
```

### Port 8080 Already in Use

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill
```

### Gradle Build Failures

```bash
# Clean and rebuild
./gradlew clean build

# Refresh dependencies
./gradlew clean --refresh-dependencies
```

See [Troubleshooting Guide](../Troubleshooting/Common-Issues.md) for more solutions.

---

## Related Documentation

- [Frontend Setup](./Frontend-Setup.md)
- [API Specification](../Specifications/API-Specification.md)
- [Database Specification](../Specifications/Database-Specification.md)
- [Getting Started Guide](../Getting-Started.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team


