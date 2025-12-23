# Specifications Index

> **Comprehensive technical specifications for MyTechPortfolio**  
> **Version**: 2.0.0  
> **Last Updated**: 2025-11-15

This directory contains detailed technical specifications for API, database, frontend, and UI/UX components. All specifications are implementation-ready and reflect the current production state of the project.

---

## 📋 Available Specifications

| Specification | Description | Status | Last Updated |
|---------------|-------------|--------|--------------|
| [API Specification](./API-Specification.md) | REST API endpoints, contracts, data models, and error handling | ✅ Complete | 2025-11-15 |
| [Database Specification](./Database-Specification.md) | MongoDB schema, collections, relationships, indexes, and data access patterns | ✅ Complete | 2025-11-15 |
| [Frontend Specification](./Frontend-Specification.md) | React component architecture, routing, state management, and build configuration | ✅ Complete | 2025-11-15 |
| [UI/UX Specification](./UI-UX-Specification.md) | Design system, accessibility, responsive rules, and user experience patterns | ✅ Complete | 2025-11-15 |

---

## 🎯 Quick Reference

### API Specifications

- **Base URL**: `/api/v1`
- **API Version**: `v1`
- **Authentication**: JWT Bearer tokens, Google OAuth
- **Format**: RESTful JSON API with standardized `ApiResponse<T>` envelope
- **Documentation**: Swagger UI at `/swagger-ui.html`
- **Endpoints**: Projects, Academics, Tech Stacks, Auth, Contact, Resumes, Engagement
- **Details**: See [API Specification](./API-Specification.md)

### Database Specifications

- **Type**: MongoDB (NoSQL Document Database)
- **ODM**: Spring Data MongoDB
- **Collections**: 
  - `projects` - Project portfolio items
  - `academics` - Academic course records
  - `tech_stacks` - Technology stack definitions
  - `users` - User accounts
  - `contacts` - Contact form submissions
  - `resumes` - Resume/CV management
  - `project_engagement` - Analytics and engagement tracking
- **Relationships**: Many-to-Many via embedded arrays (ObjectId references)
- **Indexing**: Automatic via `@Indexed` annotations
- **Details**: See [Database Specification](./Database-Specification.md)

### Frontend Specifications

- **Framework**: React 18.2.0 + TypeScript 5.5.3
- **Build Tool**: Vite 5.3.3
- **State Management**: Zustand 4.5.7
- **Styling**: Styled Components 6.1.11
- **Routing**: React Router 6.23.1
- **i18n**: React i18next 15.6.1 (Korean, English, Japanese)
- **Architecture**: Atomic Design Pattern (Atoms, Molecules, Organisms)
- **API Integration**: Axios with standardized response handling
- **Details**: See [Frontend Specification](./Frontend-Specification.md)

### UI/UX Specifications

- **Design System**: Custom theme with dark mode support
- **Responsive**: Mobile-first approach (640px, 768px, 1024px, 1280px breakpoints)
- **Accessibility**: WCAG AA compliance, keyboard navigation, ARIA labels
- **Animation**: Framer Motion for smooth transitions
- **Components**: Reusable UI components following Nielsen's Heuristics
- **Details**: See [UI/UX Specification](./UI-UX-Specification.md)

---

## 📖 Usage Guidelines

### For API Integration

1. **Read API Specification**: Review [API Specification](./API-Specification.md) for endpoint details
2. **Check Request/Response Formats**: Understand `ApiResponse<T>` envelope structure
3. **Review Authentication**: JWT token handling and Google OAuth flow
4. **Test Endpoints**: Use Swagger UI at `http://localhost:8080/swagger-ui.html`
5. **Error Handling**: Understand `ErrorCode` enum and error response format

### For Database Operations

1. **Review Schema**: Check [Database Specification](./Database-Specification.md) for collection structures
2. **Understand Relationships**: Many-to-Many via embedded arrays
3. **Check Validation Rules**: Application-level and database-level constraints
4. **Review Indexes**: Optimize queries using existing indexes
5. **Migration Strategy**: Follow MongoDB migration patterns

### For Frontend Development

1. **Component Architecture**: Follow Atomic Design Pattern
2. **Read Frontend Specification**: Review [Frontend Specification](./Frontend-Specification.md) for component contracts
3. **Follow UI/UX Guidelines**: Implement according to [UI/UX Specification](./UI-UX-Specification.md)
4. **State Management**: Use Zustand stores for global state
5. **API Integration**: Use standardized `apiClient` and service modules
6. **Testing**: Follow acceptance criteria and test cases

### For UI/UX Implementation

1. **Design System**: Use theme tokens from `src/styles/theme.ts`
2. **Component Library**: Use existing UI components from `components/ui/`
3. **Accessibility**: Follow WCAG AA guidelines
4. **Responsive Design**: Mobile-first, test all breakpoints
5. **Animation**: Use Framer Motion for smooth transitions
6. **Nielsen's Heuristics**: Ensure compliance in all components

---

## 🔗 Related Documentation

