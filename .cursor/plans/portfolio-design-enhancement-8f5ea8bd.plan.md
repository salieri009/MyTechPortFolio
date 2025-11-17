<!-- 8f5ea8bd-2d86-4155-81dc-f7b85a2f7acc 8a8a4e70-c770-43ed-9814-8ca5c53fbe54 -->
# Azure Pipelines CI/CD Implementation Plan

## Overview

This plan implements enterprise-grade Azure Pipelines CI/CD for MyPortFolio, following 20-year DevOps and Software Engineer best practices. The pipeline will support multi-environment deployments, automated testing, security scanning, and comprehensive monitoring.

## Architecture Decisions

### Deployment Target

- **Backend**: Azure Container Apps (matches existing azure-deploy.sh)
- **Frontend**: Azure Container Apps (matches existing azure-deploy.sh)
- **Database**: Azure Cosmos DB for MongoDB (production) or Azure Container Instance (dev/staging)
- **Container Registry**: Azure Container Registry (ACR)

### Pipeline Structure

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Trigger   │───►│   Build     │───►│   Test      │───►│   Deploy    │
│   (Git)     │    │   (Docker)  │    │   (Unit/    │    │   (ACR +    │
│             │    │             │    │    E2E)     │    │    CA)      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Implementation Files

### 1. Main Pipeline: `azure-pipelines.yml`

**Location**: Root directory

**Key Features**:

