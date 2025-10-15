# Complete Networking Labs Setup Guide

## 🎯 Overview

This guide will walk you through setting up the complete networking lab platform with EVE-NG integration, ensuring labs are only accessible through instructor-selected courses.

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ or Windows 10+ with WSL2
- **RAM**: 16GB+ (32GB+ recommended for production)
- **CPU**: 8+ cores (16+ cores recommended)
- **Storage**: 100GB+ free space
- **Network**: Stable internet connection

### Software Requirements
- Node.js 18+
- PostgreSQL 13+
- Git
- Docker (optional, for EVE-NG)

## 🚀 Step 1: Install Dependencies

### 1.1 Install Node.js and npm
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows (using Chocolatey)
choco install nodejs

# Verify installation
node --version
npm --version
```

### 1.2 Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE maiko_edu;
CREATE USER maiko_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE maiko_edu TO maiko_user;
\q
```

### 1.3 Install Project Dependencies
```bash
# Navigate to project directory
cd /path/to/maiko-elearning

# Install server dependencies
cd server
npm install axios ws node-ssh

# Install client dependencies
cd ../client
npm install @xterm/xterm @xterm/addon-attach @xterm/addon-fit @xterm/addon-web-links reactflow
```

## 🔧 Step 2: Environment Configuration

### 2.1 Create Environment File
```bash
# Create .env file in project root
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://maiko_user:your_password@localhost:5432/maiko_edu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maiko_edu
DB_USER=maiko_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
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

# Email Configuration
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

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# SSL Configuration (for production)
SSL_CERT_PATH=
SSL_KEY_PATH=
FORCE_HTTPS=false
EOF
```

### 2.2 Update Database Configuration
```bash
# Update server/config/database.js with new models
# The file should already include LabSession and LabTemplate models
```

## 🗄️ Step 3: Database Setup

### 3.1 Run Database Migrations
```bash
cd server

# Create tables
npx sequelize-cli db:migrate

# Or sync models (development only)
npm run db:sync
```

### 3.2 Create Sample Data
```bash
# Run the setup script
node scripts/setup-networking-labs.js
```

## 🖥️ Step 4: EVE-NG Server Setup

### 4.1 Install EVE-NG (Ubuntu)
```bash
# Download EVE-NG Community Edition
wget https://www.eve-ng.net/releases/eve-ng-community-5.0.1-112.iso

# Create VM or install on bare metal
# Follow EVE-NG installation wizard
# Default credentials: root / eve
```

### 4.2 Configure EVE-NG
```bash
# Access EVE-NG web interface
# URL: https://your-eve-ng-server-ip
# Default credentials: admin / eve

# Enable API
# Go to System > Settings > API
# Enable REST API
# Generate API key
```

### 4.3 Upload Device Images (After Obtaining Licenses)
```bash
# For Cisco images (requires license)
scp c7200-adventerprisek9-mz.152-4.M12a.bin root@eve-ng-server:/opt/unetlab/addons/iol/bin/
chmod +x /opt/unetlab/addons/iol/bin/c7200-adventerprisek9-mz.152-4.M12a.bin

# For open source images (no license required)
# Download FRR, VyOS, or OpenWrt images
# Upload to EVE-NG server
```

## 🔐 Step 5: Licensing Setup

### 5.1 Choose Licensing Strategy

#### Option A: Open Source Only (Free)
- Use FRR, VyOS, OpenWrt images
- No licensing costs
- Limited to open source features

#### Option B: Commercial Licenses (Recommended)
- Purchase Cisco Smart Net Total Care
- Purchase Juniper Care Plus
- Full feature access
- Professional support

#### Option C: Hybrid Approach
- Use open source for basic labs
- Use commercial for advanced labs
- Balance cost and features

### 5.2 Obtain Licenses
```bash
# Contact vendors for quotes
# Cisco: 1-800-553-6387
# Juniper: 1-888-JUNIPER

# Educational discounts available
# See LICENSING_GUIDE.md for details
```

## 🚀 Step 6: Deploy Platform

### 6.1 Build and Start Application
```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start index.js --name maiko-edu
pm2 startup
pm2 save
```

### 6.2 Configure Reverse Proxy (Nginx)
```bash
# Install Nginx
sudo apt install nginx

# Create configuration
sudo nano /etc/nginx/sites-available/maiko-edu

# Add configuration (see deploy-networking-labs.sh for full config)
# Enable site
sudo ln -s /etc/nginx/sites-available/maiko-edu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 Set up SSL (Production)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Test renewal
sudo certbot renew --dry-run
```

## 📊 Step 7: Monitoring Setup

### 7.1 Enable Monitoring
```bash
# Monitoring is enabled by default in the application
# Access metrics at: http://localhost:9090/metrics

# Set up log rotation
sudo nano /etc/logrotate.d/maiko-edu
```

