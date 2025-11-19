# AWS Deployment Guide

> **Document Version**: 1.0.0  
> **Last Updated**: 2025-11-19  
> **Author**: 20-Year Senior Technical Writer  
> **Target Audience**: DevOps Engineers, Platform Engineers, AWS Architects  
> **Estimated Setup Time**: 3-4 hours  
> **Maintenance Level**: Enterprise-Grade

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Initial Setup](#initial-setup)
5. [Infrastructure as Code](#infrastructure-as-code)
6. [Container Deployment](#container-deployment)
7. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Security Configuration](#security-configuration)
10. [Cost Optimization](#cost-optimization)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Appendix](#appendix)

---

## Overview

This guide provides comprehensive instructions for deploying the MyTechPortfolio application to Amazon Web Services (AWS) using modern container orchestration and serverless technologies. The deployment leverages Amazon ECS (Elastic Container Service) with Fargate, Amazon ECR (Elastic Container Registry), AWS Secrets Manager, and Application Load Balancer for a scalable, secure, and cost-effective production environment.

### Key Features

- **Serverless Containers**: ECS Fargate for container orchestration without managing servers
- **Auto Scaling**: Automatic scaling based on CPU, memory, and request metrics
- **High Availability**: Multi-AZ deployment with load balancing
- **Secret Management**: AWS Secrets Manager for secure credential storage
- **CI/CD Integration**: Native integration with AWS CodePipeline and CodeBuild
- **Cost Optimization**: Pay-per-use pricing with automatic scaling
- **Security**: VPC isolation, IAM roles, and encryption at rest and in transit

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS CloudFront                            │
│              (CDN & SSL Termination)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Application Load Balancer (ALB)                      │
│         (HTTPS, Health Checks, Routing)                      │
└────────┬───────────────────────────────────────┬─────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────────┐              ┌─────────────────────┐
│   ECS Fargate       │              │   ECS Fargate       │
│   Frontend Service  │              │   Backend Service   │
│   (Port 80)         │              │   (Port 8080)       │
│   ┌──────────────┐  │              │   ┌──────────────┐  │
│   │ Task 1       │  │              │   │ Task 1       │  │
│   │ Task 2       │  │              │   │ Task 2       │  │
│   └──────────────┘  │              │   └──────────────┘  │
└─────────────────────┘              └─────────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Amazon VPC                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Public Subnet│  │ Private Subnet│  │ Private Subnet│     │
│  │ (ALB)        │  │ (ECS Tasks)   │  │ (RDS/MongoDB)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Amazon DocumentDB (MongoDB)                    │
│         (Managed Database Service)                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              AWS Secrets Manager                             │
│         (Secrets & Credentials)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Accounts and Services

1. **AWS Account**
   - Active AWS account with Administrator or Power User permissions
   - AWS CLI configured with credentials
   - Billing alerts configured

2. **Required AWS Services**
   - Amazon ECS (Elastic Container Service)
   - Amazon ECR (Elastic Container Registry)
   - Amazon VPC (Virtual Private Cloud)
   - Application Load Balancer (ALB)
   - AWS Secrets Manager
   - Amazon CloudWatch (for monitoring)
   - AWS IAM (Identity and Access Management)
   - AWS Certificate Manager (for SSL/TLS)

3. **Optional but Recommended**
   - Amazon DocumentDB (MongoDB-compatible managed database)
   - AWS CloudFront (CDN)
   - AWS Route 53 (DNS)
   - AWS CodePipeline (CI/CD)
   - AWS CodeBuild (Build service)

### Required Tools

1. **AWS CLI** (v2.15.0 or later)
   ```bash
   # Install AWS CLI
   # Windows
   winget install Amazon.AWSCLI
   
   # macOS
   brew install awscli
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   
   # Verify installation
   aws --version
   
   # Configure AWS CLI
   aws configure
   # Enter: Access Key ID, Secret Access Key, Region, Output format
   ```

2. **Docker Desktop** (v4.20.0 or later)
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

3. **Terraform** (v1.6.0 or later) - Optional, for IaC
   ```bash
   # Install Terraform
   # Windows
   winget install HashiCorp.Terraform
   
   # macOS
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6_0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

4. **kubectl** (if using EKS instead of ECS) - Optional
   ```bash
   # Install kubectl
   # Windows
   winget install Kubernetes.kubectl
   
   # macOS
   brew install kubectl
   
   # Linux
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

### Required Knowledge

- Basic understanding of AWS services
- Familiarity with Docker and containerization
- Understanding of networking concepts (VPC, subnets, security groups)
- Knowledge of CI/CD concepts
- Basic understanding of IAM roles and policies

---

## Architecture Overview

### Service Components

| Component | AWS Service | Purpose | Configuration |
|-----------|-------------|---------|---------------|
| Container Registry | Amazon ECR | Store Docker images | Private repository |
| Container Orchestration | Amazon ECS Fargate | Run containers | Serverless, auto-scaling |
| Load Balancing | Application Load Balancer | Distribute traffic | HTTPS, health checks |
| Database | Amazon DocumentDB | MongoDB-compatible database | Multi-AZ, automated backups |
| Secrets Management | AWS Secrets Manager | Store credentials | Encrypted, versioned |
| Monitoring | Amazon CloudWatch | Metrics and logs | Dashboards, alarms |
| CDN | Amazon CloudFront | Content delivery | Global distribution |
| DNS | AWS Route 53 | Domain management | DNS routing |
| CI/CD | AWS CodePipeline | Automated deployment | Multi-stage pipeline |

### Network Architecture

```
Internet
   │
   ▼
CloudFront (Optional)
   │
   ▼
Application Load Balancer (Public Subnet)
   │
   ├───► ECS Frontend Service (Private Subnet)
   │     └───► ECS Tasks (Fargate)
   │
   └───► ECS Backend Service (Private Subnet)
         └───► ECS Tasks (Fargate)
               │
               ▼
         DocumentDB (Private Subnet)
```

### Resource Naming Convention

```
Resource Type          | Naming Pattern                    | Example
----------------------|-----------------------------------|--------------------------
VPC                   | {project}-vpc                     | portfolio-vpc
ECR Repository        | {project}/{component}             | portfolio/backend
ECS Cluster           | {project}-cluster                  | portfolio-cluster
ECS Service           | {project}-{component}-{env}       | portfolio-backend-prod
Task Definition       | {project}-{component}-{env}       | portfolio-backend-prod
Load Balancer         | {project}-alb                      | portfolio-alb
Target Group          | {project}-{component}-tg          | portfolio-backend-tg
Security Group        | {project}-{component}-sg           | portfolio-backend-sg
Secrets Manager       | {project}/{component}/{secret}     | portfolio/backend/jwt-secret
```

---

## Initial Setup

### Step 1: AWS Account Configuration

#### 1.1 Configure AWS CLI

```bash
# Configure AWS CLI
aws configure

# Enter the following:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1 (or your preferred region)
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

#### 1.2 Set Environment Variables

```bash
# Set default region
export AWS_DEFAULT_REGION=us-east-1
export AWS_REGION=us-east-1

# Set project variables
export PROJECT_NAME=portfolio
export ENVIRONMENT=production
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
```

### Step 2: Create ECR Repositories

#### 2.1 Create Backend Repository

```bash
# Create ECR repository for backend
aws ecr create-repository \
  --repository-name portfolio/backend \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 \
  --tags Key=Project,Value=Portfolio Key=Component,Value=Backend

# Get repository URI
BACKEND_ECR_URI=$(aws ecr describe-repositories \
  --repository-names portfolio/backend \
  --query 'repositories[0].repositoryUri' \
  --output text)
echo $BACKEND_ECR_URI
```

#### 2.2 Create Frontend Repository

```bash
# Create ECR repository for frontend
aws ecr create-repository \
  --repository-name portfolio/frontend \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 \
  --tags Key=Project,Value=Portfolio Key=Component,Value=Frontend

# Get repository URI
FRONTEND_ECR_URI=$(aws ecr describe-repositories \
  --repository-names portfolio/frontend \
  --query 'repositories[0].repositoryUri' \
  --output text)
echo $FRONTEND_ECR_URI
```

#### 2.3 Configure Docker Login

```bash
# Get ECR login token
aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
```

### Step 3: Create VPC and Networking

#### 3.1 Create VPC

```bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=portfolio-vpc},{Key=Project,Value=Portfolio}]" \
  --query 'Vpc.VpcId' \
  --output text)
echo "VPC ID: $VPC_ID"

# Enable DNS hostnames
aws ec2 modify-vpc-attribute \
  --vpc-id $VPC_ID \
  --enable-dns-hostnames

# Enable DNS resolution
aws ec2 modify-vpc-attribute \
  --vpc-id $VPC_ID \
  --enable-dns-support
```

#### 3.2 Create Internet Gateway

```bash
# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=portfolio-igw}]" \
  --query 'InternetGateway.InternetGatewayId' \
  --output text)

# Attach to VPC
aws ec2 attach-internet-gateway \
  --vpc-id $VPC_ID \
  --internet-gateway-id $IGW_ID
```

#### 3.3 Create Subnets

```bash
# Create public subnet (for ALB)
PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone ${AWS_DEFAULT_REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=portfolio-public-subnet-1}]" \
  --query 'Subnet.SubnetId' \
  --output text)

PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone ${AWS_DEFAULT_REGION}b \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=portfolio-public-subnet-2}]" \
  --query 'Subnet.SubnetId' \
  --output text)

# Create private subnets (for ECS tasks)
PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.11.0/24 \
  --availability-zone ${AWS_DEFAULT_REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=portfolio-private-subnet-1}]" \
  --query 'Subnet.SubnetId' \
  --output text)

PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.12.0/24 \
  --availability-zone ${AWS_DEFAULT_REGION}b \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=portfolio-private-subnet-2}]" \
  --query 'Subnet.SubnetId' \
  --output text)
```

#### 3.4 Create Route Tables

```bash
# Create public route table
PUBLIC_RT=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=portfolio-public-rt}]" \
  --query 'RouteTable.RouteTableId' \
  --output text)

# Add route to Internet Gateway
aws ec2 create-route \
  --route-table-id $PUBLIC_RT \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID

# Associate public subnets with route table
aws ec2 associate-route-table \
  --subnet-id $PUBLIC_SUBNET_1 \
  --route-table-id $PUBLIC_RT

aws ec2 associate-route-table \
  --subnet-id $PUBLIC_SUBNET_2 \
  --route-table-id $PUBLIC_RT

# Create private route table (for NAT Gateway - optional)
PRIVATE_RT=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=portfolio-private-rt}]" \
  --query 'RouteTable.RouteTableId' \
  --output text)

