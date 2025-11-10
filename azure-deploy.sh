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

# Load environment variables
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  .env file not found. Using default values..."
    # Set default values
    export MONGO_ROOT_PASSWORD="mongo123"
    export GOOGLE_CLIENT_ID="1098017074065-i5kgtgj5upsvh06vtmhfi2ba78hh25sc.apps.googleusercontent.com"
    export GOOGLE_CLIENT_SECRET="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"
    export JWT_SECRET="demo-jwt-secret-1234567890123456789012345678901234567890"
    export GA_MEASUREMENT_ID="G-XXXXXXXXXX"
fi

echo "🚀 Starting Azure deployment for $ENVIRONMENT environment"

# Validate required environment variables
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set"
    exit 1
fi

# Login to Azure (if not already logged in)
if ! az account show > /dev/null 2>&1; then
    echo "🔐 Logging into Azure..."
    az login
fi

# Check if resource group exists
if ! az group show --name $RESOURCE_GROUP > /dev/null 2>&1; then
    echo "📁 Creating resource group..."
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    echo "📁 Resource group already exists"
fi

# Check if ACR exists
if ! az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
    echo "🏗️ Creating Azure Container Registry..."
    az acr create \
        --resource-group $RESOURCE_GROUP \
        --name $ACR_NAME \
        --sku Basic \
        --admin-enabled true
else
    echo "🏗️ Azure Container Registry already exists"
fi

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
    --build-arg VITE_GA_MEASUREMENT_ID=$GA_MEASUREMENT_ID \
    --build-arg VITE_USE_BACKEND_API=true

docker push $ACR_LOGIN_SERVER/portfolio-frontend:latest

# Check if Container Apps Environment exists
if ! az containerapp env show --name $CONTAINER_APP_ENV --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
    echo "🌍 Creating Container Apps Environment..."
    az containerapp env create \
        --name $CONTAINER_APP_ENV \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
else
    echo "🌍 Container Apps Environment already exists"
fi

# Check if MongoDB container exists
if ! az container show --resource-group $RESOURCE_GROUP --name portfolio-mongodb > /dev/null 2>&1; then
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
else
    echo "🗄️ MongoDB container already exists"
fi

# Get MongoDB FQDN
MONGODB_FQDN=$(az container show --resource-group $RESOURCE_GROUP --name portfolio-mongodb --query ipAddress.fqdn --output tsv)

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

# Check if backend Container App exists
if ! az containerapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
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
else
    echo "🚀 Updating backend Container App..."
    az containerapp update \
        --name $BACKEND_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --image $ACR_LOGIN_SERVER/portfolio-backend:latest \
        --env-vars \
            SPRING_PROFILES_ACTIVE=prod \
            MONGODB_URI="mongodb://admin:$MONGO_ROOT_PASSWORD@$MONGODB_FQDN:27017/portfolio?authSource=admin" \
            GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
            GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
            JWT_SECRET=$JWT_SECRET \
            CORS_ALLOWED_ORIGINS="https://$FRONTEND_APP_NAME.azurecontainerapps.io"
fi

# Get backend URL
BACKEND_URL=$(az containerapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)

# Check if frontend Container App exists
if ! az containerapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
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
else
    echo "🎨 Updating frontend Container App..."
    az containerapp update \
        --name $FRONTEND_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --image $ACR_LOGIN_SERVER/portfolio-frontend:latest
fi

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
echo ""
echo "📊 Health Check URLs:"
echo "   Backend Health: https://$BACKEND_URL/api/actuator/health"
echo "   Frontend Health: https://$FRONTEND_URL"
