# Database Specification (MongoDB)

> **Version**: 2.0.0  
> **Last Updated**: 2025-11-15  
> **Database**: MongoDB (NoSQL)  
> **ODM**: Spring Data MongoDB

## Overview

This project uses MongoDB as the primary database, leveraging Spring Data MongoDB for object-document mapping. The database stores portfolio data including projects, academic records, tech stacks, user information, contact submissions, resumes, and engagement analytics.

## Database Configuration

- **Database Name**: `portfolio` (configurable via `MONGODB_URI`)
- **Connection**: MongoDB URI format: `mongodb://localhost:27017/portfolio_dev`
- **ODM Framework**: Spring Data MongoDB
- **Indexing**: Automatic index creation via `@Indexed` annotations

## Collections (Documents)

### 1. projects

Project portfolio items with relationships to tech stacks and academics.

**Document Structure**:
```json
{
  "_id": "ObjectId",
  "title": "string (required, 3-255 chars)",
  "summary": "string (required, 10-500 chars)",
  "description": "string (required, 20-10000 chars, markdown)",
  "startDate": "ISODate (LocalDate)",
  "endDate": "ISODate (LocalDate)",
  "githubUrl": "string (optional, valid URL)",
  "demoUrl": "string (optional, valid URL)",
  "repositoryName": "string (optional)",
  "isFeatured": "boolean (default: false)",
  "status": "enum (PLANNING | IN_PROGRESS | COMPLETED | ARCHIVED, default: COMPLETED)",
  "viewCount": "long (default: 0)",
  "techStackIds": ["ObjectId string[]"],
  "relatedAcademicIds": ["ObjectId string[]"],
  "createdAt": "ISODate (auto-generated)",
  "updatedAt": "ISODate (auto-updated)"
}
```

**Indexes**:
- `endDate` (DESC) - For sorting by end date
- `isFeatured` - For featured projects query
- `status` - For filtering by status

**Relationships**:
- Many-to-Many with `tech_stacks` via `techStackIds` array
- Many-to-Many with `academics` via `relatedAcademicIds` array

**Validation**:
- `endDate` must be after `startDate` (application-level validation)
- URLs validated via `@ValidUrl` annotation

### 2. academics

Academic course records with grades and semester information.

**Document Structure**:
```json
{
  "_id": "ObjectId",
  "subjectCode": "string (indexed, e.g., '31264', '41025')",
  "name": "string (e.g., 'Computer Graphics')",
  "semester": "string (e.g., '2025 AUT')",
  "grade": "enum (HIGH_DISTINCTION | DISTINCTION | CREDIT | PASS)",
  "creditPoints": "integer (e.g., 6)",
  "marks": "integer (e.g., 92)",
  "description": "string (optional)",
  "status": "enum (COMPLETED | ENROLLED | EXEMPTION)",
  "year": "integer (e.g., 2024, 2025)",
  "semesterType": "enum (SPRING | AUTUMN)",
  "createdAt": "ISODate (auto-generated)",
  "updatedAt": "ISODate (auto-updated)"
}
```

**Indexes**:
- `subjectCode` (indexed) - For quick lookup
- `semester` - For filtering by semester
- `year` + `semesterType` - For chronological queries

**Relationships**:
- Many-to-Many with `projects` via reverse reference in `projects.relatedAcademicIds`

**Enums**:
- `AcademicGrade`: HIGH_DISTINCTION (HD), DISTINCTION (D), CREDIT (C), PASS (P)
- `AcademicStatus`: COMPLETED, ENROLLED, EXEMPTION
- `Semester`: SPRING (SPR), AUTUMN (AUT)

### 3. tech_stacks

Technology stack definitions with categorization and proficiency levels.

