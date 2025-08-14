# Multi-stage build for Spring Boot backend
FROM gradle:8.10.2-jdk21-alpine AS builder

WORKDIR /app

# Copy gradle files
COPY build.gradle settings.gradle ./
COPY gradle gradle

# Copy source code
COPY src ./src

# Build the application
RUN gradle clean bootJar --no-daemon

# Production stage  
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="salieri009"
LABEL description="MyPortfolio Backend - Spring Boot with MongoDB"
LABEL version="1.0.0"

# Create app user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Install necessary packages
RUN apk --no-cache add curl tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# Copy JAR from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Change ownership
RUN chown -R appuser:appgroup /app

# Environment variables with defaults (secrets must be provided at runtime)
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080
ENV MONGODB_URI="mongodb://mongodb:27017/portfolio"
ENV GOOGLE_CLIENT_ID=""
ENV GOOGLE_CLIENT_SECRET=""
ENV JWT_SECRET=""
ENV CORS_ALLOWED_ORIGINS="*"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# JVM optimization for containers
ENV JAVA_OPTS="-Xms512m -Xmx1g -XX:+UseZGC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
