#!/bin/bash

# Azure Deployment Script for MyPortfolio
# Usage: ./azure-deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
RESOURCE_GROUP="portfolio-rg"
LOCATION="koreacentral"
ACR_NAME="portfolioacr"
CONTAINER_APP_ENV="portfolio-env"
BACKEND_APP_NAME="portfolio-backend"
FRONTEND_APP_NAME="portfolio-frontend"

echo "🚀 Starting Azure deployment for $ENVIRONMENT environment"

# Login to Azure (if not already logged in)
if ! az account show > /dev/null 2>&1; then
    echo "🔐 Logging into Azure..."
    az login
fi

# Create resource group
echo "📁 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry
echo "🏗️ Creating Azure Container Registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled true

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query loginServer --output tsv)

# Login to ACR
echo "🔑 Logging into Azure Container Registry..."
az acr login --name $ACR_NAME

# Build and push backend image
echo "🏗️ Building and pushing backend image..."
docker build -t $ACR_LOGIN_SERVER/portfolio-backend:latest ./backend
docker push $ACR_LOGIN_SERVER/portfolio-backend:latest

# Build and push frontend image
echo "🏗️ Building and pushing frontend image..."
docker build -t $ACR_LOGIN_SERVER/portfolio-frontend:latest ./frontend \
    --build-arg VITE_API_BASE_URL=https://$BACKEND_APP_NAME.azurecontainerapps.io/api \
    --build-arg VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
    --build-arg VITE_GA_MEASUREMENT_ID=$GA_MEASUREMENT_ID

docker push $ACR_LOGIN_SERVER/portfolio-frontend:latest

# Create Container Apps Environment
echo "🌍 Creating Container Apps Environment..."
az containerapp env create \
    --name $CONTAINER_APP_ENV \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION

# Create MongoDB (using Container Instance for simplicity)
echo "🗄️ Creating MongoDB container..."
az container create \
    --resource-group $RESOURCE_GROUP \
    --name portfolio-mongodb \
    --image mongo:7.0 \
    --dns-name-label portfolio-mongodb-$RANDOM \
    --ports 27017 \
    --environment-variables \
        MONGO_INITDB_ROOT_USERNAME=admin \
        MONGO_INITDB_ROOT_PASSWORD=$MONGO_ROOT_PASSWORD \
        MONGO_INITDB_DATABASE=portfolio

# Get MongoDB FQDN
MONGODB_FQDN=$(az container show --resource-group $RESOURCE_GROUP --name portfolio-mongodb --query ipAddress.fqdn --output tsv)

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

# Create backend Container App
echo "🚀 Creating backend Container App..."
az containerapp create \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_APP_ENV \
    --image $ACR_LOGIN_SERVER/portfolio-backend:latest \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --target-port 8080 \
    --ingress external \
    --min-replicas 1 \
    --max-replicas 3 \
    --cpu 1.0 \
    --memory 2Gi \
    --env-vars \
        SPRING_PROFILES_ACTIVE=prod \
        MONGODB_URI="mongodb://admin:$MONGO_ROOT_PASSWORD@$MONGODB_FQDN:27017/portfolio?authSource=admin" \
        GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
        GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
        JWT_SECRET=$JWT_SECRET \
        CORS_ALLOWED_ORIGINS="https://$FRONTEND_APP_NAME.azurecontainerapps.io"

# Get backend URL
BACKEND_URL=$(az containerapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)

# Create frontend Container App
echo "🎨 Creating frontend Container App..."
az containerapp create \
    --name $FRONTEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_APP_ENV \
    --image $ACR_LOGIN_SERVER/portfolio-frontend:latest \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --target-port 80 \
    --ingress external \
    --min-replicas 1 \
    --max-replicas 5 \
    --cpu 0.5 \
    --memory 1Gi

# Get frontend URL
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)

echo "✅ Deployment completed successfully!"
echo ""
echo "📍 URLs:"
echo "   Frontend: https://$FRONTEND_URL"
echo "   Backend:  https://$BACKEND_URL"
echo "   MongoDB:  $MONGODB_FQDN:27017"
echo ""
echo "🔧 Next steps:"
echo "1. Configure your domain name (if needed)"
echo "2. Set up SSL certificates"
echo "3. Configure monitoring and logging"
echo "4. Set up CI/CD pipeline for automatic deployments"