**Document Structure**:
```json
{
  "_id": "ObjectId",
  "name": "string (unique, indexed, e.g., 'React', 'Spring Boot')",
  "type": "enum (FRONTEND | BACKEND | DATABASE | DEVOPS | MOBILE | TESTING | OTHER)",
  "logoUrl": "string (optional, image URL)",
  "officialUrl": "string (optional, official website)",
  "description": "string (optional)",
  "proficiencyLevel": "enum (BEGINNER | INTERMEDIATE | ADVANCED | EXPERT, default: INTERMEDIATE)",
  "usageCount": "long (default: 0, tracks project usage)",
  "isPrimary": "boolean (default: false, primary tech stack)",
  "createdAt": "ISODate (auto-generated)",
  "updatedAt": "ISODate (auto-updated)"
}
```

**Indexes**:
- `name` (unique, indexed) - Ensures uniqueness and fast lookup
- `type` - For filtering by technology type
- `isPrimary` - For primary tech stack queries

**Relationships**:
- Many-to-Many with `projects` via reverse reference in `projects.techStackIds`

**Enums**:
- `TechType`: FRONTEND, BACKEND, DATABASE, DEVOPS, MOBILE, TESTING, OTHER
- `ProficiencyLevel`: BEGINNER (Lv.1), INTERMEDIATE (Lv.2), ADVANCED (Lv.3), EXPERT (Lv.4)

**Caching**: This collection is cached for performance (1 hour TTL).

### 4. users

User accounts for authentication and authorization.

**Document Structure**:
```json
{
  "_id": "ObjectId",
  "email": "string (unique, indexed, required)",
  "password": "string (hashed, optional for OAuth users)",
  "displayName": "string",
  "name": "string (compatibility field)",
  "profileImageUrl": "string (optional)",
  "profilePictureUrl": "string (compatibility field)",
  "role": "enum (USER | ADMIN, default: USER)",
  "enabled": "boolean (default: true)",
  "isEmailVerified": "boolean (default: false)",
  "oauthProvider": "string (e.g., 'google', 'github')",
  "oauthId": "string (OAuth provider user ID)",
  "twoFactorEnabled": "boolean (default: false)",
  "twoFactorSecret": "string (encrypted)",
  "lastLogin": "ISODate",
  "sessionId": "string",
  "lastActivity": "ISODate",
  "deviceFingerprint": "string",
  "roles": ["string[] (multi-role support)"],
  "registrationSource": "string (e.g., 'google', 'email', 'github')",
  "referrer": "string",
  "userAgent": "string",
  "ipAddress": "string",
  "createdAt": "ISODate (auto-generated)",
  "updatedAt": "ISODate (auto-updated)"
}
```

**Indexes**:
- `email` (unique, indexed) - Primary lookup key

**Security**:
- Password hashed using BCrypt
- JWT tokens for authentication
- 2FA support via TOTP

### 5. contacts

Contact form submissions for lead generation.

**Document Structure**:
```json
{
  "_id": "ObjectId",
  "email": "string (indexed, required)",
  "name": "string (required, 2-100 chars)",
  "company": "string (optional, max 100 chars)",
  "subject": "string (optional, max 100 chars)",
  "message": "string (required, 10-2000 chars)",
  "phoneNumber": "string (optional)",
  "linkedInUrl": "string (optional)",
  "jobTitle": "string (optional)",
  "referrer": "string (optional, tracking)",
  "source": "string (optional, 'portfolio', 'project', 'resume')",
  "projectId": "string (optional, if related to specific project)",
  "ipAddress": "string (hashed for privacy)",
  "userAgent": "string",
  "status": "enum (NEW | READ | REPLIED | ARCHIVED | SPAM, default: NEW)",
  "isSpam": "boolean (default: false)",
  "isRead": "boolean (default: false)",
  "isReplied": "boolean (default: false)",
  "internalNotes": "string (optional)",
  "createdAt": "ISODate (auto-generated)",
  "readAt": "ISODate",
  "repliedAt": "ISODate"
}
```

**Indexes**:
- `email` (indexed) - For duplicate detection and rate limiting
- `createdAt` - For chronological queries
- `status` - For filtering by status

**Security**:
- Honeypot field validation
- Rate limiting per IP address
- Input sanitization
- IP address hashing for privacy