### Design Documents

- **API Design**: [`../api-design.md`](../api-design.md) - Detailed API design and implementation
- **Backend Design**: [`../backend-design.md`](../backend-design.md) - Backend architecture
- **Frontend Design**: [`../frontend-design.md`](../frontend-design.md) - Frontend architecture
- **Architecture Design**: [`../architecture-design.md`](../architecture-design.md) - System architecture

### Implementation Guides

- **Getting Started**: [`../../docs/Getting-Started.md`](../../docs/Getting-Started.md)
- **Deployment Guide**: [`../../docs/Deployment/Deployment-Guide.md`](../../docs/Deployment/Deployment-Guide.md)
- **Testing Guide**: [`../../docs/Testing/README.md`](../../docs/Testing/README.md)

### Additional Resources

- **ADR (Architecture Decision Records)**: [`../ADR/README.md`](../ADR/README.md)
- **Security Implementation**: [`../backend-security-implementation.md`](../backend-security-implementation.md)
- **Frontend Security**: [`../frontend-security-implementation.md`](../frontend-security-implementation.md)

---

## 📊 Specification Status

### Current Version: 2.0.0

All specifications have been updated to reflect the current production implementation:

- ✅ **API Spec**: Updated to `/api/v1`, includes all 7 controllers, standardized error handling
- ✅ **DB Spec**: Migrated from MySQL to MongoDB, includes all 7 collections
- ✅ **Frontend Spec**: Updated to reflect actual component structure and tech stack
- ✅ **UI/UX Spec**: Reflects implemented design system and accessibility features

### Version History

- **v1.0.0**: Initial specifications (MySQL-based, basic API)
- **v2.0.0**: Production-ready specifications (MongoDB, full API, complete frontend)

---

## 🚀 Quick Start

### For New Developers

1. **Read This Index**: Understand the specification structure
2. **Start with API Spec**: Understand the backend API contracts
3. **Review DB Spec**: Understand data models and relationships
4. **Check Frontend Spec**: Understand component architecture
5. **Follow UI/UX Spec**: Implement according to design guidelines

### For API Consumers

1. **Base URL**: `http://localhost:8080/api/v1` (dev) or production URL
2. **Authentication**: JWT Bearer token in `Authorization` header
3. **Response Format**: Always wrapped in `ApiResponse<T>`
4. **Error Handling**: Check `errorCode` and `error` fields
5. **Swagger UI**: Interactive API documentation at `/swagger-ui.html`

### For Frontend Developers

1. **Component Structure**: Follow Atomic Design (Atoms → Molecules → Organisms)
2. **State Management**: Use Zustand stores for global state
3. **API Calls**: Use service modules (`services/projects.ts`, etc.)
4. **Styling**: Use Styled Components with theme tokens
5. **i18n**: Use `useTranslation()` hook for translations

---

## 📝 Contributing

When updating specifications:

1. **Update Version**: Increment version number
2. **Update Date**: Set `Last Updated` to current date
3. **Maintain Consistency**: Ensure all specs align with implementation
4. **Document Changes**: Note breaking changes in version history
5. **Review**: Have specifications reviewed before merging

---

## 🔍 Specification Details

### API Specification Highlights

- **7 Controllers**: Projects, Academics, TechStacks, Auth, Contact, Resumes, Engagement
- **Standardized Responses**: `ApiResponse<T>` with metadata
- **Error Codes**: `ErrorCode` enum for consistent error handling
- **Validation**: Custom validators (`@ValidMongoId`, `@ValidUrl`, `@ValidDateRange`)
- **Pagination**: `PageResponse<T>` for all list endpoints
- **Caching**: TechStackService cached for performance

### Database Specification Highlights

- **7 Collections**: Projects, Academics, TechStacks, Users, Contacts, Resumes, Engagement
- **MongoDB ObjectId**: All IDs are 24-character hex strings
- **Embedded Arrays**: Many-to-Many relationships via ID arrays
- **Indexes**: Automatic via `@Indexed` annotations
- **Validation**: Application-level via Jakarta Bean Validation
- **Caching**: TechStacks collection cached (1 hour TTL)

### Frontend Specification Highlights

- **Atomic Design**: Atoms, Molecules, Organisms structure
- **3 Languages**: Korean (default), English, Japanese
- **Dark Mode**: Full dark mode support with theme toggle
- **Responsive**: Mobile-first, 4 breakpoints
- **Accessibility**: WCAG AA compliance, keyboard navigation
- **Performance**: Code splitting, lazy loading, debouncing

### UI/UX Specification Highlights

- **Design System**: Custom theme with consistent tokens
- **Component Library**: 10+ reusable UI components
- **Nielsen's Heuristics**: All components follow usability principles
- **Animation**: Framer Motion for smooth transitions
- **Accessibility**: ARIA labels, focus management, skip links
- **Responsive**: Mobile, tablet, desktop layouts

---

**Last Updated**: 2025-11-15  
**Maintained By**: Development Team  
**Version**: 2.0.0
