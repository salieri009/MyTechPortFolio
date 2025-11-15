# ?? MyPortfolio ë°°í¬ ê°€?´ë“œ

?„ë²½???¬íŠ¸?´ë¦¬???¹ì‚¬?´íŠ¸ë¥?Docker?€ Azureë¡?ë°°í¬?˜ëŠ” ì¢…í•© ê°€?´ë“œ?…ë‹ˆ??

## ?“‹ ëª©ì°¨

1. [ë¡œì»¬ ê°œë°œ ?˜ê²½ ?¤ì •](#ë¡œì»¬-ê°œë°œ-?˜ê²½-?¤ì •)
2. [Docker ì»¨í…Œ?´ë„ˆ ?¤í–‰](#docker-ì»¨í…Œ?´ë„ˆ-?¤í–‰)
3. [Azure ë°°í¬](#azure-ë°°í¬)
4. [?˜ê²½ ë³€???¤ì •](#?˜ê²½-ë³€???¤ì •)
5. [ëª¨ë‹ˆ?°ë§ ë°?ë¡œê¹…](#ëª¨ë‹ˆ?°ë§-ë°?ë¡œê¹…)

## ?› ï¸?ë¡œì»¬ ê°œë°œ ?˜ê²½ ?¤ì •

### ?¬ì „ ?”êµ¬?¬í•­
- Docker Desktop 4.0+
- Node.js 18+
- Java 21+
- Git

### 1. ?€?¥ì†Œ ?´ë¡ 
```bash
git clone https://github.com/salieri009/MyTechPortfolio.git
cd MyTechPortfolio
```

### 2. ?˜ê²½ ë³€???¤ì •
```bash
# ?˜ê²½ë³€???œí”Œë¦?ë³µì‚¬
cp environment.template .env

# .env ?Œì¼ ?¸ì§‘ (?¤ì œ ê°’ìœ¼ë¡?ë³€ê²?
nano .env
```

### 3. ê°œë°œ ?œë²„ ?¤í–‰
```bash
# ê°œë°œ ?˜ê²½ (??ë¦¬ë¡œ??ì§€??
docker-compose -f docker-compose.dev.yml up -d

# ?„ë¡œ?•ì…˜ ?˜ê²½ ?ŒìŠ¤??
docker-compose up -d
```

## ?³ Docker ì»¨í…Œ?´ë„ˆ ?¤í–‰

### ê°œë°œ ëª¨ë“œ
```bash
# ê°œë°œ ì»¨í…Œ?´ë„ˆ ?¤í–‰
docker-compose -f docker-compose.dev.yml up -d

# ë¡œê·¸ ?•ì¸
docker-compose -f docker-compose.dev.yml logs -f

# ì»¨í…Œ?´ë„ˆ ì¤‘ì?
docker-compose -f docker-compose.dev.yml down
```

### ?„ë¡œ?•ì…˜ ëª¨ë“œ
```bash
# ?„ë¡œ?•ì…˜ ì»¨í…Œ?´ë„ˆ ?¤í–‰
docker-compose up -d

# ?íƒœ ?•ì¸
docker-compose ps

# ë¡œê·¸ ?•ì¸
docker-compose logs -f

# ì»¨í…Œ?´ë„ˆ ì¤‘ì?
docker-compose down
```

### ê°œë³„ ?œë¹„??ê´€ë¦?
```bash
# ë°±ì—”?œë§Œ ?¬ì‹œ??
docker-compose restart backend

# ?„ë¡ ?¸ì—”?œë§Œ ?¬ë¹Œ??
docker-compose up --build frontend

# MongoDB ?°ì´???•ì¸
docker exec -it portfolio-mongodb mongosh
```

## ?ï¸ Azure ë°°í¬

### 1. Azure CLI ?¤ì¹˜ ë°?ë¡œê·¸??
```bash
# Azure CLI ?¤ì¹˜ (macOS)
brew install azure-cli

# Azure ë¡œê·¸??
az login

# êµ¬ë… ?•ì¸
az account list --output table
```

### 2. ?ë™ ë°°í¬ ?¤í¬ë¦½íŠ¸ ?¤í–‰
```bash
# ?¤í–‰ ê¶Œí•œ ë¶€??
chmod +x azure-deploy.sh

# ?˜ê²½ë³€???¤ì •
export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"
export MONGO_ROOT_PASSWORD="secure_password"
export JWT_SECRET="very_long_jwt_secret"
export GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# ë°°í¬ ?¤í–‰
./azure-deploy.sh production
```

### 3. ?˜ë™ Azure ë¦¬ì†Œ???ì„±

#### Container Registry ?ì„±
```bash
az acr create \
    --resource-group portfolio-rg \
    --name portfolioacr \
    --sku Basic \
    --admin-enabled true
```

#### Container Apps Environment ?ì„±
```bash
az containerapp env create \
    --name portfolio-env \
    --resource-group portfolio-rg \
    --location koreacentral
```

#### MongoDB ë°°í¬ (Azure Container Instance)
```bash
az container create \
    --resource-group portfolio-rg \
    --name portfolio-mongodb \
    --image mongo:7.0 \
    --dns-name-label portfolio-mongodb-unique \
    --ports 27017 \
    --environment-variables \
        MONGO_INITDB_ROOT_USERNAME=admin \
        MONGO_INITDB_ROOT_PASSWORD=$MONGO_ROOT_PASSWORD
```

### 4. CI/CD ?Œì´?„ë¼???¤ì •

GitHub Secrets???¤ìŒ ê°’ë“¤??ì¶”ê??˜ì„¸??

```
AZURE_CREDENTIALS={"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}
AZURE_CONTAINER_REGISTRY=portfolioacr.azurecr.io
AZURE_RESOURCE_GROUP=portfolio-rg
AZURE_CONTAINER_APP_NAME=portfolio-backend
AZURE_ACR_USERNAME=portfolioacr
AZURE_ACR_PASSWORD=acr_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_BASE_URL=https://portfolio-backend.azurecontainerapps.io/api
```

## ?“Š ?˜ê²½ ë³€???¤ì •

### ?„ìˆ˜ ?˜ê²½ ë³€??

| ë³€?˜ëª… | ?¤ëª… | ?ˆì‹œ |
|--------|------|------|
| `MONGO_ROOT_PASSWORD` | MongoDB ë£¨íŠ¸ ë¹„ë?ë²ˆí˜¸ | `securePassword123!` |
| `GOOGLE_CLIENT_ID` | Google OAuth ?´ë¼?´ì–¸??ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth ?´ë¼?´ì–¸???œí¬ë¦?| `GOCSPX-abcdef123456` |
| `JWT_SECRET` | JWT ?œëª… ë¹„ë???(64???´ìƒ) | `myVeryLongAndSecureJWTSecret...` |
| `GA_MEASUREMENT_ID` | Google Analytics ì¸¡ì • ID | `G-XXXXXXXXXX` |

### ? íƒ???˜ê²½ ë³€??

| ë³€?˜ëª… | ê¸°ë³¸ê°?| ?¤ëª… |
|--------|---------|------|
| `CORS_ALLOWED_ORIGINS` | `*` | CORS ?ˆìš© ?„ë©”??|
| `VITE_USE_BACKEND_API` | `true` | ë°±ì—”??API ?¬ìš© ?¬ë? |

## ?“ˆ ëª¨ë‹ˆ?°ë§ ë°?ë¡œê¹…

### ë¡œì»¬ ?˜ê²½ ëª¨ë‹ˆ?°ë§
```bash
# ì»¨í…Œ?´ë„ˆ ?íƒœ ?•ì¸
docker-compose ps

# ë¦¬ì†Œ???¬ìš©???•ì¸
docker stats

# ë¡œê·¸ ?¤ì‹œê°??•ì¸
docker-compose logs -f

# ?¹ì • ?œë¹„??ë¡œê·¸
docker-compose logs -f backend
```

### Azure ?˜ê²½ ëª¨ë‹ˆ?°ë§
```bash
# Container App ?íƒœ ?•ì¸
az containerapp show \
    --name portfolio-backend \
    --resource-group portfolio-rg

# ë¡œê·¸ ?¤íŠ¸ë¦??•ì¸
az containerapp logs show \
    --name portfolio-backend \
    --resource-group portfolio-rg \
    --follow
```

### Google Analytics ?•ì¸
1. [Google Analytics 4](https://analytics.google.com/)?ì„œ ?¤ì‹œê°??°ì´???•ì¸
2. ?¬ìš©???Œë¡œ?? ?˜ì´ì§€ ì¡°íšŒ?? ?´ë²¤??ì¶”ì  ?•ì¸
3. ì»¤ìŠ¤?€ ?€?œë³´???¤ì •

## ?š¨ ë¬¸ì œ ?´ê²°

### ?ì£¼ ë°œìƒ?˜ëŠ” ë¬¸ì œ??

#### 1. MongoDB ?°ê²° ?¤íŒ¨
```bash
# MongoDB ì»¨í…Œ?´ë„ˆ ?íƒœ ?•ì¸
docker logs portfolio-mongodb

# ?¤íŠ¸?Œí¬ ?°ê²° ?•ì¸
docker network ls
docker network inspect myportfolio_portfolio-network
```

#### 2. Google OAuth ?¸ì¦ ?¤íŒ¨
- Google Cloud Console?ì„œ OAuth ?¤ì • ?•ì¸
- Authorized redirect URIs ?¤ì • ?•ì¸
- ?´ë¼?´ì–¸??ID/Secret ê°??•ì¸

#### 3. ë¹Œë“œ ?¤íŒ¨
```bash
# ìºì‹œ ?´ë¦¬?????¬ë¹Œ??
docker-compose build --no-cache

# ?˜ì¡´??ë¬¸ì œ ?•ì¸
docker-compose run --rm backend ./gradlew dependencies
docker-compose run --rm frontend npm audit
```

### ë¡œê·¸ ?„ì¹˜
- Frontend: `./logs/frontend/`
- Backend: `./logs/backend/`
- MongoDB: Docker ì»¨í…Œ?´ë„ˆ ë¡œê·¸

## ?“š ì¶”ê? ?ë£Œ

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)

## ?¤ ê¸°ì—¬ ê°€?´ë“œ

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## ?“„ ?¼ì´?¼ìŠ¤

???„ë¡œ?íŠ¸??MIT ?¼ì´?¼ìŠ¤ ?˜ì— ë°°í¬?©ë‹ˆ??

---

## ?†˜ ì§€??

ë¬¸ì œê°€ ë°œìƒ?˜ë©´ ?¤ìŒ???•ì¸?´ì£¼?¸ìš”:

1. [Issues](https://github.com/salieri009/MyTechPortfolio/issues)?ì„œ ? ì‚¬??ë¬¸ì œ ê²€??
2. ë¡œê·¸ ?Œì¼ ?•ì¸
3. ?˜ê²½ ë³€???¤ì • ?¬í™•??
4. Docker ì»¨í…Œ?´ë„ˆ ?íƒœ ?•ì¸

ì¶”ê? ?„ì????„ìš”?˜ë©´ ?ˆë¡œ??Issueë¥??ì„±?´ì£¼?¸ìš”! ??
