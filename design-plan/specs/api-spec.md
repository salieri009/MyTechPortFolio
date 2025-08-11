# API Specification (Implementation-Ready)

Base URL: `/api`
Auth: none for public portfolio; JWT planned for admin endpoints.
Format: JSON; envelope `{ success, data, error }`

## Conventions
- Pagination: `page` (1-based), `size` (default 12), response includes `page`, `size`, `total`, `items[]`.
- Sorting: `sort` in `field,dir` (e.g., `endDate,desc`).
- Filtering: comma-separated values (e.g., `techStacks=React,TypeScript`).
- Dates: ISO-8601 (YYYY-MM-DD).
- Error codes: 400 validation, 401 unauthorized, 403 forbidden, 404 not found, 409 conflict, 500 server error.

## Schemas
- ProjectSummary: { id: number, title: string, summary: string, startDate: string, endDate: string, techStacks: string[] }
- ProjectDetail: ProjectSummary & { description: string, githubUrl?: string, demoUrl?: string, relatedAcademics?: string[] }
- Academic: { id: number, name: string, semester: string, grade?: string, description?: string }
- TechStack: { id: number, name: string, type: 'Backend'|'Frontend'|'DB'|'DevOps'|'Other' }

## Endpoints

GET /api/projects
- Query: page?, size?, sort?, techStacks?, year?
- 200: { success, data: { page, size, total, items: ProjectSummary[] }, error: null }

GET /api/projects/{id}
- 200: { success, data: ProjectDetail, error: null }
- 404 when not exist

POST /api/projects (admin)
- Body: { title, summary, description, startDate, endDate, githubUrl?, demoUrl?, techStackIds: number[], academicIds?: number[] }
- 201: { success, data: ProjectDetail, error: null }

PUT /api/projects/{id} (admin)
- Body same as POST
- 200: updated ProjectDetail

DELETE /api/projects/{id} (admin)
- 204

GET /api/academics
- Query: semester?, page?, size?
- 200: { success, data: { page, size, total, items: Academic[] }, error: null }

GET /api/academics/{id}
- 200: { success, data: Academic & { relatedProjects: { id, title }[] }, error: null }

GET /api/tech-stacks
- Query: type?
- 200: { success, data: TechStack[], error: null }

## Mock Parity
- Mock functions must return the same envelope and schemas.
- Sorting/filtering/pagination are applied client-side in mock layer to mimic server.

## Security (Future)
- JWT bearer required for admin endpoints; roles: USER (read), ADMIN (write).
- Rate limiting for public endpoints (CloudFront/WAF level or server-level token bucket).