# Associate private subnets
aws ec2 associate-route-table \
  --subnet-id $PRIVATE_SUBNET_1 \
  --route-table-id $PRIVATE_RT

aws ec2 associate-route-table \
  --subnet-id $PRIVATE_SUBNET_2 \
  --route-table-id $PRIVATE_RT
```

### Step 4: Create Security Groups

#### 4.1 Create ALB Security Group

```bash
# Create security group for ALB
ALB_SG=$(aws ec2 create-security-group \
  --group-name portfolio-alb-sg \
  --description "Security group for Application Load Balancer" \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=portfolio-alb-sg}]" \
  --query 'GroupId' \
  --output text)

# Allow HTTP from internet
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS from internet
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

#### 4.2 Create ECS Security Group

```bash
# Create security group for ECS tasks
ECS_SG=$(aws ec2 create-security-group \
  --group-name portfolio-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=portfolio-ecs-sg}]" \
  --query 'GroupId' \
  --output text)

# Allow traffic from ALB
aws ec2 authorize-security-group-ingress \
  --group-id $ECS_SG \
  --protocol tcp \
  --port 8080 \
  --source-group $ALB_SG

aws ec2 authorize-security-group-ingress \
  --group-id $ECS_SG \
  --protocol tcp \
  --port 80 \
  --source-group $ALB_SG
```

