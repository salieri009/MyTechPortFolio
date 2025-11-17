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

MyTechPortfolio uses **MongoDB 7.0** as the NoSQL database. This document describes the database schema, collections, indexes, and data relationships.

**Database**: MongoDB  
**Version**: 7.0+  
**Connection**: Configured via `MONGODB_URI` environment variable

---

## Collections

### Projects Collection

**Collection Name**: `projects`

**Schema**:
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

**Indexes**:
- `_id` (primary key)
- `status` (indexed)
- `isFeatured` (indexed)
- `endDate` (indexed, for sorting)

---

### Academics Collection

**Collection Name**: `academics`

**Schema**:
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

**Indexes**:
- `_id` (primary key)
- `subjectCode` (indexed)
- `semester` (indexed)

---

### Journey Milestones Collection

**Collection Name**: `journey_milestones`

**Schema**:
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

**Indexes**:
- `_id` (primary key)
- `year` (indexed, for sorting)
- `title` (indexed)
- `status` (indexed)

---

### Tech Stacks Collection

**Collection Name**: `tech_stacks`

**Schema**:
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

**Indexes**:
- `_id` (primary key)
- `name` (unique index)
- `category` (indexed)

---

### Testimonials Collection

**Collection Name**: `testimonials`

**Schema**:
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

**Indexes**:
- `_id` (primary key)
- `isFeatured` (indexed)
- `isApproved` (indexed)
- `type` (indexed)

---

### Admin Users Collection

**Collection Name**: `admin_users`

**Schema**:
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

**Indexes**:
- `_id` (primary key)
- `username` (unique index)
- `email` (unique index)

---

### Additional Collections

- `contacts` - Contact form submissions
- `project_media` - Project images and media
- `project_engagement` - Project view tracking
- `resumes` - Resume/CV management
- `users` - User accounts (if implemented)

---

## Data Relationships

### Projects ??Tech Stacks
- **Relationship**: Many-to-Many (via `techStackIds` array)
- **Implementation**: Array of TechStack IDs stored in Project document

### Projects ??Academics
- **Relationship**: Many-to-Many (via `relatedAcademicIds` array)
- **Implementation**: Array of Academic IDs stored in Project document

### Projects ??Project Media
- **Relationship**: One-to-Many
- **Implementation**: Separate collection with `projectId` reference

---

## Indexing Strategy

### Performance Indexes
- Frequently queried fields are indexed
- Composite indexes for common query patterns
- Unique indexes for fields requiring uniqueness

### Index Maintenance
- Indexes are created automatically via `@Indexed` annotations
- Monitor index usage and performance
- Remove unused indexes to improve write performance

---

## Data Validation

### Application-Level Validation
- Validation performed in Spring Boot using Bean Validation
- Required fields enforced via `@NotNull`, `@NotBlank`
- Enum values validated at application layer

### Database-Level Constraints
- MongoDB does not enforce schema constraints
- Application layer ensures data integrity
- Consider MongoDB schema validation for production

---

## Backup and Recovery

### Backup Strategy
- Regular automated backups (daily recommended)
- Backup before major migrations
- Test restore procedures regularly

### Recovery Procedures
- Document recovery steps
- Maintain backup retention policy
- Test disaster recovery scenarios

---

## Migration Strategy

### Schema Changes
- Use Spring Data MongoDB migrations
- Version control schema changes
- Test migrations in staging environment

### Data Migrations
- Script-based data transformations
- Maintain rollback procedures
- Document all migration steps

---

## Performance Considerations

### Query Optimization
- Use indexes for frequently queried fields
- Limit result sets with pagination
- Use projection to return only needed fields

### Connection Pooling
- Configure appropriate connection pool size
- Monitor connection usage
- Handle connection timeouts gracefully

---

## Security

### Access Control
- Use MongoDB authentication
- Restrict network access
- Use encrypted connections (TLS/SSL)

### Data Protection
- Encrypt sensitive data at rest
- Use environment variables for connection strings
- Regular security audits

---

## Monitoring

### Metrics to Monitor
- Query performance
- Index usage
- Connection pool utilization
- Storage growth
- Replication lag (if using replica set)

---

## Related Documentation

- [API Specification](./API-Specification.md)
- [Architecture Overview](../Architecture/README.md)
- [Getting Started Guide](../Getting-Started.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team