- Multi-stage pipeline (Build → Test → Deploy)
- Path-based triggers (backend/ **or frontend/**)
- Matrix strategy for parallel builds
- Environment-based deployments (dev, staging, production)
- Approval gates for production
- Rollback capabilities

**Stages**:

1. **Build Stage**

                                                                                                - Build backend Docker image
                                                                                                - Build frontend Docker image
                                                                                                - Push to ACR with tags (commit SHA, branch, latest)
                                                                                                - Generate build artifacts

2. **Test Stage**

                                                                                                - Backend unit tests (Gradle)
                                                                                                - Frontend unit tests (npm)
                                                                                                - Integration tests
                                                                                                - Code coverage reporting
                                                                                                - Security scanning (Trivy, Snyk)

3. **Deploy Stage** (Environment-specific)

                                                                                                - Deploy to dev (auto)
                                                                                                - Deploy to staging (auto, after dev success)
                                                                                                - Deploy to production (manual approval)

### 2. Backend Pipeline: `azure-pipelines-backend.yml`

**Location**: `backend/azure-pipelines-backend.yml`

**Responsibilities**:

- Java 21 setup
- Gradle build with caching
- Unit test execution
- Integration test execution
- Docker image build
- ACR push
- Test coverage reporting

### 3. Frontend Pipeline: `azure-pipelines-frontend.yml`

**Location**: `frontend/azure-pipelines-frontend.yml`

**Responsibilities**:

- Node.js 18 setup
- npm ci with caching
- Linting (ESLint)
- Unit test execution
- Build with environment variables
- Docker image build
- ACR push
- Bundle size analysis

### 4. Infrastructure as Code: `infra/pipeline-variables.yml`

**Location**: `infra/pipeline-variables.yml`

**Contains**:

- Environment-specific variables
- Resource group names
- ACR names
- Container App names
- MongoDB connection strings (Key Vault references)

### 5. Pipeline Templates

**Location**: `.azure/pipelines/templates/`

**Templates**:

- `build-docker-image.yml`: Reusable Docker build template
- `run-tests.yml`: Reusable test execution template
- `deploy-container-app.yml`: Reusable deployment template
- `security-scan.yml`: Security scanning template
- `notify.yml`: Notification template (Slack/Teams/Email)

## Detailed Implementation

### Stage 1: Build

#### Backend Build

```yaml
- task: Gradle@3
  inputs:
    workingDirectory: 'backend'
    gradleWrapperFile: 'backend/gradlew'
    gradleOptions: '-Xmx3072m'
    tasks: 'clean build'
    publishJUnitResults: true
    testResultsFiles: '**/TEST-*.xml'
    codeCoverageToolOption: 'JaCoCo'
```

#### Frontend Build

```yaml
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
- script: |
    cd frontend
    npm ci
    npm run lint
    npm run build
  displayName: 'Build Frontend'
```

#### Docker Build & Push

```yaml
- task: Docker@2
  inputs:
    containerRegistry: 'ACR_Connection'
    repository: 'portfolio-backend'
    command: 'buildAndPush'
    Dockerfile: 'backend/Dockerfile'
    tags: |
      $(Build.BuildId)
      $(Build.SourceBranchName)
      latest
```

### Stage 2: Test

#### Test Cases Structure

**Test Cases Location**: `.azure/pipelines/test-cases/`

**Test Case Files**:

- `backend-unit-tests.yml`: Backend unit test execution
- `backend-integration-tests.yml`: Backend integration test execution
- `frontend-unit-tests.yml`: Frontend unit test execution
- `frontend-integration-tests.yml`: Frontend integration test execution
- `api-contract-tests.yml`: API contract testing
- `e2e-tests.yml`: End-to-end test execution
- `security-tests.yml`: Security test execution
- `performance-tests.yml`: Performance test execution

**Test Case Template Structure**:

```yaml
# Example: .azure/pipelines/test-cases/backend-unit-tests.yml
parameters:
 - name: workingDirectory
    type: string
 - name: testResultsPattern
    type: string
    default: '**/TEST-*.xml'

steps:
 - task: Gradle@3
    displayName: 'Run Unit Tests'
    inputs:
      workingDirectory: ${{ parameters.workingDirectory }}
      tasks: 'test'
      publishJUnitResults: true
      testResultsFiles: ${{ parameters.testResultsPattern }}
      codeCoverageToolOption: 'JaCoCo'
      codeCoverageClassFiles: '**/build/classes/java/main/**/*.class'
```

#### Unit Tests

- **Backend**: Gradle test with JaCoCo coverage
                                                                - Test location: `backend/src/test/java`
                                                                - Coverage report: `backend/build/reports/jacoco/test/html/index.html`
                                                                - Coverage threshold: 80%+ (configurable per module)

- **Frontend**: Jest/Vitest with coverage
                                                                - Test location: `frontend/src/**/*.test.tsx`, `frontend/src/**/*.test.ts`
                                                                - Coverage report: `frontend/coverage/`
                                                                - Coverage threshold: 80%+ (configurable per component)

#### Integration Tests

- **API Integration Tests**
                                                                - Location: `backend/src/test/java/**/*IntegrationTest.java`
                                                                - Uses: Spring Boot Test, MockMvc
                                                                - Test cases: All API endpoints, request/response validation

- **Database Integration Tests**
                                                                - Location: `backend/src/test/java/**/*RepositoryTest.java`
                                                                - Uses: Testcontainers with MongoDB
                                                                - Test cases: CRUD operations, query validation

- **E2E Tests**
                                                                - Location: `e2e/tests/`
                                                                - Uses: Playwright
                                                                - Test cases: User flows, cross-browser testing

#### Security Scanning

- **Container Scanning**: Trivy
                                                                - Scans: Docker images for vulnerabilities
                                                                - Output: SARIF format for Azure Security Center

- **Dependency Scanning**: Snyk
                                                                - Scans: npm packages, Gradle dependencies
                                                                - Output: JSON report with vulnerability details

- **API Security Testing**: OWASP ZAP
                                                                - Scans: API endpoints for security vulnerabilities
                                                                - Output: HTML report

### Stage 3: Deploy

#### Environment Strategy

- **dev**: Auto-deploy on push to `develop`
- **staging**: Auto-deploy after dev success
- **production**: Manual approval required

#### Deployment Steps

1. Update Container App with new image
2. Health check validation
3. Smoke tests
4. Rollback on failure

## Security & Best Practices

### Secrets Management

- Azure Key Vault integration
- Pipeline variables for non-sensitive config
- Service connections for ACR, Azure subscriptions

### Compliance

- SBOM (Software Bill of Materials) generation
- Vulnerability scanning
- License compliance checking

### Performance

- Build caching (Gradle, npm)
- Parallel job execution
- Artifact retention policies

### Monitoring

- Pipeline analytics
- Deployment success rates
- Build time tracking
- Cost optimization

## File Structure

```
.
├── azure-pipelines.yml (main pipeline)
├── backend/
│   └── azure-pipelines-backend.yml
├── frontend/
│   └── azure-pipelines-frontend.yml
├── infra/
│   ├── pipeline-variables.yml
│   └── main.bicep (existing)
└── .azure/
    └── pipelines/
        └── templates/
            ├── build-docker-image.yml
            ├── run-tests.yml
            ├── deploy-container-app.yml
            ├── security-scan.yml
            └── notify.yml
```

## Implementation Phases

### Phase 1: Core Pipeline (Week 1)

1. Create main azure-pipelines.yml
2. Implement build stages for backend and frontend
3. Set up ACR integration
4. Basic deployment to dev environment

### Phase 2: Testing Integration (Week 2)

1. Add unit test execution
2. Add integration test execution
3. Set up code coverage reporting
4. Configure test result publishing

### Phase 3: Security & Quality (Week 3)

1. Implement security scanning
2. Add dependency vulnerability scanning
3. Set up code quality gates
4. Configure approval workflows

### Phase 4: Advanced Features (Week 4)

1. Multi-environment deployments
2. Blue-green deployment strategy
3. Rollback mechanisms
4. Monitoring and alerting integration

## Success Criteria

- [ ] All builds complete in < 15 minutes
- [ ] Test coverage > 80%
- [ ] Zero critical security vulnerabilities
- [ ] Automated deployments to dev/staging
- [ ] Manual approval gates for production
- [ ] Rollback capability within 5 minutes
- [ ] Complete audit trail of all deployments

## Dependencies

### Azure Resources Required

- Azure DevOps Organization & Project
- Azure Container Registry (ACR)
- Azure Container Apps Environment
- Azure Key Vault (for secrets)
- Azure Cosmos DB for MongoDB (production)
- Service Connections (ACR, Azure subscription)

### Pipeline Variables to Configure

- `ACR_NAME`: Azure Container Registry name
- `RESOURCE_GROUP`: Azure resource group
- `CONTAINER_APP_ENV`: Container Apps environment name
- `BACKEND_APP_NAME`: Backend container app name
- `FRONTEND_APP_NAME`: Frontend container app name

### Service Connections

- ACR connection (Docker registry)
- Azure subscription connection
- Key Vault connection (for secrets)

## Notes

- Pipeline follows Azure DevOps YAML schema v1.0
- Compatible with Azure Container Apps (matches existing deployment)
- Supports both GitHub and Azure Repos
- Includes comprehensive error handling and retry logic
- Implements industry-standard CI/CD patterns

### To-dos

- [ ] Create main azure-pipelines.yml with multi-stage structure (Build, Test, Deploy)
- [ ] Create backend-specific pipeline template with Gradle build and Docker image creation
- [ ] Create frontend-specific pipeline template with npm build and Docker image creation
- [ ] Create reusable pipeline templates in .azure/pipelines/templates/ directory
- [ ] Configure Azure Container Registry service connection and integration in pipelines
- [ ] Add unit test, integration test, and E2E test stages with coverage reporting
- [ ] Add security scanning stages (Trivy, Snyk, dependency scanning)
- [ ] Configure dev, staging, and production environment deployments with approval gates
- [ ] Add rollback mechanism for failed deployments
- [ ] Create infra/pipeline-variables.yml with environment-specific configuration
- [ ] Configure Azure Key Vault integration for secrets management
- [ ] Add pipeline monitoring, analytics, and alerting configuration