### Step 5: Create Application Load Balancer

#### 5.1 Create ALB

```bash
# Create Application Load Balancer
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name portfolio-alb \
  --subnets $PUBLIC_SUBNET_1 $PUBLIC_SUBNET_2 \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --tags Key=Name,Value=portfolio-alb Key=Project,Value=Portfolio \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --query 'LoadBalancers[0].DNSName' \
  --output text)
echo "ALB DNS: $ALB_DNS"
```

#### 5.2 Create Target Groups

```bash
# Create target group for backend
BACKEND_TG=$(aws elbv2 create-target-group \
  --name portfolio-backend-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path /api/actuator/health \
  --health-check-protocol HTTP \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --tags Key=Name,Value=portfolio-backend-tg \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Create target group for frontend
FRONTEND_TG=$(aws elbv2 create-target-group \
  --name portfolio-frontend-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path / \
  --health-check-protocol HTTP \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --tags Key=Name,Value=portfolio-frontend-tg \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)
```

#### 5.3 Create Listeners

```bash
# Create HTTP listener (redirects to HTTPS)
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}"

# Create HTTPS listener (requires SSL certificate)
# First, request or import SSL certificate in ACM
# Then create listener:
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:region:account:certificate/cert-id \
  --default-actions Type=forward,TargetGroupArn=$FRONTEND_TG
```

### Step 6: Create ECS Cluster

```bash
# Create ECS cluster
aws ecs create-cluster \
  --cluster-name portfolio-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1 \
    capacityProvider=FARGATE_SPOT,weight=1 \
  --tags key=Name,value=portfolio-cluster key=Project,value=Portfolio
```

### Step 7: Store Secrets in AWS Secrets Manager

```bash
# Store JWT secret
aws secretsmanager create-secret \
  --name portfolio/backend/jwt-secret \
  --description "JWT signing secret for backend" \
  --secret-string "your-very-long-jwt-secret-minimum-64-characters" \
  --tags Key=Project,Value=Portfolio Key=Component,Value=Backend

# Store Google OAuth credentials
aws secretsmanager create-secret \
  --name portfolio/backend/google-oauth \
  --description "Google OAuth credentials" \
  --secret-string '{"clientId":"your-client-id","clientSecret":"your-client-secret"}' \
  --tags Key=Project,Value=Portfolio Key=Component,Value=Backend

# Store MongoDB connection string
aws secretsmanager create-secret \
  --name portfolio/backend/mongodb-uri \
  --description "MongoDB connection string" \
  --secret-string "mongodb://admin:password@host:27017/portfolio?authSource=admin" \
  --tags Key=Project,Value=Portfolio Key=Component,Value=Backend
```

---

## Infrastructure as Code

### Terraform Configuration (Optional)

Create `infra/aws/terraform/main.tf`:

```hcl
terraform {
  required_version = ">= 1.6.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "portfolio-terraform-state"
    key    = "portfolio/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Portfolio"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = "10.0.0.0/16"
  
  availability_zones = ["${var.aws_region}a", "${var.aws_region}b"]
  
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"
  
  project_name = var.project_name
  repositories = ["backend", "frontend"]
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"
  
  project_name     = var.project_name
  environment      = var.environment
  vpc_id           = module.vpc.vpc_id
  private_subnets  = module.vpc.private_subnet_ids
  alb_security_group_id = module.alb.security_group_id
  
  backend_image = "${module.ecr.backend_repository_url}:latest"
  frontend_image = "${module.ecr.frontend_repository_url}:latest"
}

# ALB Module
module "alb" {
  source = "./modules/alb"
  
  project_name    = var.project_name
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  public_subnets  = module.vpc.public_subnet_ids
  certificate_arn = var.certificate_arn
}

# Secrets Manager Module
module "secrets" {
  source = "./modules/secrets"
  
  project_name = var.project_name
  secrets = {
    jwt_secret     = var.jwt_secret
    google_oauth   = var.google_oauth
    mongodb_uri    = var.mongodb_uri
  }
}
```

---

