# Multi-stage build for React frontend
FROM node:18-alpine AS builder

LABEL maintainer="salieri009"
LABEL description="MyPortfolio Frontend - React with TypeScript"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean cache
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL=http://localhost:8080/api
ARG VITE_GOOGLE_CLIENT_ID=""
ARG VITE_GA_MEASUREMENT_ID=""
ARG VITE_USE_BACKEND_API=true

# Set environment variables
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
ENV VITE_USE_BACKEND_API=$VITE_USE_BACKEND_API

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:1.25-alpine

# Install additional packages for security, performance, and runtime env injection
RUN apk --no-cache add curl tzdata gettext && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# Create nginx user
RUN addgroup -g 1001 -S nginxgroup && \
    adduser -u 1001 -S nginxuser -G nginxgroup

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy additional nginx configurations
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for runtime environment injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create log directories
RUN mkdir -p /var/log/nginx && \
    chown -R nginxuser:nginxgroup /var/log/nginx && \
    chown -R nginxuser:nginxgroup /usr/share/nginx/html && \
    chown -R nginxuser:nginxgroup /etc/nginx/conf.d

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Switch to non-root user
USER nginxuser

# Expose port
EXPOSE 80

# Use entrypoint for runtime env injection
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
