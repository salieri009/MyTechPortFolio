# Azure Pipelines CI/CD Documentation

## Overview

This directory contains Azure Pipelines CI/CD configuration for MyPortFolio project, following 20-year DevOps and Software Engineer best practices.

## Directory Structure

```
.azure/pipelines/
├── templates/           # Reusable pipeline templates
│   ├── build-docker-image.yml
│   ├── run-tests.yml
│   ├── deploy-container-app.yml
│   ├── security-scan.yml
│   ├── notify.yml
│   ├── key-vault-integration.yml
│   └── monitoring-alerts.yml
└── test-cases/          # Test execution templates
    ├── backend-unit-tests.yml
    ├── backend-integration-tests.yml
    ├── frontend-unit-tests.yml
    ├── frontend-integration-tests.yml
    ├── api-contract-tests.yml
    ├── e2e-tests.yml
    ├── security-tests.yml
    └── performance-tests.yml
```

## Main Pipeline Files

- `azure-pipelines.yml`: Main multi-stage pipeline (root directory)
- `backend/azure-pipelines-backend.yml`: Backend-specific pipeline
- `frontend/azure-pipelines-frontend.yml`: Frontend-specific pipeline
- `infra/pipeline-variables.yml`: Environment variable documentation

## Pipeline Stages

### 1. Build Stage
- Builds Docker images for backend and frontend
- Pushes images to Azure Container Registry (ACR)
- Tags images with Build ID, branch name, and 'latest'

### 2. Test Stage
- **Backend Unit Tests**: Gradle tests with JaCoCo coverage
- **Backend Integration Tests**: Spring Boot integration tests
- **Frontend Unit Tests**: npm tests with coverage
- **Frontend Integration Tests**: Component integration tests
- **Security Scanning**: Trivy container scanning, dependency audits
- **E2E Tests**: Playwright end-to-end tests (main branch only)

### 3. Deploy Stage
- **Dev Environment**: Auto-deploy on `develop` branch
- **Staging Environment**: Auto-deploy after dev success
- **Production Environment**: Manual approval required, deploys on `main` branch

## Test Cases

All test cases are modular and reusable, located in `.azure/pipelines/test-cases/`:

### Backend Tests
- **Unit Tests**: `backend-unit-tests.yml`
  - Runs Gradle unit tests
  - Publishes JUnit results
  - Generates JaCoCo coverage reports
  
- **Integration Tests**: `backend-integration-tests.yml`
  - Runs Spring Boot integration tests
  - Uses Testcontainers for database tests
  - Validates API endpoints

### Frontend Tests
- **Unit Tests**: `frontend-unit-tests.yml`
  - Runs Vitest unit tests (28 test cases)
  - Uses React Testing Library
  - Publishes JUnit test results
  - Generates coverage reports (v8 provider)
  - Coverage target: 80%+
  
- **Integration Tests**: `frontend-integration-tests.yml`
  - Runs component integration tests
  - Uses MSW for API mocking

### Additional Tests
- **API Contract Tests**: `api-contract-tests.yml`
  - Validates API contracts
  - Tests endpoint availability
  
- **E2E Tests**: `e2e-tests.yml`
  - Playwright end-to-end tests
  - User flow validation
  
- **Security Tests**: `security-tests.yml`
  - OWASP ZAP scanning
  - Dependency vulnerability scanning
  
- **Performance Tests**: `performance-tests.yml`
  - k6 load testing
  - Response time validation

## Templates

### Build Templates
- **build-docker-image.yml**: Reusable Docker build and push template
  - Parameters: workingDirectory, dockerfilePath, imageName, containerRegistry, tags, buildArgs

### Test Templates
- **run-tests.yml**: Generic test execution template
  - Parameters: testType, workingDirectory, testCommand, testResultsPattern, coverageReportPattern

### Deployment Templates
- **deploy-container-app.yml**: Container App deployment template
  - Parameters: environment, backendAppName, frontendAppName, containerRegistry, backendImage, frontendImage, resourceGroup, containerAppEnv
  - Features: Health checks, smoke tests, automatic rollback on failure