## Container Deployment

### Step 1: Build and Push Docker Images

#### 1.1 Build Backend Image

```bash
# Navigate to backend directory
cd backend

# Build Docker image
docker build -t portfolio-backend:latest .

# Tag for ECR
docker tag portfolio-backend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/portfolio/backend:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/portfolio/backend:latest
```

#### 1.2 Build Frontend Image

```bash
# Navigate to frontend directory
cd frontend

# Build Docker image with build args
docker build \
  --build-arg VITE_API_BASE_URL=https://api.yourdomain.com/api \
  --build-arg VITE_GOOGLE_CLIENT_ID=your-client-id \
  --build-arg VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
  --build-arg VITE_USE_BACKEND_API=true \
  -t portfolio-frontend:latest .

# Tag for ECR
docker tag portfolio-frontend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/portfolio/frontend:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/portfolio/frontend:latest
```

### Step 2: Create ECS Task Definitions

#### 2.1 Create Backend Task Definition

Create `infra/aws/ecs/backend-task-definition.json`:

```json
{
  "family": "portfolio-backend-prod",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/portfolio/backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:portfolio/backend/jwt-secret"
        },
        {
          "name": "GOOGLE_CLIENT_ID",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:portfolio/backend/google-oauth:clientId::"
        },
        {
          "name": "GOOGLE_CLIENT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:portfolio/backend/google-oauth:clientSecret::"
        },
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:portfolio/backend/mongodb-uri"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/portfolio-backend",
          "awslogs-region": "REGION",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:8080/api/actuator/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://infra/aws/ecs/backend-task-definition.json
```

#### 2.2 Create Frontend Task Definition

Similar process for frontend (port 80, no secrets required).

### Step 3: Create ECS Services

#### 3.1 Create Backend Service

```bash
aws ecs create-service \
  --cluster portfolio-cluster \
  --service-name portfolio-backend-prod \
  --task-definition portfolio-backend-prod \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1,$PRIVATE_SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=$BACKEND_TG,containerName=backend,containerPort=8080" \
  --health-check-grace-period-seconds 60 \
  --enable-execute-command
```

#### 3.2 Create Frontend Service

```bash
aws ecs create-service \
  --cluster portfolio-cluster \
  --service-name portfolio-frontend-prod \
  --task-definition portfolio-frontend-prod \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1,$PRIVATE_SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=$FRONTEND_TG,containerName=frontend,containerPort=80" \
  --health-check-grace-period-seconds 60
```

### Step 4: Configure Auto Scaling

```bash
# Register scalable target for backend
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/portfolio-cluster/portfolio-backend-prod \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy (CPU-based)
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/portfolio-cluster/portfolio-backend-prod \
  --policy-name backend-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
```

---

## CI/CD Pipeline Setup

### AWS CodePipeline Configuration

Create `infra/aws/codepipeline/pipeline.json`:

```json
{
  "pipeline": {
    "name": "portfolio-pipeline",
    "roleArn": "arn:aws:iam::ACCOUNT_ID:role/CodePipelineServiceRole",
    "artifactStore": {
      "type": "S3",
      "location": "portfolio-pipeline-artifacts"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [
          {
            "name": "SourceAction",
            "actionTypeId": {
              "category": "Source",
              "owner": "AWS",
              "provider": "CodeCommit",
              "version": "1"
            },
            "outputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ],
            "configuration": {
              "RepositoryName": "portfolio",
              "BranchName": "main"
            }
          }
        ]
      },
      {
        "name": "Build",
        "actions": [
          {
            "name": "BuildBackend",
            "actionTypeId": {
              "category": "Build",
              "owner": "AWS",
              "provider": "CodeBuild",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ],
            "outputArtifacts": [
              {
                "name": "BackendBuildOutput"
              }
            ],
            "configuration": {
              "ProjectName": "portfolio-backend-build"
            }
          },
          {
            "name": "BuildFrontend",
            "actionTypeId": {
              "category": "Build",
              "owner": "AWS",
              "provider": "CodeBuild",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ],
            "outputArtifacts": [
              {
                "name": "FrontendBuildOutput"
              }
            ],
            "configuration": {
              "ProjectName": "portfolio-frontend-build"
            }
          }
        ]
      },
      {
        "name": "Deploy",
        "actions": [
          {
            "name": "DeployBackend",
            "actionTypeId": {
              "category": "Deploy",
              "owner": "AWS",
              "provider": "ECS",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "BackendBuildOutput"
              }
            ],
            "configuration": {
              "ClusterName": "portfolio-cluster",
              "ServiceName": "portfolio-backend-prod",
              "FileName": "imagedefinitions.json"
            }
          },
          {
            "name": "DeployFrontend",
            "actionTypeId": {
              "category": "Deploy",
              "owner": "AWS",
              "provider": "ECS",
              "version": "1"
            },
            "inputArtifacts": [
              {
                "name": "FrontendBuildOutput"
              }
            ],
            "configuration": {
              "ClusterName": "portfolio-cluster",
              "ServiceName": "portfolio-frontend-prod",
              "FileName": "imagedefinitions.json"
            }
          }
        ]
      }
    ]
  }
}
```

