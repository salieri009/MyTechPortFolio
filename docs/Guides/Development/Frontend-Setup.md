---
title: "Frontend Setup Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Frontend Developers"]
prerequisites: ["Getting-Started.md"]
related_docs: ["Backend-Setup.md", "Specifications/Frontend-Specification.md"]
maintainer: "Development Team"
---

# Frontend Setup Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

This guide provides step-by-step instructions for setting up the frontend development environment for MyTechPortfolio.

---

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (comes with Node.js)
- **Git**: 2.30.0 or higher

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/salieri009/MyTechPortfolio.git
cd MyTechPortfolio/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `frontend` directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# EmailJS (optional)
VITE_EMAILJS_SERVICEID=your-service-id
VITE_EMAILJS_TEMPLATEID=your-template-id
VITE_EMAILJS_PUBLICKEY=your-public-key

# Analytics (optional)
VITE_GA_MEASUREMENT_ID=your-ga-id
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing

```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type check
npm run format       # Format code with Prettier
```

---

## Project Structure

```
frontend/
?œâ??€ src/
??  ?œâ??€ components/     # React components
??  ?œâ??€ pages/          # Page components
??  ?œâ??€ services/       # API services
??  ?œâ??€ stores/         # Zustand stores
??  ?œâ??€ styles/         # Styled components themes
??  ?œâ??€ hooks/          # Custom React hooks
??  ?œâ??€ utils/          # Utility functions
??  ?œâ??€ types/          # TypeScript types
??  ?”â??€ i18n/           # Internationalization
?œâ??€ public/             # Static assets
?œâ??€ package.json        # Dependencies
?œâ??€ tsconfig.json       # TypeScript config
?”â??€ vite.config.ts      # Vite configuration
```

---

## Development Workflow

### Adding a New Component

1. Create component file in appropriate directory
2. Follow Atomic Design principles
3. Add TypeScript types
4. Write tests
5. Update documentation

### Adding a New Page

1. Create page component in `pages/`
2. Add route in `App.tsx`
3. Update navigation if needed
4. Add translations

### API Integration

1. Create service in `services/`
2. Use `apiClient` for requests
3. Handle errors appropriately
4. Add loading states

---

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill
```

### Module Not Found

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in IDE
# Or clear cache
rm -rf node_modules/.vite
```

See [Troubleshooting Guide](../Troubleshooting/Common-Issues.md) for more solutions.

---

## Related Documentation

- [Backend Setup](./Backend-Setup.md)
- [Frontend Specification](../Specifications/Frontend-Specification.md)
- [Component Guidelines](../Best-Practices/Component-Guidelines.md)
- [Getting Started Guide](../Getting-Started.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team


