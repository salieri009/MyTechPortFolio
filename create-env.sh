#!/bin/bash

# Azure 배포를 위한 환경 변수 파일 생성 스크립트
# Usage: ./create-env.sh

echo "🔧 Creating .env file for Azure deployment..."

# .env 파일 생성
cat > .env << EOF
# Database Configuration
MONGO_ROOT_PASSWORD=mongo123

# Google OAuth Configuration
GOOGLE_CLIENT_ID=1098017074065-i5kgtgj5upsvh06vtmhfi2ba78hh25sc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# JWT Configuration
JWT_SECRET=demo-jwt-secret-1234567890123456789012345678901234567890

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://*.azurestaticapps.net,https://*.vercel.app,https://*.azurecontainerapps.io

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=1098017074065-i5kgtgj5upsvh06vtmhfi2ba78hh25sc.apps.googleusercontent.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_USE_BACKEND_API=true

# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Azure Configuration
AZURE_SUBSCRIPTION_ID=your_azure_subscription_id
AZURE_RESOURCE_GROUP=portfolio-rg
AZURE_CONTAINER_REGISTRY=portfolioacr
AZURE_CONTAINER_APP_NAME=portfolio-app

# Production URLs
PRODUCTION_DOMAIN=your-domain.com
PRODUCTION_API_URL=https://your-domain.com/api
EOF

echo "✅ .env file created successfully!"
echo "📝 Please review and update the values as needed before deployment."
