# Azure ë°°í¬ ê°€?´ë“œ

## ?? Azure Container Appsë¥??¬ìš©???¬íŠ¸?´ë¦¬??ë°°í¬

### ?¬ì „ ?”êµ¬?¬í•­

1. **Azure CLI ?¤ì¹˜**
   ```bash
   # Windows
   winget install Microsoft.AzureCLI
   
   # macOS
   brew install azure-cli
   
   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Docker ?¤ì¹˜**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) ?¤ì¹˜

3. **Azure ê³„ì • ë°?êµ¬ë…**
   - Azure ê³„ì • ?ì„±
   - êµ¬ë… ID ?•ì¸

### 1?¨ê³„: ?˜ê²½ ?¤ì •

```bash
# 1. Azure CLI ë¡œê·¸??
az login

# 2. êµ¬ë… ?•ì¸
az account show

# 3. ?˜ê²½ ë³€???Œì¼ ?ì„±
chmod +x create-env.sh
./create-env.sh

# 4. .env ?Œì¼ ?˜ì • (?„ìš”??
# Azure êµ¬ë… ID, ë¦¬ì†Œ??ê·¸ë£¹ëª??±ì„ ?¤ì œ ê°’ìœ¼ë¡?ë³€ê²?
```

### 2?¨ê³„: ë¡œì»¬ ?ŒìŠ¤??

```bash
# 1. Docker Composeë¡?ë¡œì»¬ ?ŒìŠ¤??
docker-compose up -d

# 2. ë°±ì—”???íƒœ ?•ì¸
curl http://localhost:8080/api/actuator/health

# 3. ?„ë¡ ?¸ì—”???‘ì†
# ë¸Œë¼?°ì??ì„œ http://localhost:80 ?‘ì†

# 4. ì»¨í…Œ?´ë„ˆ ì¤‘ì?
docker-compose down
```

### 3?¨ê³„: Azure ë°°í¬

```bash
# 1. ë°°í¬ ?¤í¬ë¦½íŠ¸ ?¤í–‰ ê¶Œí•œ ë¶€??
chmod +x azure-deploy.sh

# 2. Azure ë°°í¬ ?¤í–‰
./azure-deploy.sh production

# 3. ë°°í¬ ?íƒœ ?•ì¸
az containerapp list --resource-group portfolio-rg
```

### 4?¨ê³„: ë°°í¬ ???¤ì •

#### 4.1 ?„ë©”???¤ì • (? íƒ?¬í•­)
```bash
# ì»¤ìŠ¤?€ ?„ë©”??ì¶”ê?
az containerapp hostname add \
  --name portfolio-frontend \
  --resource-group portfolio-rg \
  --hostname your-domain.com
```

#### 4.2 SSL ?¸ì¦???¤ì •
```bash
# Azure?ì„œ ?ë™?¼ë¡œ SSL ?¸ì¦??ê´€ë¦?
# ë³„ë„ ?¤ì • ë¶ˆí•„??
```

#### 4.3 ëª¨ë‹ˆ?°ë§ ?¤ì •
```bash
# Application Insights ?œì„±??
az monitor app-insights component create \
  --app portfolio-insights \
  --location koreacentral \
  --resource-group portfolio-rg \
  --application-type web
```

### 5?¨ê³„: CI/CD ?Œì´?„ë¼???¤ì •

#### GitHub Actions ?Œí¬?Œë¡œ???ì„±

`.github/workflows/azure-deploy.yml` ?Œì¼ ?ì„±:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  AZURE_RESOURCE_GROUP: portfolio-rg
  AZURE_CONTAINER_REGISTRY: portfolioacr

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Azure login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Build and push images
      run: |
        az acr build --registry $AZURE_CONTAINER_REGISTRY --image portfolio-backend:latest ./backend
        az acr build --registry $AZURE_CONTAINER_REGISTRY --image portfolio-frontend:latest ./frontend
    
    - name: Deploy to Container Apps
      run: |
        az containerapp update --name portfolio-backend --resource-group $AZURE_RESOURCE_GROUP --image $AZURE_CONTAINER_REGISTRY.azurecr.io/portfolio-backend:latest
        az containerapp update --name portfolio-frontend --resource-group $AZURE_RESOURCE_GROUP --image $AZURE_CONTAINER_REGISTRY.azurecr.io/portfolio-frontend:latest
```

### 6?¨ê³„: ë¬¸ì œ ?´ê²°

#### ?¼ë°˜?ì¸ ë¬¸ì œ??

1. **CORS ?¤ë¥˜**
   ```bash
   # ë°±ì—”??CORS ?¤ì • ?•ì¸
   az containerapp show --name portfolio-backend --resource-group portfolio-rg --query properties.configuration.ingress.fqdn
   ```

2. **MongoDB ?°ê²° ?¤ë¥˜**
   ```bash
   # MongoDB ì»¨í…Œ?´ë„ˆ ?íƒœ ?•ì¸
   az container show --name portfolio-mongodb --resource-group portfolio-rg
   ```

3. **?´ë?ì§€ ë¹Œë“œ ?¤íŒ¨**
   ```bash
   # ë¡œì»¬?ì„œ ?´ë?ì§€ ë¹Œë“œ ?ŒìŠ¤??
   docker build -t portfolio-backend:test ./backend
   docker build -t portfolio-frontend:test ./frontend
   ```

