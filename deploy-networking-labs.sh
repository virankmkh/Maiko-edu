#!/bin/bash

# Networking Labs Deployment Script
# This script will deploy the complete networking lab platform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"
CLIENT_DIR="$PROJECT_DIR/client"
ENV_FILE="$PROJECT_DIR/.env"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL is not installed. Please install PostgreSQL 13+ first."
    fi
    
    print_success "System requirements check completed"
}

setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        print_status "Creating .env file from template..."
        cat > "$ENV_FILE" << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/maiko_edu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maiko_edu
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5001
NODE_ENV=production
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

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# SSL Configuration
SSL_CERT_PATH=
SSL_KEY_PATH=
FORCE_HTTPS=false
EOF
        print_success ".env file created"
    else
        print_warning ".env file already exists, skipping creation"
    fi
}

install_dependencies() {
    print_status "Installing server dependencies..."
    cd "$SERVER_DIR"
    npm install
    
    print_status "Installing client dependencies..."
    cd "$CLIENT_DIR"
    npm install
    
    print_success "Dependencies installed successfully"
}

setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if ! pg_isready -h localhost -p 5432 &> /dev/null; then
        print_error "PostgreSQL is not running. Please start PostgreSQL first."
        exit 1
    fi
    
    # Create database if it doesn't exist
    createdb maiko_edu 2>/dev/null || print_warning "Database 'maiko_edu' may already exist"
    
    # Run database migrations
    cd "$SERVER_DIR"
    if command -v npx &> /dev/null; then
        npx sequelize-cli db:migrate || print_warning "Database migration may have failed"
    else
        print_warning "npx not available, skipping database migration"
    fi
    
    print_success "Database setup completed"
}

build_client() {
    print_status "Building client application..."
    cd "$CLIENT_DIR"
    npm run build
    print_success "Client build completed"
}

setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Create monitoring directory
    mkdir -p "$SERVER_DIR/logs"
    mkdir -p "$SERVER_DIR/monitoring"
    
    # Create log rotation configuration
    cat > "$SERVER_DIR/logs/rotate.sh" << 'EOF'
#!/bin/bash
# Log rotation script for Maiko EDU
LOG_DIR="/path/to/server/logs"
MAX_SIZE="100M"
MAX_FILES=5

find "$LOG_DIR" -name "*.log" -size +$MAX_SIZE -exec mv {} {}.$(date +%Y%m%d) \;
find "$LOG_DIR" -name "*.log.*" -mtime +$MAX_FILES -delete
EOF
    
    chmod +x "$SERVER_DIR/logs/rotate.sh"
    
    print_success "Monitoring setup completed"
}

create_systemd_service() {
    print_status "Creating systemd service..."
    
    cat > /tmp/maiko-edu.service << EOF
[Unit]
Description=Maiko EDU Platform
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$PROJECT_DIR
Environment=NODE_ENV=production
ExecStart=/usr/bin/node $SERVER_DIR/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=maiko-edu

[Install]
WantedBy=multi-user.target
EOF
    
    if command -v systemctl &> /dev/null; then
        sudo mv /tmp/maiko-edu.service /etc/systemd/system/
        sudo systemctl daemon-reload
        sudo systemctl enable maiko-edu
        print_success "Systemd service created"
    else
        print_warning "systemctl not available, skipping systemd service creation"
    fi
}

setup_nginx() {
    print_status "Setting up Nginx configuration..."
    
    cat > /tmp/maiko-edu-nginx.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration (update paths)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Main application
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket for terminals
    location /ws/terminal {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /static/ {
        alias /path/to/client/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # EVE-NG proxy (if needed)
    location /eve-ng/ {
        proxy_pass http://your-eve-ng-server:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    
    if command -v nginx &> /dev/null; then
        print_status "Nginx configuration created at /tmp/maiko-edu-nginx.conf"
        print_warning "Please copy this configuration to your Nginx sites directory"
    else
        print_warning "Nginx not installed, skipping Nginx configuration"
    fi
}

run_setup_script() {
    print_status "Running networking labs setup script..."
    cd "$SERVER_DIR"
    node scripts/setup-networking-labs.js
    print_success "Networking labs setup completed"
}

create_backup_script() {
    print_status "Creating backup script..."
    
    cat > "$PROJECT_DIR/backup-labs.sh" << 'EOF'
#!/bin/bash
# Backup script for Maiko EDU Networking Labs

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/maiko-edu"
PROJECT_DIR="/path/to/maiko-edu"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
pg_dump maiko_edu > "$BACKUP_DIR/database-$DATE.sql"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads-$DATE.tar.gz" "$PROJECT_DIR/server/uploads"

# Backup configurations
tar -czf "$BACKUP_DIR/config-$DATE.tar.gz" "$PROJECT_DIR/.env" "$PROJECT_DIR/server/config"

# Cleanup old backups (keep 30 days)
find "$BACKUP_DIR" -name "*.sql" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x "$PROJECT_DIR/backup-labs.sh"
    print_success "Backup script created"
}

# Main deployment process
main() {
    print_status "Starting Maiko EDU Networking Labs deployment..."
    
    check_requirements
    setup_environment
    install_dependencies
    setup_database
    build_client
    setup_monitoring
    create_systemd_service
    setup_nginx
    run_setup_script
    create_backup_script
    
    print_success "Deployment completed successfully!"
    
    echo ""
    echo "Next steps:"
    echo "1. Update .env file with your specific configuration"
    echo "2. Configure EVE-NG server (see NETWORKING_LAB_SETUP.md)"
    echo "3. Obtain proper licenses for network device images"
    echo "4. Upload device images to EVE-NG server"
    echo "5. Test the platform with sample labs"
    echo "6. Configure SSL certificates for production"
    echo "7. Set up monitoring and alerting"
    echo ""
    echo "For detailed instructions, see:"
    echo "- NETWORKING_LAB_SETUP.md"
    echo "- LICENSING_GUIDE.md"
    echo "- NETWORKING_LAB_README.md"
}

# Run main function
main "$@"

