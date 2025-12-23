# Getting Started

This tutorial guides you step-by-step on how to start the MyPortFolio Frontend project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Installation](#project-installation)
- [Running the Development Server](#running-the-development-server)
- [Understanding the Project Structure](#understanding-the-project-structure)
- [Next Steps](#next-steps)

## Prerequisites

Before starting the project, ensure the following are installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn, pnpm)
- **Git**: Latest version

### Verify Installation

Verify installation by running the following commands in your terminal:

```bash
node --version
npm --version
git --version
```

## Project Installation

1. **Clone the repository** (Skip this step if already cloned)

```bash
git clone <repository-url>
cd MyPortFolio/frontend
```

2. **Install dependencies**

```bash
npm install
```

This command installs all dependencies defined in `package.json`.

Key dependencies:
- React 18.2.0
- TypeScript 5.5.3
- Vite 5.3.3
- Styled Components 6.1.11
- React Router DOM 6.23.1
- i18next 25.3.4
- Zustand 4.5.7

## Running the Development Server

Once installation is complete, you can start the development server:

```bash
npm run dev
```

When the server starts, access it in your browser at `http://localhost:5173`.

### Development Server Features

- **Hot Module Replacement (HMR)**: Page automatically refreshes on code changes
- **Fast Refresh**: React component state is preserved during updates
- **API Proxy**: `/api` requests are automatically proxied to `http://localhost:8080/api/v1`

## Understanding the Project Structure

The project is organized with the following structure:

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API and business logic
│   ├── stores/        # State management (Zustand)
│   ├── styles/        # Theme and global styles
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   └── i18n/          # Internationalization settings
├── public/            # Static files
├── docs/              # Documentation
└── package.json       # Project configuration
```

### Key Directory Descriptions

- **components/**: Organized according to Atomic Design Pattern (atoms, molecules, organisms)
- **pages/**: Page components connected via React Router
- **services/**: Service layer for backend API communication
- **stores/**: Global state management using Zustand
- **styles/**: Styled Components theme and global styles

## Next Steps

Now that you've started the project, proceed with the following tutorials:

1. [Creating Your First Component](./creating-your-first-component.md) - Create your first component
2. [Understanding Styling System](./understanding-styling-system.md) - Understand the styling system
3. [Setting Up Routing](./setting-up-routing.md) - Set up routing

Or find how to perform specific tasks in the [How-to Guides](../how-to/).

## Troubleshooting

### Port Already in Use

To use a different port, change the port in `vite.config.ts` or set an environment variable:

```bash
PORT=3000 npm run dev
```

### Dependency Installation Errors

Delete `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

Check TypeScript types:

```bash
npm run build
```