---

## Monitoring and Logging

### CloudWatch Logs

```bash
# Create log group for backend
aws logs create-log-group \
  --log-group-name /ecs/portfolio-backend \
  --tags Key=Project,Value=Portfolio

# Create log group for frontend
aws logs create-log-group \
  --log-group-name /ecs/portfolio-frontend \
  --tags Key=Project,Value=Portfolio
```

### CloudWatch Alarms

```bash
# Create alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name portfolio-backend-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:REGION:ACCOUNT_ID:portfolio-alerts
```

---

## Security Configuration

### IAM Roles

#### Task Execution Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## Cost Optimization

### Fargate Spot

Use Fargate Spot for non-critical workloads to save up to 70%:

```bash
aws ecs create-service \
  --cluster portfolio-cluster \
  --service-name portfolio-backend-dev \
  --task-definition portfolio-backend-dev \
  --desired-count 1 \
  --launch-type FARGATE \
  --capacity-provider-strategy \
    capacityProvider=FARGATE_SPOT,weight=1
```

### Reserved Capacity

For predictable workloads, consider Reserved Capacity (if using EC2 instead of Fargate).

---

## Troubleshooting Guide

### Common Issues

#### Issue 1: Tasks Failing to Start

```bash
# Check task logs
aws logs tail /ecs/portfolio-backend --follow

# Describe task
aws ecs describe-tasks \
  --cluster portfolio-cluster \
  --tasks TASK_ID

# Check task definition
aws ecs describe-task-definition \
  --task-definition portfolio-backend-prod
```

#### Issue 2: Health Check Failures

```bash
# Check target health
aws elbv2 describe-target-health \
  --target-group-arn $BACKEND_TG

# Test health endpoint manually
aws ecs execute-command \
  --cluster portfolio-cluster \
  --task TASK_ID \
  --container backend \
  --command "curl http://localhost:8080/api/actuator/health" \
  --interactive
```

---

## Appendix

### A. Useful Commands

```bash
# List all ECS services
aws ecs list-services --cluster portfolio-cluster

# Update service
aws ecs update-service \
  --cluster portfolio-cluster \
  --service portfolio-backend-prod \
  --force-new-deployment

# Scale service
aws ecs update-service \
  --cluster portfolio-cluster \
  --service portfolio-backend-prod \
  --desired-count 5
```

### B. Cost Estimation

| Service | Usage | Estimated Monthly Cost |
|---------|-------|----------------------|
| ECS Fargate | 2 tasks, 1 vCPU, 2GB RAM | $60-80 |
| ALB | 1 load balancer | $20-25 |
| ECR | 2 repositories, <10GB | $1-2 |
| Secrets Manager | 3 secrets | $1.50 |
| CloudWatch Logs | 10GB/month | $5 |
| **Total** | | **$87-113/month** |

### C. Useful Links

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [AWS Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/)

---

**Document End**

*Last Updated: 2025-11-19*  
*Next Review: 2025-12-19*