### 6. resumes

Resume/CV management with multiple versions.

**Document Structure**:
```json
{
  "_id": "ObjectId",
  "version": "string (indexed, e.g., 'full', 'software-engineer', 'frontend')",
  "title": "string (e.g., 'Full Stack Developer Resume')",
  "description": "string (optional, purpose of this version)",
  "fileName": "string (original filename)",
  "fileUrl": "string (Azure Blob Storage URL)",
  "fileType": "string ('pdf', 'docx')",
  "fileSize": "long (bytes, optional)",
  "isActive": "boolean (default: true, primary resume)",
  "isPublic": "boolean (default: true, downloadable by visitors)",
  "downloadCount": "long (default: 0)",
  "metaDescription": "string (optional, SEO)",
  "keywords": "string (optional, comma-separated)",
  "previousVersionId": "string (optional, version control)",
  "createdAt": "ISODate (auto-generated)",
  "updatedAt": "ISODate (auto-updated)",
  "lastDownloadedAt": "ISODate"
}
```

**Indexes**:
- `version` (indexed) - For version lookup
- `isActive` - For primary resume query
- `isPublic` - For public resume queries

**File Storage**:
- Development: Local file system
- Production: Azure Blob Storage (planned)

### 7. project_engagement

Analytics for project visitor engagement tracking.

**Document Structure**:
```json
{
  "_id": "ObjectId",
  "projectId": "string (ObjectId, required)",
  "sessionId": "string (browser session ID)",
  "visitorId": "string (optional, anonymous or authenticated user)",
  "viewDuration": "long (seconds, optional)",
  "scrollDepth": "integer (0-100, percentage, optional)",
  "githubLinkClicked": "boolean (optional)",
  "demoLinkClicked": "boolean (optional)",
  "timesViewed": "integer (views in this session, optional)",
  "referrer": "string (optional, referrer URL)",
  "source": "string (optional, 'direct', 'search', 'social', 'referral')",
  "userAgent": "string",
  "deviceType": "string (optional, 'mobile', 'tablet', 'desktop')",
  "browser": "string (optional)",
  "country": "string (optional)",
  "city": "string (optional)",
  "ipAddress": "string (hashed for privacy)",
  "viewedAt": "ISODate (auto-generated)",
  "lastInteractionAt": "ISODate"
}
```

**Indexes**:
- `projectId` - For project-specific analytics
- `viewedAt` - For time-based queries
- `sessionId` - For session tracking

**Analytics**:
- Engagement score calculation (0-100)
- High-value engagement detection (score >= 50)
- Aggregation queries for statistics

## Relationships

### Many-to-Many: Projects ↔ Tech Stacks

- **Storage**: Array of ObjectId strings in `projects.techStackIds`
- **Query**: Use `$in` operator to find projects by tech stack
- **Reverse Query**: Find tech stacks used in projects via aggregation

### Many-to-Many: Projects ↔ Academics

- **Storage**: Array of ObjectId strings in `projects.relatedAcademicIds`
- **Query**: Use `$in` operator to find projects by academic
- **Reverse Query**: Find academics related to projects via aggregation

## Indexes Summary

| Collection | Index | Type | Purpose |
|------------|-------|------|---------|
| `projects` | `endDate` | DESC | Sorting by date |
| `projects` | `isFeatured` | ASC | Featured projects |
| `projects` | `status` | ASC | Status filtering |
| `academics` | `subjectCode` | ASC | Quick lookup |
| `academics` | `semester` | ASC | Semester filtering |
| `tech_stacks` | `name` | UNIQUE | Uniqueness & lookup |
| `tech_stacks` | `type` | ASC | Type filtering |
| `users` | `email` | UNIQUE | Authentication |
| `contacts` | `email` | ASC | Duplicate detection |
| `contacts` | `createdAt` | DESC | Chronological queries |
| `resumes` | `version` | ASC | Version lookup |
| `resumes` | `isActive` | ASC | Primary resume |
| `project_engagement` | `projectId` | ASC | Project analytics |
| `project_engagement` | `viewedAt` | DESC | Time-based queries |

