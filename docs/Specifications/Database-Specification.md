---
title: "Database Specification"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Specification"
audience: ["Developers", "Database Administrators"]
prerequisites: ["Getting-Started.md"]
related_docs: ["API-Specification.md", "Architecture/README.md"]
maintainer: "Development Team"
---

# Database Specification

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

MyTechPortfolio uses **MongoDB 7.0** as the primary datastore. This specification enumerates every collection, schema, relationship, and operational guideline required to keep the platform consistent across development, staging, and production.

**Database**: MongoDB  
**Version**: 7.0+ (locally tested on 6.x)  
**Connection**: Spring Boot autoconfiguration via `spring.data.mongodb.uri`

---

## Environment & Connection Settings

| Setting / Variable | Default | Purpose |
| ------------------ | ------- | ------- |
| `MONGODB_URI` | `mongodb://localhost:27017/portfolio` | Primary connection string referenced by Spring |
| `MONGODB_URI_TEST` | `mongodb://localhost:27018/portfolio_test` | Optional URI for integration tests |
| `spring.data.mongodb.auto-index-creation` | `true` | Auto-creates indexes defined with `@Indexed` during dev/test |
| `spring.data.mongodb.connection-pool.max-size` | `100` | Pool tuning (override per env) |
| `spring.data.mongodb.connection-pool.min-size` | `5` | Baseline warm pool |

> **Tip**  
> `MongoConfig` only enables repository scanning. As long as `spring.data.mongodb.uri` is set (through `application.properties` or environment variable), no extra configuration is required.

---

## Collection Summary

| Collection | Purpose | Primary Consumer | Notable Fields |
| ---------- | ------- | ---------------- | -------------- |
| `projects` | Portfolio case studies (public + admin) | Home, Projects, Admin CRUD | `isFeatured`, `techStackIds`, `relatedAcademicIds` |
| `academics` | Transcript entries powering GPA/WAM cards | Academics page, Admin | `subjectCode`, `semester`, `grade` |
| `journey_milestones` | Timeline storytelling data | Home “My Journey” | `year`, `status`, `codeMetrics`, `techStack` |
| `tech_stacks` | Canonical stack taxonomy | Project filters, admin forms | `name` (unique), `category` |
| `testimonials` | Social proof quotes | Testimonials section, Admin moderation | `type`, `isApproved`, `isFeatured` |
| `admin_users` | CMS/admin credentials | Admin authentication | `username`, `roles`, `isActive` |
| additional | Contacts, media, analytics, resumes | Contact form, analytics, downloads | Collection-specific |

Each collection below details schema, example documents, indexes, and CRUD entry points.

---

## Collections

### Projects Collection

**Collection Name**: `projects`

**Purpose**  
Holds long-form portfolio entries with metadata for filtering, feature placement, and cross-linking to academics.

**CRUD Entry Points**
- API: `GET/POST /api/v1/projects`, `GET/PUT/DELETE /api/v1/projects/{id}`
- Repository: `ProjectRepository extends MongoRepository<Project, String>`

