# My Tech Portfolio

Complete portfolio website with React frontend, Spring Boot backend, and comprehensive planning documentation.

## Project Structure

```
MyPortFolio/
├── design-plan/           # Original design documents
├── design-plan/specs/     # Implementation-ready specifications
├── frontend/              # React + TypeScript + Vite frontend
└── backend/               # Spring Boot backend (to be implemented)
```

## Quick Start (Frontend)

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

## Features

- **Mock Data Mode**: Currently uses mock data; easily switchable to real API
- **Demo Auth**: Authentication flows bypassed for demo; ready for JWT integration
- **Responsive Design**: Mobile-first design with dark mode support
- **Accessibility**: WCAG AA compliant, full keyboard navigation
- **Performance**: Code splitting, lazy loading, optimized builds

## Environment Configuration

### Development (Mock Mode)
```
VITE_USE_MOCK=true
VITE_AUTH_MODE=demo
```

### Production (Real API)
```
VITE_USE_MOCK=false
VITE_AUTH_MODE=jwt
```

## API Integration

When backend is ready:
1. Set `VITE_USE_MOCK=false` in `.env`
2. Services automatically switch from mock to real API calls
3. Auth services switch from demo mode to JWT token handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, styled-components, Zustand
- **Backend**: Spring Boot, MySQL, JPA (planned)
- **Deployment**: AWS S3/CloudFront + Elastic Beanstalk (planned)

## Documentation

- `/design-plan/specs/frontend-spec.md` - Frontend implementation details
- `/design-plan/specs/api-spec.md` - API endpoints and schemas
- `/design-plan/specs/db-spec.md` - Database schema and constraints
- `/design-plan/specs/ui-ux-spec.md` - UI/UX guidelines and components

## Next Steps

1. Implement Spring Boot backend following `/design-plan/specs/api-spec.md`
2. Set up MySQL database using `/design-plan/specs/db-spec.md`
3. Switch frontend to production mode
4. Deploy to AWS infrastructure

## Development Notes

- Mock data includes 3 sample projects with different tech stacks
- Filters and sorting work client-side in mock mode
- All API response envelopes match planned backend format
- Theme tokens and component library ready for customization