#### ë¡œê·¸ ?•ì¸
```bash
# ë°±ì—”??ë¡œê·¸
az containerapp logs show --name portfolio-backend --resource-group portfolio-rg

# ?„ë¡ ?¸ì—”??ë¡œê·¸
az containerapp logs show --name portfolio-frontend --resource-group portfolio-rg
```

### 7?¨ê³„: ë¹„ìš© ìµœì ??

#### ë¹„ìš© ?ˆì•½ ??

1. **?¤ì??¼ë§ ?¤ì • ì¡°ì •**
   ```bash
   # ìµœì†Œ ë³µì œë³???ì¤„ì´ê¸?
   az containerapp update --name portfolio-backend --resource-group portfolio-rg --min-replicas 0 --max-replicas 1
   ```

2. **ë¦¬ì†Œ???¬ê¸° ì¡°ì •**
   ```bash
   # CPU/ë©”ëª¨ë¦??¬ìš©??ì¤„ì´ê¸?
   az containerapp update --name portfolio-backend --resource-group portfolio-rg --cpu 0.5 --memory 1Gi
   ```

3. **ê°œë°œ ?˜ê²½??ë³„ë„ ë¦¬ì†Œ??ê·¸ë£¹**
   ```bash
   # ê°œë°œ ?˜ê²½?€ ???‘ì? ë¦¬ì†Œ???¬ìš©
   ./azure-deploy.sh development
   ```

### 8?¨ê³„: ë³´ì•ˆ ê°•í™”

#### ë³´ì•ˆ ?¤ì •

1. **?˜ê²½ ë³€???”í˜¸??*
   ```bash
   # Azure Key Vault ?¬ìš©
   az keyvault create --name portfolio-kv --resource-group portfolio-rg --location koreacentral
   ```

2. **?¤íŠ¸?Œí¬ ë³´ì•ˆ**
   ```bash
   # VNet ?µí•©
   az containerapp env create --name portfolio-env-secure --resource-group portfolio-rg --location koreacentral --infrastructure-subnet-resource-id /subscriptions/.../subnets/default
   ```

### 9?¨ê³„: ëª¨ë‹ˆ?°ë§ ë°??Œë¦¼

#### ëª¨ë‹ˆ?°ë§ ?¤ì •

```bash
# Application Insights ?°ê²°
az containerapp update --name portfolio-backend --resource-group portfolio-rg --set-env-vars APPLICATIONINSIGHTS_CONNECTION_STRING="your-connection-string"
```

### 10?¨ê³„: ë°±ì—… ë°?ë³µêµ¬

#### ?°ì´??ë°±ì—…

```bash
# MongoDB ë°±ì—…
az container exec --name portfolio-mongodb --resource-group portfolio-rg --exec-command "mongodump --out /backup"
```

---

## ?“Š ë°°í¬ ?„ë£Œ ???•ì¸?¬í•­

### ì²´í¬ë¦¬ìŠ¤??

- [ ] ë°±ì—”??API ?‘ë‹µ ?•ì¸
- [ ] ?„ë¡ ?¸ì—”???˜ì´ì§€ ë¡œë”© ?•ì¸
- [ ] Google OAuth ë¡œê·¸???ŒìŠ¤??
- [ ] ?„ë¡œ?íŠ¸ ëª©ë¡ ì¡°íšŒ ?ŒìŠ¤??
- [ ] ê¸°ìˆ  ?¤íƒ ëª©ë¡ ì¡°íšŒ ?ŒìŠ¤??
- [ ] ?™ì—… ê³¼ì • ëª©ë¡ ì¡°íšŒ ?ŒìŠ¤??
- [ ] CORS ?¤ë¥˜ ?•ì¸
- [ ] SSL ?¸ì¦???•ì¸
- [ ] ?±ëŠ¥ ?ŒìŠ¤??
- [ ] ëª¨ë‹ˆ?°ë§ ?¤ì • ?•ì¸

### ? ìš©??ëª…ë ¹??

```bash
# ë¦¬ì†Œ??ê·¸ë£¹ ?? œ (?„ì²´ ?? œ)
az group delete --name portfolio-rg --yes

# ?¹ì • ë¦¬ì†Œ?¤ë§Œ ?? œ
az containerapp delete --name portfolio-backend --resource-group portfolio-rg
az containerapp delete --name portfolio-frontend --resource-group portfolio-rg

# ë¹„ìš© ?•ì¸
az consumption usage list --billing-period-name 202401
```

---

## ?†˜ ì§€??

ë¬¸ì œê°€ ë°œìƒ?˜ë©´ ?¤ìŒ???•ì¸?˜ì„¸??

1. **ë¡œê·¸ ?•ì¸**: `az containerapp logs show`
2. **?íƒœ ?•ì¸**: `az containerapp show`
3. **?¤íŠ¸?Œí¬ ?•ì¸**: `az network nsg rule list`
4. **Azure ?íƒœ**: [Azure Status](https://status.azure.com/)

## ?“ ?°ë½ì²?

- GitHub Issues: [?„ë¡œ?íŠ¸ ?´ìŠˆ ?˜ì´ì§€]
- ?´ë©”?? [your-email@example.com]
