# Azure DevOps (Azure Boards) Deployment Guide

> **Document Version**: 1.0.0  
> **Last Updated**: 2025-11-19  
> **Author**: 20-Year Senior Technical Writer  
> **Target Audience**: DevOps Engineers, Platform Engineers, Technical Leads  
> **Estimated Setup Time**: 2-3 hours  
> **Maintenance Level**: Enterprise-Grade

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Initial Setup](#initial-setup)
5. [Pipeline Configuration](#pipeline-configuration)
6. [Environment Configuration](#environment-configuration)
7. [Deployment Workflow](#deployment-workflow)
8. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
9. [Best Practices](#best-practices)
10. [Advanced Configuration](#advanced-configuration)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Appendix](#appendix)

---

## Overview

This guide provides comprehensive instructions for deploying the MyTechPortfolio application to Azure using Azure DevOps Pipelines and Azure Boards. The deployment leverages Azure Container Apps, Azure Container Registry (ACR), and Azure Key Vault for a fully automated, secure CI/CD pipeline.

### Key Features

- **Multi-stage Pipeline**: Build, Test, and Deploy stages with parallel execution
- **Environment Promotion**: Dev → Staging → Production workflow
- **Secret Management**: Azure Key Vault integration for secure credential storage
- **Automated Testing**: Unit, integration, and E2E tests integrated into pipeline
- **Rollback Capability**: Automatic rollback on deployment failure
- **Health Checks**: Automated health validation post-deployment
- **Cost Optimization**: Resource scaling and cost monitoring

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Azure DevOps Repos                        │
│              (Source Code Repository)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Azure Pipelines (CI/CD)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Build      │→ │    Test      │→ │   Deploy     │      │
│  │   Stage      │  │   Stage      │  │   Stage      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            Azure Container Registry (ACR)                   │
│         (Docker Image Storage)                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          Azure Container Apps Environment                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dev Env    │  │ Staging Env   │  │  Prod Env    │      │
│  │  (Backend)   │  │  (Backend)    │  │  (Backend)   │      │
│  │  (Frontend)  │  │  (Frontend)   │  │  (Frontend)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Azure Key Vault                                 │
│         (Secrets Management)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Accounts and Subscriptions

1. **Azure Account**
   - Active Azure subscription with Contributor or Owner role
   - Subscription ID (found in Azure Portal → Subscriptions)

2. **Azure DevOps Organization**
   - Active Azure DevOps organization
   - Project with appropriate permissions
   - Agent pools configured (Microsoft-hosted or self-hosted)

3. **Required Azure Services**
   - Azure Container Registry (ACR)
   - Azure Container Apps
   - Azure Key Vault
   - Azure Resource Group
   - Application Insights (optional, for monitoring)

### Required Tools

1. **Azure CLI** (v2.50.0 or later)
   ```bash
   # Windows (via winget)
   winget install Microsoft.AzureCLI
   
   # macOS
   brew install azure-cli
   
   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # Verify installation
   az --version
   ```

2. **Docker Desktop** (v4.20.0 or later)
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

3. **Git** (v2.40.0 or later)
   ```bash
   # Verify installation
   git --version
   ```

4. **Azure DevOps CLI Extension** (optional)
   ```bash
   az extension add --name azure-devops
   ```

### Required Knowledge

- Basic understanding of YAML syntax
- Familiarity with Docker and containerization
- Understanding of CI/CD concepts
- Knowledge of Azure services (Container Apps, ACR, Key Vault)

---

## Architecture Overview

### Pipeline Stages

The deployment pipeline consists of four main stages:

1. **Stage 0: Retrieve Secrets**
   - Retrieves secrets from Azure Key Vault
   - Validates secret availability
   - Prepares environment variables

2. **Stage 1: Build**
   - Parallel builds for backend and frontend
   - Docker image creation
   - Image tagging and versioning
   - Push to Azure Container Registry

3. **Stage 2: Test**
   - Backend unit tests (Gradle + JUnit 5)
   - Backend integration tests (Spring Boot Test)
   - Frontend unit tests (Vitest + React Testing Library)
   - Security scanning (OWASP Dependency Check)
   - E2E tests (Playwright) - Production only

4. **Stage 3: Deploy**
   - Environment-specific deployment
   - Health check validation
   - Smoke tests
   - Rollback on failure

### Resource Naming Convention

```
Resource Type          | Naming Pattern                    | Example
----------------------|-----------------------------------|--------------------------
Resource Group        | {project}-rg                      | portfolio-rg
Container Registry    | {project}acr                     | portfolioacr
Key Vault             | {project}-kv                      | portfolio-kv
Container App Env     | {project}-env                     | portfolio-env
Backend Container App | {project}-backend-{env}            | portfolio-backend-prod
Frontend Container App| {project}-frontend-{env}          | portfolio-frontend-prod
Variable Group        | {project}-Pipeline-Variables      | Portfolio-Pipeline-Variables
```

---

## Initial Setup

### Step 1: Azure Resource Preparation

#### 1.1 Create Resource Group

```bash
# Login to Azure
az login

# Set subscription (if multiple subscriptions)
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create resource group
az group create \
  --name portfolio-rg \
  --location koreacentral \
  --tags Environment=Production Project=Portfolio
```

#### 1.2 Create Azure Container Registry

```bash
# Create ACR with Basic SKU (cost-effective for small projects)
az acr create \
  --resource-group portfolio-rg \
  --name portfolioacr \
  --sku Basic \
  --admin-enabled true

# Get ACR credentials
az acr credential show --name portfolioacr --resource-group portfolio-rg
```

**Note**: Save the username and password for later use in Azure DevOps.

#### 1.3 Create Azure Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name portfolio-kv \
  --resource-group portfolio-rg \
  --location koreacentral \
  --sku standard

# Add secrets to Key Vault
az keyvault secret set \
  --vault-name portfolio-kv \
  --name GOOGLE-CLIENT-ID \
  --value "your-google-client-id"

az keyvault secret set \
  --vault-name portfolio-kv \
  --name GOOGLE-CLIENT-SECRET \
  --value "your-google-client-secret"

az keyvault secret set \
  --vault-name portfolio-kv \
  --name JWT-SECRET \
  --value "your-very-long-jwt-secret-minimum-64-characters"

az keyvault secret set \
  --vault-name portfolio-kv \
  --name MONGO-ROOT-PASSWORD \
  --value "your-secure-mongodb-password"

az keyvault secret set \
  --vault-name portfolio-kv \
  --name MONGODB-URI-PROD \
  --value "mongodb://admin:password@mongodb-host:27017/portfolio?authSource=admin"
```

#### 1.4 Create Container Apps Environment

```bash
# Create Container Apps environment
az containerapp env create \
  --name portfolio-env \
  --resource-group portfolio-rg \
  --location koreacentral
```

### Step 2: Azure DevOps Project Setup

#### 2.1 Create Service Connections

1. **Navigate to Project Settings**
   - Go to Azure DevOps project
   - Click **Project Settings** → **Service connections**

2. **Create Azure Resource Manager Connection**
   - Click **New service connection**
   - Select **Azure Resource Manager**
   - Choose **Workload Identity federation (automatic)**
   - Select subscription and resource group
   - Name: `Azure_Subscription_Connection`
   - Click **Save**

3. **Create Azure Container Registry Connection**
   - Click **New service connection**
   - Select **Docker Registry**
   - Registry type: **Azure Container Registry**
   - Select subscription and registry
   - Name: `ACR_Connection`
   - Click **Save**

#### 2.2 Create Variable Groups

1. **Navigate to Pipelines → Library**
   - Click **+ Variable group**
   - Name: `Portfolio-Pipeline-Variables`

2. **Add Variables**

   | Variable Name | Value | Secret | Description |
   |--------------|-------|--------|-------------|
   | `ACR_NAME` | `portfolioacr` | No | Azure Container Registry name |
   | `RESOURCE_GROUP` | `portfolio-rg` | No | Resource group name |
   | `CONTAINER_APP_ENV` | `portfolio-env` | No | Container Apps environment name |
   | `KEY_VAULT_NAME` | `portfolio-kv` | No | Key Vault name |
   | `BACKEND_APP_NAME_DEV` | `portfolio-backend-dev` | No | Dev backend app name |
   | `FRONTEND_APP_NAME_DEV` | `portfolio-frontend-dev` | No | Dev frontend app name |
   | `BACKEND_APP_NAME_STAGING` | `portfolio-backend-staging` | No | Staging backend app name |
   | `FRONTEND_APP_NAME_STAGING` | `portfolio-frontend-staging` | No | Staging frontend app name |
   | `BACKEND_APP_NAME_PROD` | `portfolio-backend-prod` | No | Production backend app name |
   | `FRONTEND_APP_NAME_PROD` | `portfolio-frontend-prod` | No | Production frontend app name |
   | `VITE_API_BASE_URL` | `https://portfolio-backend-prod.azurecontainerapps.io/api` | No | Frontend API base URL |
   | `VITE_GOOGLE_CLIENT_ID` | `your-google-client-id` | Yes | Google OAuth client ID |
   | `VITE_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | No | Google Analytics ID |

3. **Link Key Vault**
   - Click **Link secrets from an Azure key vault as variables**
   - Select Azure subscription and Key Vault
   - Authorize access
   - Select secrets to link:
     - `GOOGLE-CLIENT-ID` → `GOOGLE_CLIENT_ID`
     - `GOOGLE-CLIENT-SECRET` → `GOOGLE_CLIENT_SECRET`
     - `JWT-SECRET` → `JWT_SECRET`
     - `MONGO-ROOT-PASSWORD` → `MONGO_ROOT_PASSWORD`
     - `MONGODB-URI-PROD` → `MONGODB_URI_PROD`

4. **Save Variable Group**

#### 2.3 Configure Pipeline Permissions

1. **Navigate to Pipelines → Pipelines**
   - Select your pipeline
   - Click **...** → **Security**
   - Ensure **Build service** has **Queue builds** permission

2. **Grant Key Vault Access**
   - Go to Azure Portal → Key Vault → Access policies
   - Add access policy for Azure DevOps service principal
   - Permissions: Get, List (for secrets)

### Step 3: Create Container Apps

#### 3.1 Create Backend Container App (Production)

```bash
# Create backend container app
az containerapp create \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --environment portfolio-env \
  --image portfolioacr.azurecr.io/portfolio-backend:latest \
  --registry-server portfolioacr.azurecr.io \
  --target-port 8080 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 1.0 \
  --memory 2.0Gi \
  --env-vars \
    SPRING_PROFILES_ACTIVE=production \
    MONGODB_URI="$(az keyvault secret show --vault-name portfolio-kv --name MONGODB-URI-PROD --query value -o tsv)" \
    JWT_SECRET="$(az keyvault secret show --vault-name portfolio-kv --name JWT-SECRET --query value -o tsv)" \
    GOOGLE_CLIENT_ID="$(az keyvault secret show --vault-name portfolio-kv --name GOOGLE-CLIENT-ID --query value -o tsv)" \
    GOOGLE_CLIENT_SECRET="$(az keyvault secret show --vault-name portfolio-kv --name GOOGLE-CLIENT-SECRET --query value -o tsv)"
```

#### 3.2 Create Frontend Container App (Production)

```bash
# Create frontend container app
az containerapp create \
  --name portfolio-frontend-prod \
  --resource-group portfolio-rg \
  --environment portfolio-env \
  --image portfolioacr.azurecr.io/portfolio-frontend:latest \
  --registry-server portfolioacr.azurecr.io \
  --target-port 80 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 2 \
  --cpu 0.5 \
  --memory 1.0Gi
```

**Repeat for Dev and Staging environments** with appropriate naming and resource scaling.

---

## Pipeline Configuration

### Pipeline File Structure

```
MyPortFolio/
├── azure-pipelines.yml              # Main pipeline orchestrator
├── backend/
│   └── azure-pipelines-backend.yml  # Backend-specific pipeline
├── frontend/
│   └── azure-pipelines-frontend.yml # Frontend-specific pipeline
└── .azure/
    └── pipelines/
        ├── templates/
        │   ├── build-docker-image.yml
        │   ├── deploy-container-app.yml
        │   ├── key-vault-integration.yml
        │   └── ...
        └── test-cases/
            ├── backend-unit-tests.yml
            ├── frontend-unit-tests.yml
            └── ...
```

### Main Pipeline Configuration

The main pipeline (`azure-pipelines.yml`) is already configured in the repository. Key configuration points:

1. **Triggers**
   - Branches: `main`, `develop`
   - Path filters: `backend/**`, `frontend/**`, `.azure/pipelines/**`

2. **Variables**
   - Variable group: `Portfolio-Pipeline-Variables`
   - Build configuration: `Release`
   - VM image: `ubuntu-latest`

3. **Stages**
   - Stage 0: Retrieve Secrets
   - Stage 1: Build (parallel)
   - Stage 2: Test (parallel)
   - Stage 3: Deploy (environment-specific)

### Creating the Pipeline in Azure DevOps

1. **Navigate to Pipelines**
   - Go to Azure DevOps project
   - Click **Pipelines** → **New pipeline**

2. **Select Repository**
   - Choose **Azure Repos Git** (or GitHub if using GitHub)
   - Select repository and branch

3. **Configure Pipeline**
   - Select **Existing Azure Pipelines YAML file**
   - Branch: `main`
   - Path: `/azure-pipelines.yml`

4. **Review and Run**
   - Review pipeline YAML
   - Click **Save** and **Run**

### Pipeline Permissions

Ensure the following permissions are configured:

- **Service connections**: Pipeline can use Azure and ACR connections
- **Variable groups**: Pipeline can access variable groups
- **Key Vault**: Service principal has Get/List permissions

---

## Environment Configuration

### Development Environment

**Purpose**: Rapid iteration and testing

**Configuration**:
- Min replicas: 0 (scale to zero when not in use)
- Max replicas: 1
- CPU: 0.5 cores
- Memory: 1.0 Gi
- Auto-scaling: Disabled

**Deployment Trigger**: `develop` branch

### Staging Environment

**Purpose**: Pre-production testing and validation

**Configuration**:
- Min replicas: 1
- Max replicas: 2
- CPU: 1.0 cores
- Memory: 2.0 Gi
- Auto-scaling: Enabled (CPU > 70%)

**Deployment Trigger**: `develop` branch (after Dev deployment)

### Production Environment

**Purpose**: Live production environment

**Configuration**:
- Min replicas: 2 (high availability)
- Max replicas: 5
- CPU: 1.0 cores (backend), 0.5 cores (frontend)
- Memory: 2.0 Gi (backend), 1.0 Gi (frontend)
- Auto-scaling: Enabled (CPU > 60%, Memory > 80%)

**Deployment Trigger**: `main` branch (manual approval required)

### Environment-Specific Variables

Create separate variable groups for each environment:

- `Portfolio-Pipeline-Variables-Dev`
- `Portfolio-Pipeline-Variables-Staging`
- `Portfolio-Pipeline-Variables-Prod`

---

## Deployment Workflow

### Automated Deployment Flow

```
┌─────────────────┐
│  Code Commit    │
│  (Git Push)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pipeline Trigger│
│ (Branch: main)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│ Retrieve Secrets│ ───→ │  Build Stage    │
│  (Key Vault)    │      │  (Parallel)     │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Test Stage    │
                         │  (Parallel)     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Deploy Stage   │
                         │ (Environment)   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Health Checks   │
                         │ Smoke Tests     │
                         └─────────────────┘
```

### Manual Deployment Steps

1. **Trigger Pipeline**
   ```bash
   # Via Azure DevOps UI
   # Pipelines → Select pipeline → Run pipeline
   
   # Via Azure CLI
   az pipelines run \
     --name "MyPortFolio-CI-CD" \
     --branch main \
     --organization https://dev.azure.com/YOUR_ORG \
     --project YOUR_PROJECT
   ```

2. **Monitor Pipeline Execution**
   - Navigate to **Pipelines** → **Runs**
   - Select running pipeline
   - Monitor each stage execution
   - Review logs for any errors

3. **Verify Deployment**
   ```bash
   # Check backend health
   curl https://portfolio-backend-prod.azurecontainerapps.io/api/actuator/health
   
   # Check frontend
   curl https://portfolio-frontend-prod.azurecontainerapps.io
   ```

### Deployment Approval (Production)

For production deployments, configure manual approval:

1. **Navigate to Environments**
   - Go to **Pipelines** → **Environments**
   - Create or edit **Production** environment

2. **Add Approval**
   - Click **...** → **Approvals and checks**
   - Add **Approvals**
   - Select approvers
   - Set timeout (e.g., 30 minutes)

3. **Configure Checks**
   - Add **Required template** (if using deployment templates)
   - Add **Invoke Azure Function** (for custom validation)

---

## Monitoring and Troubleshooting

### Application Insights Integration

1. **Create Application Insights**
   ```bash
   az monitor app-insights component create \
     --app portfolio-insights \
     --location koreacentral \
     --resource-group portfolio-rg \
     --application-type web
   ```

2. **Get Connection String**
   ```bash
   az monitor app-insights component show \
     --app portfolio-insights \
     --resource-group portfolio-rg \
     --query connectionString \
     --output tsv
   ```

3. **Add to Container App**
   ```bash
   az containerapp update \
     --name portfolio-backend-prod \
     --resource-group portfolio-rg \
     --set-env-vars APPLICATIONINSIGHTS_CONNECTION_STRING="your-connection-string"
   ```

### Logging and Monitoring

#### View Container App Logs

```bash
# Real-time logs
az containerapp logs show \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --follow

# Logs with filter
az containerapp logs show \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --tail 100 \
  --type console
```

#### Azure Portal Monitoring

1. Navigate to **Container App** → **Monitoring**
2. View metrics:
   - Request count
   - Response time
   - CPU/Memory usage
   - Replica count
   - HTTP status codes

### Health Check Endpoints

- **Backend Health**: `https://portfolio-backend-prod.azurecontainerapps.io/api/actuator/health`
- **Backend Info**: `https://portfolio-backend-prod.azurecontainerapps.io/api/actuator/info`
- **Backend Metrics**: `https://portfolio-backend-prod.azurecontainerapps.io/api/actuator/metrics`

---

## Best Practices

### Security Best Practices

1. **Never commit secrets to repository**
   - Use Azure Key Vault for all secrets
   - Use variable groups for non-sensitive configuration

2. **Principle of Least Privilege**
   - Grant minimum required permissions
   - Use managed identities where possible

3. **Regular Secret Rotation**
   - Rotate JWT secrets quarterly
   - Rotate database passwords monthly
   - Use Azure Key Vault auto-rotation (preview)

4. **Network Security**
   - Use VNet integration for Container Apps
   - Configure private endpoints for ACR
   - Enable firewall rules for Key Vault

### Performance Best Practices

1. **Image Optimization**
   - Use multi-stage Docker builds
   - Minimize image layers
   - Use .dockerignore to exclude unnecessary files

2. **Resource Sizing**
   - Start with minimum resources
   - Monitor and scale based on metrics
   - Use auto-scaling for variable workloads

3. **Caching Strategy**
   - Enable Docker layer caching in pipeline
   - Use ACR cache for faster builds
   - Implement application-level caching

### Cost Optimization

1. **Resource Scaling**
   - Use scale-to-zero for dev environments
   - Set appropriate min/max replicas
   - Monitor and adjust based on usage

2. **ACR Tier Selection**
   - Basic tier for small projects (< 10GB)
   - Standard tier for larger projects
   - Premium tier for geo-replication

3. **Container App Pricing**
   - Optimize CPU and memory allocation
   - Use consumption plan for variable workloads
   - Monitor and optimize resource usage

---

## Advanced Configuration

### Blue-Green Deployment

Implement blue-green deployment for zero-downtime updates:

```yaml
# Add to deploy-container-app.yml template
- task: AzureCLI@2
  displayName: 'Blue-Green Deployment'
  inputs:
    azureSubscription: 'Azure_Subscription_Connection'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      # Deploy to green slot
      az containerapp update \
        --name ${{ parameters.backendAppName }}-green \
        --resource-group ${{ parameters.resourceGroup }} \
        --image ${{ parameters.backendImage }}
      
      # Health check green slot
      # ... health check logic ...
      
      # Switch traffic to green
      # ... traffic switching logic ...
```

### Canary Deployment

Implement canary deployment for gradual rollout:

```yaml
# Configure traffic splitting
az containerapp ingress traffic set \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --revision-weight portfolio-backend-prod--revision-1=90 \
  --revision-weight portfolio-backend-prod--revision-2=10
```

### Custom Domain Configuration

1. **Add Custom Domain**
   ```bash
   az containerapp hostname add \
     --name portfolio-frontend-prod \
     --resource-group portfolio-rg \
     --hostname yourdomain.com
   ```

2. **Configure DNS**
   - Add CNAME record pointing to Container App FQDN
   - Wait for DNS propagation (up to 48 hours)

3. **SSL Certificate**
   - Azure automatically provisions SSL certificate
   - Certificate renewal is automatic

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Pipeline Fails at Build Stage

**Symptoms**: Docker build fails or image push fails

**Solutions**:
```bash
# Check Dockerfile syntax
docker build -t test-image ./backend

# Verify ACR credentials
az acr login --name portfolioacr

# Test image push manually
docker tag test-image portfolioacr.azurecr.io/portfolio-backend:test
docker push portfolioacr.azurecr.io/portfolio-backend:test
```

#### Issue 2: Container App Fails to Start

**Symptoms**: Container App shows "Unhealthy" status

**Solutions**:
```bash
# Check container logs
az containerapp logs show \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --tail 100

# Verify environment variables
az containerapp show \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --query "properties.template.containers[0].env"

# Check health endpoint
curl https://portfolio-backend-prod.azurecontainerapps.io/api/actuator/health
```

#### Issue 3: Key Vault Access Denied

**Symptoms**: Pipeline fails at "Retrieve Secrets" stage

**Solutions**:
```bash
# Verify service principal permissions
az keyvault show \
  --name portfolio-kv \
  --resource-group portfolio-rg \
  --query properties.accessPolicies

# Grant access
az keyvault set-policy \
  --name portfolio-kv \
  --spn <service-principal-id> \
  --secret-permissions get list
```

#### Issue 4: Deployment Timeout

**Symptoms**: Deployment stage times out

**Solutions**:
- Increase timeout in pipeline YAML
- Check Container App resource limits
- Verify network connectivity
- Review Container App logs for startup issues

### Debugging Commands

```bash
# List all Container Apps
az containerapp list --resource-group portfolio-rg --output table

# Get Container App details
az containerapp show \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg

# Check revision history
az containerapp revision list \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --output table

# Rollback to previous revision
az containerapp revision copy \
  --name portfolio-backend-prod \
  --resource-group portfolio-rg \
  --source-revision <previous-revision-name>
```

---

## Appendix

### A. Pipeline YAML Reference

See main pipeline file: `azure-pipelines.yml`

### B. Template Reference

- Build template: `.azure/pipelines/templates/build-docker-image.yml`
- Deploy template: `.azure/pipelines/templates/deploy-container-app.yml`
- Key Vault template: `.azure/pipelines/templates/key-vault-integration.yml`

### C. Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | Yes | `production` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Yes | - |
| `CORS_ALLOWED_ORIGINS` | CORS allowed origins | No | `*` |

### D. Useful Links

- [Azure Container Apps Documentation](https://docs.microsoft.com/azure/container-apps/)
- [Azure Pipelines Documentation](https://docs.microsoft.com/azure/devops/pipelines/)
- [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
- [Azure Container Registry Documentation](https://docs.microsoft.com/azure/container-registry/)

### E. Support and Contact

- **Azure Support**: [Azure Support Portal](https://azure.microsoft.com/support/)
- **Azure DevOps Support**: [Azure DevOps Community](https://developercommunity.visualstudio.com/spaces/21/index.html)
- **Project Issues**: [GitHub Issues](https://github.com/salieri009/MyTechPortfolio/issues)

---

**Document End**

*Last Updated: 2025-11-19*  
*Next Review: 2025-12-19*