**Schema**
```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "summary": "string (required)",
  "description": "string (markdown, required)",
  "startDate": "ISODate",
  "endDate": "ISODate",
  "githubUrl": "string (optional)",
  "demoUrl": "string (optional)",
  "repositoryName": "string (optional)",
  "isFeatured": "boolean (default: false)",
  "status": "enum: PLANNING, IN_PROGRESS, COMPLETED, ARCHIVED",
  "viewCount": "long (default: 0)",
  "techStackIds": ["string"],
  "relatedAcademicIds": ["string"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Sample Document**
```json
{
  "_id": "675aa6818b8e5d32789d5894",
  "title": "MyPortfolio Platform",
  "summary": "Full-stack portfolio with 3D hero scenes",
  "description": "### Overview\nBuilt with React + Vite + Spring Boot...",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-08-15T00:00:00.000Z",
  "githubUrl": "https://github.com/salieri009/myportfolio",
  "demoUrl": "https://salieri009.com",
  "repositoryName": "myportfolio",
  "isFeatured": true,
  "status": "COMPLETED",
  "viewCount": 1520,
  "techStackIds": ["675aa6818b8e5d32789d5801", "675aa6818b8e5d32789d5802"],
  "relatedAcademicIds": ["675aa6818b8e5d32789d5701"],
  "createdAt": "2024-08-01T10:33:00.000Z",
  "updatedAt": "2024-11-17T12:02:00.000Z"
}
```

**Indexes & Access Patterns**

| Field | Reason |
| ----- | ------ |
| `_id` | Default lookup |
| `status` | Admin filter tabs |
| `isFeatured` | Home hero selection |
| `endDate` | Sort newest/oldest |
| `techStackIds` | Multikey filter |

> Consider compound `(isFeatured, endDate)` if the featured set grows.

---

### Academics Collection

**Collection Name**: `academics`

**Purpose**  
Stores subject-level academic performance for GPA/WAM cards and transcript tables.

**CRUD Entry Points**
- API: `GET/POST /api/v1/academics`, `GET/PUT/DELETE /api/v1/academics/{id}`
- Repository: `AcademicRecordRepository`

**Schema**
```json
{
  "_id": "ObjectId",
  "subjectCode": "string (indexed)",
  "name": "string (required)",
  "semester": "string (indexed)",
  "grade": "enum: HIGH_DISTINCTION, DISTINCTION, CREDIT, PASS",
  "creditPoints": "integer",
  "marks": "integer",
  "description": "string",
  "status": "enum: COMPLETED, ENROLLED, EXEMPTION",
  "year": "integer",
  "semesterType": "enum: SPRING, AUTUMN",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Sample Document**
```json
{
  "_id": "675aa6818b8e5d32789d5901",
  "subjectCode": "31257",
  "name": "Information Systems Development",
  "semester": "2024 Autumn",
  "grade": "DISTINCTION",
  "creditPoints": 6,
  "marks": 85,
  "description": "Team-based enterprise delivery focusing on Agile.",
  "status": "COMPLETED",
  "year": 2024,
  "semesterType": "AUTUMN",
  "createdAt": "2024-03-10T00:00:00.000Z",
  "updatedAt": "2024-06-30T00:00:00.000Z"
}
```

**Indexes**
- `_id` – default.
- `subjectCode` – prevents duplicates & speeds lookups.
- `semester` – supports filter dropdowns and charts.

---

### Journey Milestones Collection

**Collection Name**: `journey_milestones`

**Purpose**  
Feeds the “My Journey” timeline with narrative plus measurable indicators (tech stack, LOC, commits, skill progression).

**CRUD Entry Points**
- API: `GET /api/v1/journey-milestones`, `POST/PUT/DELETE /api/v1/journey-milestones/{id}`
- Repository: `JourneyMilestoneRepository`

**Schema**
```json
{
  "_id": "ObjectId",
  "year": "string (indexed)",
  "title": "string (indexed, required)",
  "description": "string (required)",
  "icon": "string (optional)",
  "techStack": ["string"],
  "status": "enum: COMPLETED, CURRENT, PLANNED",
  "technicalComplexity": "integer (1-5)",
  "projectCount": "integer (default: 0)",
  "codeMetrics": {
    "linesOfCode": "long",
    "commits": "integer",
    "repositories": "integer"
  },
  "keyAchievements": [
    {
      "title": "string",
      "description": "string",
      "impact": "string"
    }
  ],
  "skillProgression": [
    {
      "name": "string",
      "level": "integer (1-5)",
      "category": "enum: FRONTEND, BACKEND, DATABASE, DEVOPS, OTHER"
    }
  ],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Sample Document**
```json
{
  "_id": "675aa6818b8e5d32789d5a01",
  "year": "2023",
  "title": "Transitioned to Full-Stack Engineer",
  "description": "Led migration from monolith to micro frontends...",
  "icon": "laptop",
  "techStack": ["React", "TypeScript", "Spring Boot", "MongoDB"],
  "status": "COMPLETED",
  "technicalComplexity": 5,
  "projectCount": 4,
  "codeMetrics": {
    "linesOfCode": 45000,
    "commits": 620,
    "repositories": 9
  },
  "keyAchievements": [
    {
      "title": "Deployed admin CRUD suite",
      "description": "Enabled non-technical staff to manage content.",
      "impact": "Cut content turnaround time by 60%"
    }
  ],
  "skillProgression": [
    { "name": "React", "level": 5, "category": "FRONTEND" },
    { "name": "DevOps", "level": 4, "category": "DEVOPS" }
  ],
  "createdAt": "2023-04-12T00:00:00.000Z",
  "updatedAt": "2024-01-05T00:00:00.000Z"
}
```

**Indexes**

| Field | Reason |
| ----- | ------ |
| `_id` | Default |
| `year` | Supports `findAllByOrderByYearAsc()` |
| `status` | Admin filters & segmentation |
| `title` | Prevent duplicates, enable search |

> Store `year` as string to support ranges (e.g., `"2018-2020"`). Prefix with the starting year to maintain lexical sort order.

---

### Tech Stacks Collection

**Collection Name**: `tech_stacks`

**Purpose**  
Normalized list of technologies used across projects. Enables consistent labeling and filtering.

**Schema**
```json
{
  "_id": "ObjectId",
  "name": "string (required, unique)",
  "category": "enum: FRONTEND, BACKEND, DATABASE, DEVOPS, TOOL, LANGUAGE",
  "icon": "string (optional)",
  "description": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Sample Document**
```json
{
  "_id": "675aa6818b8e5d32789d5801",
  "name": "React",
  "category": "FRONTEND",
  "icon": "react",
  "description": "Component-based UI library",
  "createdAt": "2023-10-01T00:00:00.000Z",
  "updatedAt": "2024-05-20T00:00:00.000Z"
}
```

**Indexes**
- Unique index on `name`.
- Optional index on `category` for grouped filters.

---

### Testimonials Collection

**Collection Name**: `testimonials`

**Purpose**  
Stores social proof quotes. `isApproved` gates public visibility; `isFeatured` surfaces quotes on hero carousels.

**Schema**
```json
{
  "_id": "ObjectId",
  "authorName": "string (required)",
  "authorRole": "string",
  "authorCompany": "string",
  "content": "string (required)",
  "rating": "integer (1-5)",
  "type": "enum: CLIENT, COLLEAGUE, MENTOR, PROFESSOR, OTHER",
  "isFeatured": "boolean (default: false)",
  "isApproved": "boolean (default: false)",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Sample Document**
```json
{
  "_id": "675aa6818b8e5d32789d5b01",
  "authorName": "Professor Lee",
  "authorRole": "Course Director",
  "authorCompany": "UTS FEIT",
  "content": "Jungwook consistently delivers production-grade work under pressure.",
  "rating": 5,
  "type": "PROFESSOR",
  "isFeatured": true,
  "isApproved": true,
  "createdAt": "2024-07-01T00:00:00.000Z",
  "updatedAt": "2024-07-05T00:00:00.000Z"
}
```

**Indexes**
- `isApproved` – fetch only approved testimonials.
- `isFeatured` – highlight subset quickly.
- `type` – segment by source.

---

### Admin Users Collection

**Collection Name**: `admin_users`

**Purpose**  
Stores admin credentials and role assignments. Passwords are hashed (BCrypt). 2FA can be layered with a separate collection or field.

**Schema**
```json
{
  "_id": "ObjectId",
  "username": "string (required, unique)",
  "email": "string (required, unique)",
  "password": "string (hashed)",
  "roles": ["string"],
  "isActive": "boolean (default: true)",
  "lastLogin": "ISODate",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Sample Document**
```json
{
  "_id": "675aa6818b8e5d32789d5c01",
  "username": "admin",
  "email": "admin@salieri009.studio",
  "password": "$2a$10$kuzY....",
  "roles": ["ADMIN", "CONTENT_EDITOR"],
  "isActive": true,
  "lastLogin": "2025-01-15T05:40:00.000Z",
  "createdAt": "2024-04-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T05:40:00.000Z"
}
```

**Indexes**
- Unique indexes on `username` and `email`.
- Optional TTL index on `lastLogin` for stale-session cleanup (future enhancement).

---

### Additional Collections

- `contacts`: Contact form submissions (`name`, `email`, `message`, timestamps).
- `project_media`: Image metadata/CDN URLs keyed by `projectId`.
- `project_engagement`: Aggregated analytics (views, dwell time).
- `resumes`: Versioned resume/CV records.
- `users`: Placeholder for future public accounts.

---

## Data Relationships

- **Projects ↔ Tech Stacks**: Many-to-Many via `techStackIds`. Service layer validates references before save.
- **Projects ↔ Academics**: Many-to-Many via `relatedAcademicIds`. Highlights coursework supporting each project.
- **Projects ↔ Project Media**: One-to-Many; media documents contain `projectId`.
- **Journey Milestones ↔ Projects**: Implicit (front-end matches tags). Future enhancement could add `relatedProjectIds`.

---

## Indexing Strategy

- Declare indexes via `@Indexed` annotations or migration scripts.
- Favor compound indexes when queries combine fields (e.g., `status + isFeatured`).
- Monitor index stats (`db.collection.stats()`, Atlas UI) and prune unused ones to keep writes fast.

---

## Data Validation

### Application Layer
- Bean Validation (`@NotBlank`, `@Positive`, `@ValidMongoId`).
- Enum parsing with graceful error messages.
- Custom Mongo ID validators prevent invalid ObjectId strings before repository operations.

### Database Layer
- MongoDB remains schemaless; optionally add JSON schema validation when schemas stabilize.
- Use transactions (requires replica set) if multi-document operations become necessary.

---

## Data Seeding & Fixtures

1. **Local Development**
   - Start MongoDB (`mongod --dbpath C:\data\db` or Docker).
   - Import sample docs via Compass or `mongoimport`.
2. **Idempotent Seeds**
   - Upsert using natural keys (e.g., `year + title` for milestones).
   - Guard Spring seeders with profiles to avoid reseeding production.
3. **Frontend Fallbacks**
   - `JourneyMilestoneSection` contains fallback fixtures used when API fails; keep aligned with actual data.
4. **Testing**
   - `@DataMongoTest` + embedded Mongo/Testcontainers with minimal fixtures.

---

## Operational Runbook

### Local Workflow
1. `mongod --dbpath C:\data\db` (or `docker run -p 27017:27017 mongo:7`).
2. `cd backend && ./gradlew.bat bootRun`.
3. `cd frontend && npm run dev` (Vite proxy `/api` → `http://localhost:8080/api/v1`).

### Staging / Production
1. Use managed MongoDB (Atlas) with TLS enabled.
2. Configure network isolation (VNet peering or Atlas IP allow-list).
3. Rotate credentials via secret manager.
4. Enable replica set for HA; consider sharding once data grows beyond tens of GB.

### Monitoring
- Track slow queries via `app.performance.slow-query-threshold-ms`.
- Observe connection pool metrics via Spring Actuator and Atlas dashboards.
- Alert on replication lag, disk growth, auth failures.

---

## Backup and Recovery

- Daily automated backups (`mongodump` or Atlas snapshot).
- Perform manual backups before major schema/data migrations.
- Store backups encrypted with ≥30-day retention.
- Run quarterly restore drills (restore into staging and execute smoke tests).

---

## Migration Strategy

### Schema Changes
- Document change in ADR or migration ticket.
- Introduce new fields with backward-compatible defaults.
- Use migration scripts or Spring tasks to backfill existing docs.

### Data Migrations
- Use scripted approaches (Java command, Mongo shell).
- Keep migrations idempotent and reversible (checkpoint documents if needed).
- Validate post-migration counts and spot-check sample documents.

---

## Performance Considerations

- Paginate (`limit`, `skip`) to avoid large cursor loads.
- Use projections to omit heavy fields (e.g., skip `description` for list views).
- Keep documents under MongoDB’s 16 MB limit; offload assets to `project_media` or external storage.
- Cache read-heavy endpoints if latency becomes an issue.

---

## Security

- Enable MongoDB authentication outside local dev.
- Use least-privilege roles (read/write app user, read-only analytics user).
- Encrypt in transit (TLS) and store connection strings in environment variables or secret manager.
- Hash credentials with BCrypt (already handled in `admin_users` service).

---

## Monitoring

Track the following metrics via Atlas/CloudWatch/Grafana:
- Query latency distribution.
- Index hit/miss ratio.
- Connection pool utilization.
- Disk/storage growth.
- Replication health (if replica set).

---

## Related Documentation

- [API Specification](./API-Specification.md)
- [Architecture Overview](../Architecture/README.md)
- [Getting Started Guide](../Getting-Started.md)
- [Repository Patterns](../PATTERNS/Repository-Patterns.md)
- [Database Migration Guide](../GUIDES/Database-Migrations.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team

