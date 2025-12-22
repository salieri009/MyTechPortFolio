# Azure Kubernetes Service (AKS) Deployment Guide

> **Document Version:** 1.0  
> **Last Updated:** 2025-12-19  
> **Author:** DevOps Team

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Quick Start](#quick-start)
5. [Detailed Setup](#detailed-setup)
   - [Azure Resources](#azure-resources)
   - [GitHub Secrets](#github-secrets)
   - [Local Development](#local-development)
6. [Deployment](#deployment)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Rollback](#rollback)

---

## Overview

This guide explains how to deploy the **MyTechPortFolio** application to Azure Kubernetes Service (AKS). The deployment includes:

| Component | Description | Replicas |
|-----------|-------------|----------|
| **Backend** | Spring Boot API (Java 21) | 2 |
| **Frontend** | React SPA (Nginx) | 2 |
| **Ingress** | NGINX Ingress Controller | - |

### Key Features
- ✅ Rolling Updates (zero-downtime deployment)
- ✅ Health Checks (Liveness & Readiness Probes)
- ✅ Resource Limits & Requests
- ✅ Path-based Routing (CORS solution)
- ✅ Automatic Rollback on Failure
- ✅ TLS/SSL Support

---

## Prerequisites

### Required Tools

| Tool | Version | Installation |
|------|---------|--------------|
| Azure CLI | 2.50+ | [Install Guide](https://docs.microsoft.com/cli/azure/install-azure-cli) |
| kubectl | 1.28+ | `az aks install-cli` |
| Docker | 24+ | [Install Guide](https://docs.docker.com/get-docker/) |
| Helm | 3.12+ | [Install Guide](https://helm.sh/docs/intro/install/) |

### Azure Subscription

You need an active Azure subscription with permissions to create:
- Resource Group
- AKS Cluster
- Container Registry (ACR)
- Key Vault (optional)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    AKS Cluster                             │  │
│  │                                                            │  │
│  │  ┌──────────────────┐     ┌──────────────────┐            │  │
│  │  │  NGINX Ingress   │     │  NGINX Ingress   │            │  │
│  │  │  Controller      │     │  Controller      │            │  │
│  │  └────────┬─────────┘     └────────┬─────────┘            │  │
│  │           │                        │                       │  │
│  │  ┌────────┴────────────────────────┴─────────┐            │  │
│  │  │              portfolio-ingress             │            │  │
│  │  └────────┬─────────────────────────┬────────┘            │  │
│  │           │                         │                      │  │
│  │   ┌───────▼───────┐       ┌─────────▼────────┐            │  │
│  │   │  /api → :8080 │       │   / → :80        │            │  │
│  │   └───────┬───────┘       └─────────┬────────┘            │  │
│  │           │                         │                      │  │
│  │  ┌────────▼─────────┐    ┌──────────▼───────┐             │  │
│  │  │ backend-service  │    │ frontend-service │             │  │
│  │  │   ClusterIP      │    │   ClusterIP      │             │  │
│  │  └────────┬─────────┘    └──────────┬───────┘             │  │
│  │           │                         │                      │  │
│  │  ┌────────▼─────────┐    ┌──────────▼───────┐             │  │
│  │  │   Backend Pod    │    │  Frontend Pod    │             │  │
│  │  │   (replica: 2)   │    │  (replica: 2)    │             │  │
│  │  └──────────────────┘    └──────────────────┘             │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ Azure Container │    │ MongoDB Atlas   │                     │
│  │ Registry (ACR)  │    │ (External)      │                     │
│  └─────────────────┘    └─────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Create Azure Resources (5 minutes)

```bash
# Set variables
RESOURCE_GROUP="rg-portfolio"
LOCATION="koreacentral"
AKS_NAME="aks-portfolio"
ACR_NAME="acrportfolio$(openssl rand -hex 4)"

# Create Resource Group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create ACR
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

# Create AKS with ACR integration
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_NAME \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --attach-acr $ACR_NAME \
  --enable-managed-identity \
  --generate-ssh-keys

# Get AKS credentials
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME
```

### 2. Install NGINX Ingress Controller

```bash
# Add ingress-nginx repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --create-namespace \
  --namespace ingress-nginx \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz
```

### 3. Deploy Application

```bash
# Create namespace
kubectl create namespace portfolio

# Create secrets
kubectl create secret generic portfolio-secrets \
  --namespace=portfolio \
  --from-literal=MONGODB_URI='YOUR_MONGODB_URI' \
  --from-literal=GOOGLE_CLIENT_ID='YOUR_GOOGLE_CLIENT_ID' \
  --from-literal=GOOGLE_CLIENT_SECRET='YOUR_GOOGLE_CLIENT_SECRET' \
  --from-literal=JWT_SECRET='YOUR_JWT_SECRET'

# Update ACR name in manifests
sed -i "s|\${ACR_NAME}|$ACR_NAME.azurecr.io|g" k8s/all-in-one.yaml

# Deploy
kubectl apply -f k8s/all-in-one.yaml

# Check status
kubectl get pods -n portfolio
```

---

## Detailed Setup

### Azure Resources

#### Resource Group
```bash
az group create --name rg-portfolio --location koreacentral
```

#### Azure Container Registry (ACR)
```bash
# Create ACR
az acr create \
  --resource-group rg-portfolio \
  --name acrportfolio \
  --sku Basic

# Get ACR credentials
az acr credential show --name acrportfolio
```

#### AKS Cluster
```bash
# Create AKS cluster
az aks create \
  --resource-group rg-portfolio \
  --name aks-portfolio \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --attach-acr acrportfolio \
  --network-plugin azure \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group rg-portfolio --name aks-portfolio
```

### GitHub Secrets

Add these secrets to your GitHub repository:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AZURE_CREDENTIALS` | Azure Service Principal JSON | See below |
| `AZURE_CONTAINER_REGISTRY` | ACR login server | `acrportfolio.azurecr.io` |
| `AZURE_ACR_USERNAME` | ACR username | From `az acr credential show` |
| `AZURE_ACR_PASSWORD` | ACR password | From `az acr credential show` |
| `AZURE_RESOURCE_GROUP` | Resource group name | `rg-portfolio` |
| `AKS_CLUSTER_NAME` | AKS cluster name | `aks-portfolio` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | From Google Cloud Console |
| `JWT_SECRET` | JWT signing secret | Random 256-bit string |

#### Create Azure Service Principal

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "github-actions-portfolio" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-portfolio \
  --sdk-auth

# Output → Copy to AZURE_CREDENTIALS secret
```

---

## Deployment

### Automatic Deployment (Recommended)

Push to `master` branch triggers automatic deployment:

```bash
git add .
git commit -m "feat: deploy to AKS"
git push origin master
```

The workflow will:
1. ✅ Run backend tests (Gradle)
2. ✅ Run frontend tests (Vitest)
3. ✅ Build Docker images
4. ✅ Push to ACR
5. ✅ Deploy to AKS
6. ✅ Run smoke tests

### Manual Deployment

```bash
# Build images locally
docker build -t acrportfolio.azurecr.io/portfolio-backend:latest ./backend
docker build -t acrportfolio.azurecr.io/portfolio-frontend:latest ./frontend

# Login to ACR
az acr login --name acrportfolio

# Push images
docker push acrportfolio.azurecr.io/portfolio-backend:latest
docker push acrportfolio.azurecr.io/portfolio-frontend:latest

# Deploy to AKS
kubectl apply -f k8s/all-in-one.yaml
```

---

## Verification

### Check Pod Status

```bash
# All pods should be Running
kubectl get pods -n portfolio

# Expected output:
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-xxx-yyy             1/1     Running   0          2m
# backend-xxx-zzz             1/1     Running   0          2m
# frontend-xxx-yyy            1/1     Running   0          2m
# frontend-xxx-zzz            1/1     Running   0          2m
```

### Check Services

```bash
kubectl get services -n portfolio

# Expected:
# NAME               TYPE        CLUSTER-IP      PORT(S)
# backend-service    ClusterIP   10.0.xxx.xxx    8080/TCP
# frontend-service   ClusterIP   10.0.xxx.xxx    80/TCP
```

### Check Ingress

```bash
kubectl get ingress -n portfolio

# Get External IP
INGRESS_IP=$(kubectl get ingress portfolio-ingress -n portfolio -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Access your app at: http://$INGRESS_IP"
```

### Health Check

```bash
# Backend health
curl http://$INGRESS_IP/actuator/health

# Frontend
curl http://$INGRESS_IP/
```

---

## Troubleshooting

### Pod Not Starting

```bash
# Check pod logs
kubectl logs -f deployment/backend -n portfolio

# Describe pod for events
kubectl describe pod <pod-name> -n portfolio
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `ImagePullBackOff` | Cannot pull image from ACR | Check ACR credentials |
| `CrashLoopBackOff` | App crashes on startup | Check logs, verify env vars |
| `Pending` | No available nodes | Check node resources |
| `0/0 Ready` | Readiness probe failing | Check health endpoint |

### View Real-time Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n portfolio --all-containers

# Frontend logs  
kubectl logs -f deployment/frontend -n portfolio
```

---

## Rollback

### Automatic Rollback

The GitHub Actions workflow automatically rolls back if deployment fails.

### Manual Rollback

```bash
# View rollout history
kubectl rollout history deployment/backend -n portfolio

# Rollback to previous version
kubectl rollout undo deployment/backend -n portfolio
kubectl rollout undo deployment/frontend -n portfolio

# Rollback to specific revision
kubectl rollout undo deployment/backend -n portfolio --to-revision=2
```

---

## Appendix

### Environment Variables Reference

#### Backend (Spring Boot)

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `prod` |
| `MONGODB_URI` | MongoDB connection string | - |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | - |
| `JWT_SECRET` | JWT signing secret | - |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `*` |

#### Frontend (React/Nginx)

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API URL | `/api` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | - |

### Resource Recommendations

| Environment | Backend CPU | Backend Memory | Frontend CPU | Frontend Memory |
|-------------|-------------|----------------|--------------|-----------------|
| Development | 250m | 512Mi | 50m | 64Mi |
| Production | 500m-1000m | 1Gi-2Gi | 100m-200m | 128Mi-256Mi |

---

## Support

For issues, please check:
1. [GitHub Issues](https://github.com/salieri009/MyTechPortFolio/issues)
2. [Azure AKS Documentation](https://docs.microsoft.com/azure/aks/)
3. [Kubernetes Documentation](https://kubernetes.io/docs/)
