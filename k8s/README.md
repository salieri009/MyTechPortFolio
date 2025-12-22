# Kubernetes Manifests

> **Directory**: `k8s/`  
> **Target Platform**: Azure Kubernetes Service (AKS)

## 📁 Structure

```
k8s/
├── README.md           # This file
├── all-in-one.yaml     # Combined manifest (quick deploy)
└── base/               # Kustomize-ready base (planned)
    ├── namespace.yaml
    ├── configmap.yaml
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

## 🚀 Quick Deploy

### Prerequisites
- Azure CLI authenticated (`az login`)
- kubectl configured for AKS cluster
- ACR credentials set

### Deploy All-in-One
```bash
# Set your ACR name
export ACR_NAME=your-acr-name

# Replace placeholder and apply
sed "s|\${ACR_NAME}|$ACR_NAME|g" k8s/all-in-one.yaml | kubectl apply -f -
```

## 📋 Manifest Contents

| Resource | Name | Purpose |
|----------|------|---------|
| Namespace | `portfolio` | Isolate application resources |
| ConfigMap | `portfolio-config` | Non-sensitive configuration |
| Secret | `portfolio-secrets` | MongoDB URI, OAuth credentials |
| Deployment | `backend` | Spring Boot API (2 replicas) |
| Deployment | `frontend` | React App (2 replicas) |
| Service | `backend-service` | ClusterIP for backend |
| Service | `frontend-service` | ClusterIP for frontend |
| Ingress | `portfolio-ingress` | NGINX path-based routing |

## 🔧 Configuration

### Environment Variables (ConfigMap)
- `SPRING_PROFILES_ACTIVE`: `prod`
- `API_VERSION`: `v1`
- `CORS_ALLOWED_ORIGINS`: Production domain
- `TZ`: `Asia/Seoul`

### Secrets (Required)
```bash
kubectl create secret generic portfolio-secrets \
  --namespace=portfolio \
  --from-literal=MONGODB_URI='mongodb://...' \
  --from-literal=GOOGLE_CLIENT_ID='...' \
  --from-literal=GOOGLE_CLIENT_SECRET='...' \
  --from-literal=JWT_SECRET='...'
```

## 🔒 Security Features

- ✅ Non-root container (`runAsUser: 1001`)
- ✅ Read-only root filesystem (frontend)
- ✅ Resource limits defined
- ✅ Liveness/Readiness probes
- ✅ TLS via cert-manager

## 📊 Resource Allocation

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| Backend | 250m | 500m | 512Mi | 1Gi |
| Frontend | 50m | 100m | 64Mi | 128Mi |

## 🔗 Related

- [Deploy to AKS Workflow](../.github/workflows/deploy-aks.yml)
- [Azure Pipelines](../azure-pipelines.yml)
- [Lessons Learned](../docs/LESSONS-LEARNED.md)
