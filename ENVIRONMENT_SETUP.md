# Environment Configuration Guide

## Step 1: Create .env File

Create a `.env` file in your project root with the following configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/maiko_edu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maiko_edu
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# EVE-NG Configuration
EVE_NG_URL=http://localhost:8080
EVE_NG_USERNAME=admin
EVE_NG_PASSWORD=eve
EVE_NG_API_KEY=your-eve-ng-api-key-here

# Lab Configuration
LAB_SESSION_TIMEOUT=3600
MAX_CONCURRENT_LABS=50
LAB_CLEANUP_INTERVAL=300
LAB_MAX_DEVICES=20

# WebSocket Configuration
TERMINAL_WS_PORT=8081
TERMINAL_WS_PATH=/ws/terminal

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@maiko-edu.com

# File Upload Configuration
MAX_FILE_SIZE=50MB
UPLOAD_PATH=./uploads

# Monitoring Configuration
ENABLE_MONITORING=true
MONITORING_PORT=9090
LOG_LEVEL=info

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Redis Configuration (for session management)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# SSL Configuration (for production)
SSL_CERT_PATH=
SSL_KEY_PATH=
FORCE_HTTPS=false
```

## Step 2: Update Course Model for Lab Integration

We need to modify the Course model to include lab functionality options.