### 7.2 Configure Alerts
```bash
# Set up monitoring alerts for:
# - High CPU usage (>80%)
# - High memory usage (>90%)
# - EVE-NG connectivity issues
# - Lab session limits
```

## 🎓 Step 8: Course Integration

### 8.1 Enable Lab Content for Courses
```bash
# Update courses to include lab content
# This is done automatically by the setup script
# Or manually update courses in the database:

UPDATE courses SET 
  hasLabContent = true,
  labAccessLevel = 'basic',
  labInstructions = 'This course includes hands-on networking labs.',
  labPrerequisites = '["Basic networking knowledge", "Command line familiarity"]'
WHERE category = 'technology' AND subcategory = 'networking';
```

### 8.2 Create Lab Templates
```bash
# Lab templates are created automatically
# Or create custom templates via the web interface:
# Navigate to /labs/management
# Click "Create Lab Template"
# Configure topology and instructions
```

## 🧪 Step 9: Testing

### 9.1 Test Basic Functionality
```bash
# Test database connection
curl http://localhost:5001/api/test

# Test EVE-NG connectivity
curl http://localhost:5001/api/labs/health

# Test lab template creation
curl -X POST http://localhost:5001/api/labs/templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"name": "Test Lab", "courseId": 1}'
```

### 9.2 Test Lab Session
```bash
# Start a lab session
curl -X POST http://localhost:5001/api/labs/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"templateId": 1, "courseId": 1}'

# Check lab status
curl http://localhost:5001/api/labs/1/status \
  -H "Authorization: Bearer your-jwt-token"
```

### 9.3 Test WebSocket Connection
```bash
# Test terminal WebSocket
wscat -c ws://localhost:5001/ws/terminal
```

## 🔒 Step 10: Security Configuration

### 10.1 Configure Firewall
```bash
# Allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 5001  # Application
sudo ufw allow 8080  # EVE-NG
sudo ufw allow 8081  # Terminal WebSocket
sudo ufw enable
```

### 10.2 Set up Authentication
```bash
# Ensure JWT_SECRET is strong and unique
# Use environment variables for sensitive data
# Enable rate limiting
# Set up proper CORS policies
```

## 📈 Step 11: Performance Optimization

### 11.1 Database Optimization
```sql
-- Optimize PostgreSQL settings
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
```

### 11.2 Application Optimization
```bash
# Use PM2 for process management
pm2 start index.js --name maiko-edu --instances max

# Enable clustering
pm2 start ecosystem.config.js
```

## 🎯 Step 12: Course Access Control

### 12.1 Verify Lab Access Control
```bash
# Ensure labs are only accessible through enrolled courses
# Check that:
# 1. Users must be enrolled in course to access labs
# 2. Lab templates are linked to specific courses
# 3. Access is controlled by course enrollment status
# 4. Instructors can manage lab content for their courses
```

### 12.2 Test Access Control
```bash
# Test with different user roles:
# 1. Unenrolled user - should not access labs
# 2. Enrolled student - should access labs
# 3. Instructor - should manage lab templates
# 4. Admin - should access all features
```

## 🚨 Troubleshooting

### Common Issues

#### EVE-NG Connection Failed
```bash
# Check EVE-NG status
curl http://your-eve-ng-server:8080/api/health

# Check network connectivity
ping your-eve-ng-server
telnet your-eve-ng-server 8080

# Check EVE-NG logs
tail -f /opt/unetlab/logs/eve-ng.log
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U maiko_user -d maiko_edu

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

#### WebSocket Connection Issues
```bash
# Check WebSocket server
netstat -tlnp | grep 8081

# Test WebSocket connection
wscat -c ws://localhost:5001/ws/terminal

# Check firewall rules
sudo ufw status
```

## 📚 Next Steps

### After Setup
1. **Create Lab Content**: Design lab exercises for your courses
2. **Train Instructors**: Teach instructors how to use the lab system
3. **Test with Students**: Run pilot tests with small groups
4. **Monitor Performance**: Watch system resources and user feedback
5. **Iterate and Improve**: Based on usage, improve the system

### Maintenance
1. **Regular Backups**: Set up automated database backups
2. **Security Updates**: Keep all software updated
3. **License Renewals**: Track and renew device licenses
4. **Performance Monitoring**: Monitor system performance
5. **User Support**: Provide support for instructors and students

## 📞 Support

### Documentation
- `NETWORKING_LAB_SETUP.md` - Detailed EVE-NG setup
- `LICENSING_GUIDE.md` - Complete licensing information
- `NETWORKING_LAB_README.md` - Platform documentation

### Getting Help
1. Check the troubleshooting section
2. Review application logs
3. Contact system administrator
4. Submit GitHub issues

---

**🎉 Congratulations! Your networking lab platform is now ready for use!**

Remember to:
- Obtain proper licenses for commercial device images
- Test thoroughly before going live
- Monitor system performance
- Keep security updated
- Train your team on the new system