## Data Access Patterns

### Spring Data MongoDB

- **Repositories**: Extend `MongoRepository<T, ID>`
- **Query Methods**: Method name-based queries (e.g., `findByEmail`, `findByStatus`)
- **Custom Queries**: `@Query` annotation with MongoDB query syntax
- **Aggregation**: `Aggregation` pipeline for complex queries

### Example Repository

```java
@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    Page<Project> findByStatusOrderByEndDateDesc(ProjectStatus status, Pageable pageable);
    List<Project> findByTechStackIdsContaining(String techStackId);
    List<Project> findByIsFeaturedTrue();
}
```

## Validation Rules

### Application-Level Validation

- **Date Range**: `endDate` must be after `startDate` (via `@ValidDateRange`)
- **URL Format**: GitHub and demo URLs validated via `@ValidUrl`
- **MongoDB ObjectId**: Validated via `@ValidMongoId` and `@ValidMongoIdList`
- **String Length**: Jakarta Bean Validation (`@Size`, `@NotBlank`, etc.)

### Database-Level Constraints

- **Unique Indexes**: `tech_stacks.name`, `users.email`
- **Required Fields**: Enforced at application level (Spring Data MongoDB)

## Migration Strategy

### Initial Setup

1. **Connection**: Configure `MONGODB_URI` in `application.properties`
2. **Indexes**: Created automatically via `@Indexed` annotations on first run
3. **Seed Data**: Optional data initialization via `@PostConstruct` or migration scripts

### Data Migration

- **From MySQL**: Use migration scripts to convert relational data to documents
- **Version Control**: Use MongoDB change streams or application-level versioning
- **Backup**: Regular MongoDB backups via `mongodump`

## Performance Considerations

### Caching

- **Tech Stacks**: Cached for 1 hour (frequently accessed, rarely updated)
- **Cache Implementation**: Spring Cache with Caffeine

### Query Optimization

- **Pagination**: Always use `Pageable` for list queries
- **Projection**: Use DTOs to limit returned fields
- **Aggregation**: Use aggregation pipeline for complex statistics

### Index Usage

- All frequently queried fields are indexed
- Compound indexes considered for multi-field queries
- Index monitoring via MongoDB Compass or `db.collection.getIndexes()`

## Backup & Recovery

### Backup Strategy

- **Frequency**: Daily automated backups
- **Method**: `mongodump` or MongoDB Atlas automated backups
- **Retention**: 30 days of backups

### Recovery

- **Point-in-Time Recovery**: MongoDB Atlas or oplog-based recovery
- **Document-Level**: Application-level soft deletes for critical data

## Security

### Data Protection

- **Sensitive Data**: Passwords hashed (BCrypt), IP addresses hashed
- **Input Sanitization**: All user inputs sanitized via `InputSanitizer`
- **Access Control**: Role-based access control (RBAC) at application level

### Connection Security

- **Authentication**: MongoDB authentication enabled
- **TLS/SSL**: Encrypted connections in production
- **Network**: Firewall rules to restrict access

## Monitoring

### Metrics to Track

- **Query Performance**: Slow query log analysis
- **Index Usage**: Index hit ratio
- **Collection Sizes**: Document count and storage size
- **Connection Pool**: Active connections and pool usage

### Tools

- **MongoDB Compass**: GUI for database management
- **MongoDB Atlas**: Cloud monitoring (if using Atlas)
- **Application Logs**: Structured logging for database operations

## Future Improvements

1. **Sharding**: For horizontal scaling (if needed)
2. **Replica Set**: For high availability
3. **Change Streams**: For real-time data synchronization
4. **Full-Text Search**: MongoDB Atlas Search for advanced search
5. **Time-Series Collections**: For engagement analytics (MongoDB 5.0+)

---

**Document Version**: 2.0.0  
**Last Updated**: 2025-11-15  
**Maintained By**: Development Team
