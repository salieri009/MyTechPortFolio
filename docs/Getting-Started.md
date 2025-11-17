---
title: "Getting Started Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Developers", "DevOps Engineers"]
prerequisites: []
related_docs: ["Important-Concepts.md", "Architecture/README.md"]
maintainer: "Development Team"
---

# Getting Started Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

This guide will help you set up the development environment and get the project running locally.

---

## ?�� Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18.0.0+ | Frontend development |
| **Java** | 21+ | Backend development |
| **MongoDB** | 7.0+ | Database |
| **Docker** | 20.10+ | Containerization (optional) |
| **Git** | 2.30+ | Version control |

---

## ?? Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/salieri009/MyTechPortfolio.git
cd MyTechPortfolio
```

### 2. Backend Setup

```bash
cd backend

# Create environment file
cp ../environment.template .env
# Edit .env with your configuration

# Run the application
./gradlew bootRun
# Windows: gradlew.bat bootRun
```

**Backend will be available at**: http://localhost:8080  
**API Documentation**: http://localhost:8080/swagger-ui.html

### 3. Frontend Setup

```bash
cd frontend

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env
echo "VITE_GOOGLE_CLIENT_ID=your-client-id" >> .env

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at**: http://localhost:5173

### 4. MongoDB Setup

#### Option A: Docker (Recommended)

```bash
docker-compose -f docker-compose.dev.yml up mongodb-dev -d
```

#### Option B: Local Installation

```bash
# Start MongoDB service
mongod --dbpath /data/db
```

---

## ?�� Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
./gradlew test

# Frontend tests
cd frontend
npm run test
```

### Building for Production

```bash
# Backend
cd backend
./gradlew build

# Frontend
cd frontend
npm run build
```

---

## ?�� Next Steps

- Read [Important Concepts](./Important-Concepts.md) for project overview
- Review [Architecture Overview](./Architecture/README.md) for system architecture
- Check [API Specification](./Specifications/API-Specification.md) for API contracts
- See [Deployment Guide](./Deployment/Deployment-Guide.md) for production deployment

---

## ?�� Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find and kill process using port 8080
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill
```

**MongoDB connection failed**
- Check MongoDB is running: `mongosh --eval "db.version()"`
- Verify connection string in `.env`
- Check firewall settings

**CORS errors**
- Verify backend CORS configuration
- Check `VITE_API_BASE_URL` in frontend `.env`
- Ensure backend allows frontend origin

---

**Last Updated**: November 17, 2025


