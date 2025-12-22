---
title: "Database Migrations"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Backend Developers", "DevOps Engineers"]
prerequisites: ["../ARCHITECTURE/Package-Organization.md", "../PATTERNS/Repository-Patterns.md"]
related_docs: ["../PATTERNS/Repository-Patterns.md", "./Deployment-Guide.md"]
maintainer: "Development Team"
---

# Database Migrations

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide explains how database migrations are handled in the MyTechPortfolio backend application for both MongoDB (primary) and relational databases (legacy support).

---

## Overview

| Database | Usage | Migration Strategy |
|----------|-------|--------------------|
| MongoDB (primary) | Production & development | Schema-less, auto index creation, manual seed scripts |
| Relational DB (legacy/testing) | Optional compatibility mode | SQL migration scripts in `src/main/resources/db/migration` |

---

## MongoDB Migrations

MongoDB is schema-less, but we manage structure and indexes via:

### 1. Spring Data Annotations
- `@Document(collection = "projects")`
- `@Indexed` on frequently queried fields
- `@CreatedDate`, `@LastModifiedDate` for audit fields

### 2. Auto Index Creation

Enabled in `application.properties`:
```properties
spring.data.mongodb.auto-index-creation=true
```

Indexes defined via annotations are automatically created on application startup.  
**Recommendation**: Run the application once after adding new indexes to ensure they are created.

### 3. Data Initialization (Optional)

Use `DataInitializer`/`DataLoader` classes (in `config/`) for one-time seed data.  
Wrap initialization logic with profile checks to avoid reseeding in production.

---

## Relational Database Migrations (Legacy Support)

Although the application primarily uses MongoDB, SQL migration scripts are maintained for compatibility.  
Scripts are stored in `src/main/resources/db/migration/` and follow Flyway naming (`V__Description.sql`).

### Available Scripts
- `V1__Create_Initial_Schema.sql`
- `V2__Create_Visitor_Analytics_Schema.sql`
- `V3__Insert_Sample_Analytics_Data.sql`
- `V4__Create_Admin_System.sql`

### Applying Migrations Manually

1. Install MySQL (or compatible) and create a database:
   ```sql
   CREATE DATABASE myportfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Apply scripts in order (using MySQL CLI as an example):
   ```bash
   mysql -u your_user -p myportfolio < src/main/resources/db/migration/V1__Create_Initial_Schema.sql
   mysql -u your_user -p myportfolio < src/main/resources/db/migration/V2__Create_Visitor_Analytics_Schema.sql
   # ... and so on
   ```

3. Update `application.properties` (or profile) to point to the relational DB if needed.

### Using Flyway (Optional)

If you add Flyway dependency:
```gradle
implementation 'org.flywaydb:flyway-core'
```

Then run:
```bash
./gradlew flywayMigrate -Dflyway.url=jdbc:mysql://localhost:3306/myportfolio -Dflyway.user=root -Dflyway.password=secret
```

> **Note**: Flyway is optional and not currently included to keep the MongoDB-first setup lightweight.

---

## Adding New Migration Scripts

1. Create a new SQL file in `src/main/resources/db/migration/`
   - Naming convention: `V{version}__Description.sql`
   - Example: `V5__Add_Project_Index.sql`

2. Include only forward migrations (no destructive changes)
3. Document changes in `docs/CHANGELOG.md`
4. Notify the team if manual execution is required

---

## Migration Checklist

- [ ] Determine if change affects MongoDB (most cases) or legacy SQL
- [ ] Update domain/model classes with new fields
- [ ] Add annotations (`@Indexed`, `@Field`, etc.) as needed
- [ ] Create/Update seed data if required
- [ ] For SQL mode, add new migration script with clear comments
- [ ] Document changes in `CHANGELOG.md`
- [ ] Test migration on a copy of the database
- [ ] Communicate rollout plan

---

## Best Practices

1. **MongoDB**
   - Use descriptive field names
   - Avoid breaking changes (rename instead of delete)
   - Provide backfill scripts for large data updates
   - Keep seed scripts idempotent

2. **SQL Scripts**
   - Use transactions when possible
   - Provide rollback plan in comments
   - Test scripts on staging before production
   - Version scripts sequentially (no gaps)

---

## Related Documentation

- [Repository Patterns](../PATTERNS/Repository-Patterns.md)
- [Deployment Guide](./Deployment-Guide.md)
- [Backend Documentation Plan](../BACKEND_DOCUMENTATION_PLAN.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team  
**Status**: Active