### Security Templates
- **security-scan.yml**: Security scanning template
  - Trivy container scanning
  - Dependency vulnerability scanning
  - SARIF report generation

### Integration Templates
- **key-vault-integration.yml**: Azure Key Vault integration
  - Retrieves secrets securely
  - Makes secrets available as environment variables

- **monitoring-alerts.yml**: Monitoring and alerting
  - Logs pipeline metrics
  - Sends notifications
  - Publishes deployment status

- **notify.yml**: Notification template
  - Supports Slack, Teams, Email
  - Configurable via pipeline variables

## Configuration

### Required Azure DevOps Setup

1. **Variable Groups**
   - Create variable group: `Portfolio-Pipeline-Variables`
   - Add variables from `infra/pipeline-variables.yml`

2. **Service Connections**
   - `ACR_Connection`: Azure Container Registry connection
   - `Azure_Subscription_Connection`: Azure subscription connection
   - `Key_Vault_Connection`: Azure Key Vault connection (optional)

3. **Environments**
   - Create environments: `dev`, `staging`, `production`
   - Configure approval gates for `production` environment

4. **Key Vault** (Optional but Recommended)
   - Create Azure Key Vault
   - Store secrets: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, etc.
   - Link to pipeline via service connection

## Usage

### Running the Pipeline

1. **Automatic Triggers**
   - Push to `main` or `develop` branch
   - Changes in `backend/**` or `frontend/**` directories

2. **Manual Trigger**
   - Navigate to Azure DevOps Pipelines
   - Select pipeline and click "Run pipeline"

3. **Pull Request Validation**
   - Pipeline runs automatically on PR creation
   - Only Build and Test stages execute
   - No deployment on PR

### Environment-Specific Deployments

- **Dev**: Auto-deploys on `develop` branch after successful tests
- **Staging**: Auto-deploys after dev deployment success
- **Production**: Requires manual approval, deploys on `main` branch

## Maintenance

### Adding New Test Cases

1. Create new test case file in `.azure/pipelines/test-cases/`
2. Follow existing template structure
3. Reference in main pipeline or component-specific pipeline

### Modifying Deployment

1. Update `deploy-container-app.yml` template
2. Changes apply to all environments automatically
3. Test in dev environment first

### Updating Variables

1. Update `infra/pipeline-variables.yml` (documentation)
2. Update Azure DevOps Variable Group (actual values)
3. Restart pipeline if needed

## Best Practices

1. **Modularity**: Keep templates small and focused
2. **Reusability**: Use parameters for customization
3. **Error Handling**: Always include error handling and rollback
4. **Security**: Never commit secrets, use Key Vault
5. **Testing**: Test pipeline changes in dev environment first
6. **Documentation**: Update README when adding new templates

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Dockerfile syntax
   - Verify ACR connection
   - Check build logs

2. **Tests Fail**
   - Review test output
   - Check test configuration
   - Verify dependencies

3. **Deployment Fails**
   - Check Azure service connection
   - Verify resource group and app names
   - Review health check logs

4. **Rollback Issues**
   - Verify previous image tags are saved
   - Check ACR image availability
   - Review rollback logs

## Test Documentation

Comprehensive test case documentation is available in `docs/test-run/`:

- [Test Cases Index](../../docs/test-run/TEST_CASES_INDEX.md)
- [Azure Pipeline Management](../../docs/test-run/AZURE_PIPELINE_MANAGEMENT.md)
- [Frontend Unit Tests Documentation](../../docs/test-run/TC-FU-Frontend-Unit-Tests.md)

## Support

For issues or questions:
1. Check pipeline logs in Azure DevOps
2. Review template documentation
3. Consult `infra/pipeline-variables.yml` for configuration
4. Review [Azure Pipeline Management Guide](../../docs/test-run/AZURE_PIPELINE_MANAGEMENT.md)

