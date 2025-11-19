# GitHub Actions Deployment Guide

> **Document Version**: 1.0.0  
> **Last Updated**: 2025-11-19  
> **Author**: 20-Year Senior Technical Writer  
> **Target Audience**: DevOps Engineers, Platform Engineers, CI/CD Specialists  
> **Estimated Setup Time**: 1-2 hours  
> **Maintenance Level**: Enterprise-Grade

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Initial Setup](#initial-setup)
5. [Workflow Configuration](#workflow-configuration)
6. [Environment Configuration](#environment-configuration)
7. [Deployment Workflow](#deployment-workflow)
8. [Multi-Environment Setup](#multi-environment-setup)
9. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
10. [Best Practices](#best-practices)
11. [Advanced Configuration](#advanced-configuration)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Appendix](#appendix)

---

## Overview

This guide provides comprehensive instructions for deploying the MyTechPortfolio application using GitHub Actions CI/CD. GitHub Actions offers native integration with GitHub repositories, providing a seamless development-to-deployment workflow without requiring external CI/CD platforms.

### Key Features

- **Native GitHub Integration**: Built directly into GitHub repositories
- **Free for Public Repos**: Unlimited minutes for public repositories
- **Matrix Builds**: Parallel builds for multiple environments
- **Workflow Reusability**: Reusable workflows and composite actions
- **Secrets Management**: GitHub Secrets for secure credential storage
- **Multi-Environment Support**: Dev, Staging, and Production environments
- **Docker Support**: Native Docker build and push capabilities
- **Artifact Management**: Built-in artifact storage and download

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│              (Source Code + Workflows)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions (CI/CD)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Build      │→ │    Test      │→ │   Deploy     │      │
│  │   Workflow   │  │   Workflow   │  │   Workflow   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ├───► Docker Hub / GitHub Container Registry
                         │
                         ├───► Azure Container Apps
                         │
                         ├───► AWS ECS / EKS
                         │
                         └───► Vercel / Netlify (Frontend)
```

---

## Prerequisites

### Required Accounts and Services

1. **GitHub Account**
   - Active GitHub account
   - Repository with appropriate permissions
   - GitHub Actions enabled (enabled by default)

2. **Target Deployment Platform** (Choose one or more)
   - **Azure**: Azure subscription, Container Registry, Container Apps
   - **AWS**: AWS account, ECR, ECS/EKS
   - **Vercel/Netlify**: Account for frontend deployment
   - **Docker Hub**: Account for container registry (optional)

3. **Required Services** (Platform-specific)
   - Container Registry (ACR, ECR, or Docker Hub)
   - Container Orchestration (Azure Container Apps, AWS ECS/EKS)
   - Secrets Management (GitHub Secrets, Azure Key Vault, AWS Secrets Manager)

### Required Tools

1. **Git** (v2.40.0 or later)
   ```bash
   # Verify installation
   git --version
   ```

2. **Docker Desktop** (v4.20.0 or later) - For local testing
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

3. **GitHub CLI** (optional, for automation)
   ```bash
   # Install GitHub CLI
   # Windows
   winget install GitHub.cli
   
   # macOS
   brew install gh
   
   # Linux
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update
   sudo apt install gh
   
   # Verify installation
   gh --version
   ```

### Required Knowledge

- Basic understanding of YAML syntax
- Familiarity with GitHub workflows
- Understanding of Docker and containerization
- Knowledge of CI/CD concepts
- Basic understanding of the target deployment platform

---

## Architecture Overview

### Workflow Structure

GitHub Actions workflows are defined in `.github/workflows/` directory:

```
.github/
└── workflows/
    ├── ci.yml                    # Continuous Integration
    ├── cd-azure.yml             # Azure Deployment
    ├── cd-aws.yml               # AWS Deployment
    ├── cd-vercel.yml            # Vercel Deployment (Frontend)
    └── reusable/
        ├── build-backend.yml    # Reusable backend build
        ├── build-frontend.yml   # Reusable frontend build
        └── deploy-container.yml # Reusable container deployment
```

### Workflow Triggers

| Trigger | Condition | Workflow |
|---------|-----------|----------|
| `push` to `main` | Production deployment | Full CI/CD pipeline |
| `push` to `develop` | Development deployment | CI + Dev deployment |
| `pull_request` | PR validation | CI only (no deployment) |
| `workflow_dispatch` | Manual trigger | Full pipeline |
| `schedule` | Cron schedule | Nightly builds/tests |

### Workflow Stages

1. **Build Stage**
   - Install dependencies
   - Build Docker images
   - Run linting and type checking
   - Push images to registry

2. **Test Stage**
   - Backend unit tests
   - Backend integration tests
   - Frontend unit tests
   - Security scanning
   - Code coverage

3. **Deploy Stage**
   - Environment-specific deployment
   - Health checks
   - Smoke tests
   - Rollback on failure

---

## Initial Setup

### Step 1: Repository Configuration

#### 1.1 Enable GitHub Actions

GitHub Actions is enabled by default. Verify in repository settings:

1. Navigate to **Settings** → **Actions** → **General**
2. Ensure **Allow all actions and reusable workflows** is selected
3. Configure **Workflow permissions**:
   - **Read and write permissions** (for deployments)
   - **Allow GitHub Actions to create and approve pull requests**

#### 1.2 Configure Branch Protection

1. Navigate to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select required status checks:
     - `build-backend`
     - `build-frontend`
     - `test-backend`
     - `test-frontend`

### Step 2: Configure GitHub Secrets

#### 2.1 Navigate to Secrets

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

#### 2.2 Add Required Secrets

**For Azure Deployment:**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AZURE_CLIENT_ID` | Azure service principal client ID | `12345678-1234-1234-1234-123456789012` |
| `AZURE_CLIENT_SECRET` | Azure service principal secret | `your-secret-value` |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID | `12345678-1234-1234-1234-123456789012` |
| `AZURE_TENANT_ID` | Azure tenant ID | `12345678-1234-1234-1234-123456789012` |
| `ACR_NAME` | Azure Container Registry name | `portfolioacr` |
| `RESOURCE_GROUP` | Azure resource group | `portfolio-rg` |

**For AWS Deployment:**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `ECR_REPOSITORY_BACKEND` | ECR repository for backend | `portfolio/backend` |
| `ECR_REPOSITORY_FRONTEND` | ECR repository for frontend | `portfolio/frontend` |
| `ECS_CLUSTER` | ECS cluster name | `portfolio-cluster` |
| `ECS_SERVICE_BACKEND` | ECS service name for backend | `portfolio-backend-prod` |
| `ECS_SERVICE_FRONTEND` | ECS service name for frontend | `portfolio-frontend-prod` |

**For Application Secrets:**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-abcdef123456` |
| `JWT_SECRET` | JWT signing secret | `your-very-long-jwt-secret-minimum-64-characters` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://admin:password@host:27017/portfolio` |
| `VITE_API_BASE_URL` | Frontend API base URL | `https://api.yourdomain.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Frontend Google OAuth client ID | `123456789-abc.apps.googleusercontent.com` |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | `G-XXXXXXXXXX` |

#### 2.3 Add Environment Secrets (Optional)

For environment-specific secrets:

1. Navigate to **Settings** → **Environments**
2. Create environments: `development`, `staging`, `production`
3. Add environment-specific secrets
4. Configure protection rules (required reviewers for production)

### Step 3: Create Workflow Directory

```bash
# Create workflow directory
mkdir -p .github/workflows
mkdir -p .github/workflows/reusable
```

---

## Workflow Configuration

### Main CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  JAVA_VERSION: '21'

jobs:
  # Backend Build and Test
  backend:
    name: Backend CI
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'gradle'

      - name: Grant execute permission for gradlew
        run: chmod +x backend/gradlew
        working-directory: backend

      - name: Build with Gradle
        run: ./gradlew build -x test
        working-directory: backend

      - name: Run unit tests
        run: ./gradlew test
        working-directory: backend

      - name: Generate test report
        uses: dorny/test-reporter@v1
        if: success() || failure()
        with:
          name: Backend Unit Tests
          path: backend/build/test-results/test/*.xml
          reporter: java-junit
          fail-on-error: false

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: backend/build/reports/jacoco/test/jacocoTestReport.xml
          flags: backend
          name: backend-coverage

  # Frontend Build and Test
  frontend:
    name: Frontend CI
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: frontend

      - name: Run linter
        run: npm run lint
        working-directory: frontend

      - name: Run type check
        run: npm run type-check
        working-directory: frontend
        continue-on-error: true

      - name: Build
        run: npm run build
        working-directory: frontend
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
          VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}
          VITE_USE_BACKEND_API: 'true'

      - name: Run unit tests
        run: npm run test:coverage
        working-directory: frontend

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: frontend/coverage/coverage-final.json
          flags: frontend
          name: frontend-coverage

  # Security Scanning
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Azure Deployment Workflow

Create `.github/workflows/cd-azure.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main, develop ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - development
          - staging
          - production

env:
  AZURE_RESOURCE_GROUP: portfolio-rg
  ACR_NAME: portfolioacr

jobs:
  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment || (github.ref == 'refs/heads/main' && 'production' || 'staging') }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # Backend Build and Push
      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Build backend
        run: ./gradlew build -x test
        working-directory: backend

      - name: Log in to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: ${{ env.ACR_NAME }}.azurecr.io
          username: ${{ secrets.AZURE_CLIENT_ID }}
          password: ${{ secrets.AZURE_CLIENT_SECRET }}

      - name: Build and push backend image
        run: |
          docker build -t ${{ env.ACR_NAME }}.azurecr.io/portfolio/backend:${{ github.sha }} ./backend
          docker build -t ${{ env.ACR_NAME }}.azurecr.io/portfolio/backend:latest ./backend
          docker push ${{ env.ACR_NAME }}.azurecr.io/portfolio/backend:${{ github.sha }}
          docker push ${{ env.ACR_NAME }}.azurecr.io/portfolio/backend:latest

      # Frontend Build and Push
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: frontend

      - name: Build frontend
        run: npm run build
        working-directory: frontend
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
          VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}
          VITE_USE_BACKEND_API: 'true'

      - name: Build and push frontend image
        run: |
          docker build -t ${{ env.ACR_NAME }}.azurecr.io/portfolio/frontend:${{ github.sha }} ./frontend
          docker build -t ${{ env.ACR_NAME }}.azurecr.io/portfolio/frontend:latest ./frontend
          docker push ${{ env.ACR_NAME }}.azurecr.io/portfolio/frontend:${{ github.sha }}
          docker push ${{ env.ACR_NAME }}.azurecr.io/portfolio/frontend:latest

      # Deploy to Azure Container Apps
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Deploy backend to Azure Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          acrName: ${{ env.ACR_NAME }}
          containerAppName: portfolio-backend-${{ github.event.inputs.environment || (github.ref == 'refs/heads/main' && 'prod' || 'staging') }}
          resourceGroup: ${{ env.AZURE_RESOURCE_GROUP }}
          imageToDeploy: ${{ env.ACR_NAME }}.azurecr.io/portfolio/backend:${{ github.sha }}

      - name: Deploy frontend to Azure Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          acrName: ${{ env.ACR_NAME }}
          containerAppName: portfolio-frontend-${{ github.event.inputs.environment || (github.ref == 'refs/heads/main' && 'prod' || 'staging') }}
          resourceGroup: ${{ env.AZURE_RESOURCE_GROUP }}
          imageToDeploy: ${{ env.ACR_NAME }}.azurecr.io/portfolio/frontend:${{ github.sha }}

      - name: Health check
        run: |
          BACKEND_URL=$(az containerapp show \
            --name portfolio-backend-${{ github.event.inputs.environment || (github.ref == 'refs/heads/main' && 'prod' || 'staging') }} \
            --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
            --query "properties.configuration.ingress.fqdn" \
            --output tsv)
          curl -f "https://$BACKEND_URL/api/actuator/health" || exit 1
```

### AWS Deployment Workflow

Create `.github/workflows/cd-aws.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1

jobs:
  deploy:
    name: Deploy to AWS ECS
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push backend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: ${{ secrets.ECR_REPOSITORY_BACKEND }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Build and push frontend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: ${{ secrets.ECR_REPOSITORY_FRONTEND }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build \
            --build-arg VITE_API_BASE_URL=${{ secrets.VITE_API_BASE_URL }} \
            --build-arg VITE_GOOGLE_CLIENT_ID=${{ secrets.VITE_GOOGLE_CLIENT_ID }} \
            --build-arg VITE_GA_MEASUREMENT_ID=${{ secrets.VITE_GA_MEASUREMENT_ID }} \
            --build-arg VITE_USE_BACKEND_API=true \
            -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./frontend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Update ECS service
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: infra/aws/ecs/backend-task-definition.json
          service: ${{ secrets.ECS_SERVICE_BACKEND }}
          cluster: ${{ secrets.ECS_CLUSTER }}
          wait-for-service-stability: true
```

---

## Environment Configuration

### Environment-Specific Workflows

Create separate workflow files for each environment:

- `.github/workflows/deploy-dev.yml` - Development environment
- `.github/workflows/deploy-staging.yml` - Staging environment
- `.github/workflows/deploy-prod.yml` - Production environment

### Environment Protection Rules

1. Navigate to **Settings** → **Environments**
2. Create environment: `production`
3. Configure protection rules:
   - ✅ Required reviewers (add team members)
   - ✅ Wait timer (optional, e.g., 5 minutes)
   - ✅ Deployment branches (only `main` branch)

---

## Deployment Workflow

### Automatic Deployment Flow

```
┌─────────────────┐
│  Code Push      │
│  (Git Push)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Workflow Trigger│
│ (push/PR)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│  Build Stage    │ ───→ │   Test Stage    │
│  (Parallel)     │      │  (Parallel)     │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │                        ▼
         │                ┌─────────────────┐
         │                │ Security Scan    │
         │                └────────┬────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  Deploy Stage   │ ←─── │  All Tests Pass │
│  (Environment)  │      └─────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Health Checks   │
│ Smoke Tests     │
└─────────────────┘
```

### Manual Deployment

1. Navigate to **Actions** tab
2. Select workflow (e.g., "Deploy to Azure")
3. Click **Run workflow**
4. Select branch and environment
5. Click **Run workflow** button

---

## Multi-Environment Setup

### Environment Matrix Strategy

```yaml
strategy:
  matrix:
    environment: [development, staging, production]
    include:
      - environment: development
        resource-group: portfolio-rg-dev
        container-app: portfolio-backend-dev
      - environment: staging
        resource-group: portfolio-rg-staging
        container-app: portfolio-backend-staging
      - environment: production
        resource-group: portfolio-rg
        container-app: portfolio-backend-prod
```

---

## Monitoring and Troubleshooting

### Workflow Status

- **Green checkmark**: All jobs passed
- **Red X**: One or more jobs failed
- **Yellow circle**: Workflow in progress
- **Gray circle**: Workflow cancelled

### Viewing Logs

1. Navigate to **Actions** tab
2. Select workflow run
3. Click on job to view logs
4. Expand steps to see detailed output

### Common Issues

#### Issue 1: Authentication Failures

**Solution**: Verify secrets are correctly configured:
- Check secret names match workflow references
- Verify secret values are correct
- Ensure service principal/credentials have required permissions

#### Issue 2: Build Failures

**Solution**: Check build logs:
- Verify dependencies are up to date
- Check for syntax errors
- Review environment-specific configurations

#### Issue 3: Deployment Timeouts

**Solution**: Increase timeout values:
```yaml
timeout-minutes: 30
```

---

## Best Practices

### Security Best Practices

1. **Never commit secrets**
   - Use GitHub Secrets for all sensitive data
   - Use environment-specific secrets
   - Rotate secrets regularly

2. **Minimize permissions**
   - Use least-privilege principle
   - Use OIDC for cloud authentication (when available)
   - Review and audit permissions regularly

3. **Enable branch protection**
   - Require PR reviews
   - Require status checks
   - Prevent force pushes

### Performance Best Practices

1. **Use caching**
   - Cache dependencies (npm, Gradle)
   - Cache Docker layers
   - Use matrix builds for parallel execution

2. **Optimize workflow triggers**
   - Use path filters to avoid unnecessary runs
   - Use workflow_dispatch for manual triggers
   - Schedule workflows for non-critical tasks

3. **Parallel execution**
   - Run independent jobs in parallel
   - Use matrix strategy for multiple environments
   - Optimize job dependencies

---

## Advanced Configuration

### Reusable Workflows

Create `.github/workflows/reusable/build-backend.yml`:

```yaml
name: Build Backend

on:
  workflow_call:
    inputs:
      java-version:
        required: false
        type: string
        default: '21'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: ${{ inputs.java-version }}
      - run: ./gradlew build
        working-directory: backend
```

Use in main workflow:

```yaml
jobs:
  build-backend:
    uses: ./.github/workflows/reusable/build-backend.yml
    with:
      java-version: '21'
```

### Composite Actions

Create `.github/actions/build-docker/action.yml`:

```yaml
name: 'Build and Push Docker Image'
description: 'Build and push Docker image to registry'
inputs:
  image-name:
    description: 'Docker image name'
    required: true
  registry:
    description: 'Container registry'
    required: true
  tag:
    description: 'Image tag'
    required: true
    default: 'latest'

runs:
  using: 'composite'
  steps:
    - name: Build image
      shell: bash
      run: |
        docker build -t ${{ inputs.registry }}/${{ inputs.image-name }}:${{ inputs.tag }} .
    
    - name: Push image
      shell: bash
      run: |
        docker push ${{ inputs.registry }}/${{ inputs.image-name }}:${{ inputs.tag }}
```

---

## Troubleshooting Guide

### Debugging Workflows

Enable debug logging:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Resource not accessible by integration` | Insufficient permissions | Check workflow permissions in repository settings |
| `Secret not found` | Secret name mismatch | Verify secret name matches workflow reference |
| `Authentication failed` | Invalid credentials | Verify credentials in secrets |
| `Build timeout` | Long-running build | Increase timeout or optimize build process |

---

## Appendix

### A. Workflow Examples

See workflow files in `.github/workflows/` directory.

### B. Useful Actions

- `actions/checkout@v4` - Checkout code
- `actions/setup-node@v4` - Setup Node.js
- `actions/setup-java@v4` - Setup Java
- `azure/login@v1` - Azure authentication
- `aws-actions/configure-aws-credentials@v4` - AWS authentication
- `docker/login-action@v3` - Docker registry login
- `docker/build-push-action@v5` - Build and push Docker images

### C. Cost Considerations

**GitHub Actions Pricing** (as of 2025):
- **Public repositories**: Free (unlimited minutes)
- **Private repositories**: 
  - Free: 2,000 minutes/month
  - Pro: 3,000 minutes/month
  - Team: 3,000 minutes/month
  - Enterprise: 50,000 minutes/month

**Optimization Tips**:
- Use self-hosted runners for private repos
- Cache dependencies to reduce build time
- Use matrix builds efficiently
- Monitor usage in repository insights

### D. Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)

---

**Document End**

*Last Updated: 2025-11-19*  
*Next Review: 2025-12-19*

