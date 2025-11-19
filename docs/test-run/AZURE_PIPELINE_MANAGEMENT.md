# Azure Pipeline Management Guide

> **Document Version**: 1.0.0  
> **Last Updated**: 2025-11-19  
> **Author**: DevOps Team (30-year Senior Technical Writer)  
> **Status**: Active

## Overview

This document provides comprehensive guidance for managing Azure Pipelines CI/CD for the MyTechPortfolio project. It covers pipeline configuration, test execution, deployment strategies, and troubleshooting.

## Pipeline Architecture

### Pipeline Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Trigger Stage                         │
│  (Branch: main/develop, Path filters)                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Stage 0: Retrieve Secrets                   │
│  (Azure Key Vault integration)                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Stage 1: Build                              │
│  ┌──────────────┐         ┌──────────────┐              │
│  │ Build Backend│         │Build Frontend│              │
│  │ (Parallel)   │         │  (Parallel)  │              │
│  └──────────────┘         └──────────────┘              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Stage 2: Test                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │Backend Unit  │  │Backend Integ │  │Frontend Unit  │ │
│  │   Tests      │  │    Tests     │  │    Tests      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │Frontend Integ│  │   Security   │  │   E2E Tests  │ │
│  │    Tests     │  │   Scanning   │  │  (main only) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Stage 3: Deploy                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Dev Env     │  │ Staging Env  │  │  Prod Env    │ │
│  │ (develop)    │  │  (develop)   │  │   (main)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Pipeline Files

### Main Pipeline Files

1. **`azure-pipelines.yml`** (Root)
   - Multi-stage pipeline orchestrator
   - Coordinates all stages and jobs
   - Environment-specific deployment logic

2. **`backend/azure-pipelines-backend.yml`**
   - Backend-specific standalone pipeline
   - Can run independently for backend-only changes

3. **`frontend/azure-pipelines-frontend.yml`**
   - Frontend-specific standalone pipeline
   - Can run independently for frontend-only changes

### Template Files

**Location**: `.azure/pipelines/templates/`

| Template | Purpose | Usage |
|----------|---------|-------|
| `build-docker-image.yml` | Build and push Docker images to ACR | Build stage |
| `deploy-container-app.yml` | Deploy to Azure Container Apps | Deploy stage |
| `key-vault-integration.yml` | Retrieve secrets from Key Vault | RetrieveSecrets stage |
| `security-scan.yml` | Security vulnerability scanning | Test stage |
| `monitoring-alerts.yml` | Send deployment notifications | Deploy stage |
| `notify.yml` | Notification templates | All stages |

### Test Case Templates

**Location**: `.azure/pipelines/test-cases/`

| Template | Purpose | Framework |
|----------|---------|-----------|
| `backend-unit-tests.yml` | Backend unit tests | Gradle + JUnit 5 |
| `backend-integration-tests.yml` | Backend integration tests | Spring Boot Test |
| `frontend-unit-tests.yml` | Frontend unit tests | Vitest + React Testing Library |
| `frontend-integration-tests.yml` | Frontend integration tests | Vitest + React Testing Library |
| `e2e-tests.yml` | End-to-end tests | Playwright |
| `api-contract-tests.yml` | API contract validation | Postman/Newman |
| `performance-tests.yml` | Performance testing | k6/Lighthouse |
| `security-tests.yml` | Security testing | OWASP ZAP |

## Test Execution in Pipeline

### Backend Tests

#### Unit Tests
```yaml
- template: .azure/pipelines/test-cases/backend-unit-tests.yml
  parameters:
    workingDirectory: 'backend'
```

**Execution Steps**:
1. Install Java 21
2. Cache Gradle dependencies
3. Run `./gradlew test`
4. Publish JUnit test results
5. Publish JaCoCo coverage report

**Coverage Target**: 80%+

#### Integration Tests
```yaml
- template: .azure/pipelines/test-cases/backend-integration-tests.yml
  parameters:
    workingDirectory: 'backend'
```

**Execution Steps**:
1. Install Java 21
2. Cache Gradle dependencies
3. Run integration tests with Testcontainers
4. Publish test results

### Frontend Tests

#### Unit Tests
```yaml
- template: .azure/pipelines/test-cases/frontend-unit-tests.yml
  parameters:
    workingDirectory: 'frontend'
```

**Execution Steps**:
1. Install Node.js 18
2. Cache npm dependencies
3. Run ESLint
4. Run `npm run test:coverage`
5. Publish test results
6. Publish coverage report

**Coverage Target**: 80%+

## Deployment Strategy

### Environment Promotion Flow

```
develop branch
    │
    ├─► Dev Environment (Auto-deploy)
    │       │
    │       └─► Staging Environment (Auto-deploy after Dev success)
    │
main branch
    │
    └─► Production Environment (Manual approval required)
```

### Deployment Conditions

| Environment | Branch | Approval | Auto-rollback |
|-------------|--------|----------|---------------|
| Dev | `develop` | Not required | Yes |
| Staging | `develop` | Not required | Yes |
| Production | `main` | Required | Yes |

### Deployment Process

1. **Pre-deployment**
   - Save current image tags for rollback
   - Validate environment variables
   - Check resource availability

2. **Deployment**
   - Update backend container app
   - Update frontend container app
   - Wait for container app health checks

3. **Post-deployment**
   - Health check validation (5 retries, 10s interval)
   - Smoke tests (production only)
   - Send deployment notifications

4. **Rollback** (on failure)
   - Restore previous image tags
   - Verify rollback success
   - Send rollback notifications

## Configuration Management

### Variable Groups

**Name**: `Portfolio-Pipeline-Variables`

**Required Variables**:

#### Common Variables
- `ACR_NAME`: Azure Container Registry name
- `KEY_VAULT_NAME`: Azure Key Vault name
- `VITE_API_BASE_URL`: Frontend API base URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `VITE_GA_MEASUREMENT_ID`: Google Analytics measurement ID

#### Environment-Specific Variables

**Dev Environment**:
- `RESOURCE_GROUP_DEV`: Resource group name
- `CONTAINER_APP_ENV_DEV`: Container App environment name
- `BACKEND_APP_NAME_DEV`: Backend app name
- `FRONTEND_APP_NAME_DEV`: Frontend app name

**Staging Environment**:
- `RESOURCE_GROUP_STAGING`: Resource group name
- `CONTAINER_APP_ENV_STAGING`: Container App environment name
- `BACKEND_APP_NAME_STAGING`: Backend app name
- `FRONTEND_APP_NAME_STAGING`: Frontend app name

**Production Environment**:
- `RESOURCE_GROUP_PROD`: Resource group name
- `CONTAINER_APP_ENV_PROD`: Container App environment name
- `BACKEND_APP_NAME_PROD`: Backend app name
- `FRONTEND_APP_NAME_PROD`: Frontend app name

### Service Connections

| Connection Name | Type | Purpose |
|----------------|-----|---------|
| `ACR_Connection` | Azure Container Registry | Push/pull Docker images |
| `Azure_Subscription_Connection` | Azure Resource Manager | Deploy to Azure resources |
| `Key_Vault_Connection` | Azure Key Vault | Retrieve secrets |

### Environments

Create the following environments in Azure DevOps:

1. **dev**
   - No approval gates
   - Auto-deploy on `develop` branch

2. **staging**
   - No approval gates
   - Auto-deploy after dev success

3. **production**
   - Manual approval required
   - Deploy on `main` branch only

## Test Execution Commands

### Local Execution

#### Backend Tests
```bash
cd backend

# Run all tests
./gradlew.bat test

# Run specific test class
./gradlew.bat test --tests "ProjectServiceTest"

# Run with coverage
./gradlew.bat test jacocoTestReport
```

#### Frontend Tests
```bash
cd frontend

# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test Button.test.tsx
```

### Pipeline Execution

Tests run automatically on:
- Push to `main` or `develop` branch
- Pull request creation
- Manual pipeline trigger

## Monitoring and Alerts

### Pipeline Notifications

**Channels**:
- Azure DevOps notifications
- Email (configured in Variable Group)
- Slack/Teams webhooks (optional)

**Notification Triggers**:
- Pipeline start
- Test failures
- Deployment success/failure
- Rollback events

### Health Checks

**Backend Health Check**:
- Endpoint: `/actuator/health`
- Expected: HTTP 200 with `{"status":"UP"}`
- Retries: 5 attempts, 10s interval

**Frontend Health Check**:
- Endpoint: `/` (root)
- Expected: HTTP 200
- Retries: 3 attempts, 5s interval

## Troubleshooting

### Common Issues

#### 1. Test Failures

**Symptom**: Tests fail in pipeline but pass locally

**Possible Causes**:
- Environment differences
- Missing dependencies
- Cache issues

**Solutions**:
- Clear pipeline cache
- Check environment variables
- Verify dependency versions

#### 2. Build Failures

**Symptom**: Docker build fails

**Possible Causes**:
- Dockerfile syntax errors
- Missing build context files
- ACR authentication issues

**Solutions**:
- Verify Dockerfile syntax
- Check build context includes all required files
- Verify ACR service connection

#### 3. Deployment Failures

**Symptom**: Deployment fails after successful build

**Possible Causes**:
- Resource group not found
- Container App not found
- Image pull failures
- Health check failures

**Solutions**:
- Verify resource group exists
- Check Container App names
- Verify ACR image tags
- Check Container App logs

#### 4. Test Coverage Below Target

**Symptom**: Coverage below 80% threshold

**Solutions**:
- Add missing test cases
- Review uncovered code paths
- Update coverage thresholds if justified

## Best Practices

### Pipeline Optimization

1. **Parallel Execution**
   - Backend and frontend builds run in parallel
   - Multiple test jobs run in parallel

2. **Caching**
   - Gradle dependencies cached
   - npm dependencies cached
   - Docker layer caching

3. **Conditional Execution**
   - E2E tests only on `main` branch
   - Coverage reports only on non-PR builds

### Security Best Practices

1. **Secrets Management**
   - All secrets stored in Azure Key Vault
   - No secrets in pipeline YAML files
   - Secrets masked in logs

2. **Image Security**
   - Security scanning on all images
   - Vulnerability reports published
   - Base image updates automated

3. **Access Control**
   - Production deployments require approval
   - Service connections use least privilege
   - Audit logs enabled

## Maintenance

### Regular Tasks

1. **Weekly**
   - Review pipeline execution logs
   - Check test coverage trends
   - Review security scan results

2. **Monthly**
   - Update dependency versions
   - Review and optimize pipeline performance
   - Update documentation

3. **Quarterly**
   - Review and update pipeline architecture
   - Evaluate new Azure DevOps features
   - Optimize costs

### Pipeline Updates

When updating pipelines:

1. Test changes in a feature branch first
2. Update documentation
3. Notify team of breaking changes
4. Monitor first few executions after update

## Related Documentation

- [Test Cases Index](./TEST_CASES_INDEX.md)
- [Backend Testing Patterns](../../backend/docs/PATTERNS/Testing-Patterns.md)
- [Azure Deployment Guide](../../docs/Deployment/Azure-Deployment-Guide.md)
- [Pipeline README](../../.azure/pipelines/README.md)

## Document Maintenance

**Last Updated**: 2025-11-19  
**Next Review**: 2025-12-19  
**Maintained By**: DevOps Team  
**Status**: Active

---

**Note**: This document should be updated whenever pipeline configuration changes are made.

