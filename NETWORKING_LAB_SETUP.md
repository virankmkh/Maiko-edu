# Networking Lab Platform Setup Guide

This guide will help you set up a complete networking lab platform using EVE-NG integration with your Maiko EDU platform.

## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [EVE-NG Server Setup](#eve-ng-server-setup)
4. [Virtual Server Configuration](#virtual-server-configuration)
5. [Platform Integration](#platform-integration)
6. [Device Images and Licensing](#device-images-and-licensing)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)

## Overview

The networking lab platform provides hands-on networking practice through:
- Virtual network topologies using EVE-NG
- Real-time terminal access to network devices
- Interactive network diagrams
- Lab session management
- Progress tracking and assessment

## System Requirements

### Minimum Requirements for Small Lab (5-10 concurrent users)
- **CPU**: 8 cores (Intel Xeon or AMD EPYC)
- **RAM**: 32GB DDR4
- **Storage**: 500GB SSD (for OS and EVE-NG)
- **Network**: 1Gbps connection
- **OS**: Ubuntu 20.04 LTS or CentOS 8

### Recommended Requirements for Medium Lab (20-50 concurrent users)
- **CPU**: 16 cores (Intel Xeon or AMD EPYC)
- **RAM**: 64GB DDR4
- **Storage**: 1TB NVMe SSD
- **Network**: 10Gbps connection
- **OS**: Ubuntu 22.04 LTS

### Enterprise Requirements for Large Lab (50+ concurrent users)
- **CPU**: 32+ cores (Intel Xeon or AMD EPYC)
- **RAM**: 128GB+ DDR4
- **Storage**: 2TB+ NVMe SSD (RAID 1)
- **Network**: 25Gbps+ connection
- **OS**: Ubuntu 22.04 LTS with clustering support

## EVE-NG Server Setup

### Step 1: Download and Install EVE-NG

1. **Download EVE-NG Community Edition**
   ```bash
   # Download from official website
   wget https://www.eve-ng.net/releases/eve-ng-community-5.0.1-112.iso
   ```

2. **Create Virtual Machine or Bare Metal Installation**
   - **VMware ESXi**: Create VM with 8+ vCPUs, 32GB+ RAM
   - **Proxmox**: Create VM with similar specs
   - **Bare Metal**: Install directly on server hardware

3. **Installation Process**
   ```bash
   # Boot from ISO and follow installation wizard
   # Default credentials: root / eve
   # Change default password immediately
   passwd root
   ```

### Step 2: Initial Configuration

1. **Network Configuration**
   ```bash
   # Configure network interface
   nano /etc/network/interfaces
   
   # Example configuration:
   auto eth0
   iface eth0 inet static
       address 192.168.1.100
       netmask 255.255.255.0
       gateway 192.168.1.1
       dns-nameservers 8.8.8.8 8.8.4.4
   ```

2. **Update System**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Enable EVE-NG Web Interface**
   ```bash
   # Access via web browser
   # Default URL: https://your-server-ip
   # Default credentials: admin / eve
   ```

### Step 3: EVE-NG Configuration

1. **Configure EVE-NG Settings**
   ```bash
   # Access EVE-NG web interface
   # Go to System > Settings
   # Configure:
   # - Lab timeout settings
   # - Resource limits per user
   # - Network bridge configuration
   ```

2. **Set up Network Bridges**
   ```bash
   # Create management bridge
   brctl addbr pnet0
   brctl addif pnet0 eth0
   ip link set pnet0 up
   
   # Create lab bridges
   for i in {1..10}; do
       brctl addbr pnet$i
       ip link set pnet$i up
   done
   ```

## Virtual Server Configuration

### Option 1: Cloud Provider Setup (Recommended)

#### AWS EC2 Configuration
```yaml
# Instance Type: c5.2xlarge or larger
# AMI: Ubuntu Server 22.04 LTS
# Storage: 100GB+ GP3 SSD
# Security Groups:
#   - SSH (22)
#   - HTTP (80)
#   - HTTPS (443)
#   - EVE-NG Web (8080)
#   - Custom ports for lab devices (3000-4000)
```

#### Google Cloud Platform
```yaml
# Machine Type: n2-standard-8 or larger
# Image: Ubuntu 22.04 LTS
# Boot Disk: 100GB+ SSD
# Firewall Rules:
#   - Allow EVE-NG ports
#   - Allow lab device ports
```

#### Azure Virtual Machines
```yaml
# VM Size: Standard_D8s_v3 or larger
# Image: Ubuntu 22.04 LTS
# Disk: 100GB+ Premium SSD
# Network Security Groups:
#   - Configure inbound rules for lab ports
```

### Option 2: On-Premises Server

#### Hardware Requirements
- **Server**: Dell PowerEdge R740 or equivalent
- **CPU**: Intel Xeon Gold 6248R (24 cores)
- **RAM**: 64GB DDR4 ECC
- **Storage**: 2x 1TB NVMe SSD (RAID 1)
- **Network**: Dual 10Gbps NICs

#### Installation Steps
```bash
# 1. Install Ubuntu 22.04 LTS
# 2. Configure RAID
# 3. Install EVE-NG
# 4. Configure networking
# 5. Set up monitoring
```

## Platform Integration

### Step 1: Environment Configuration

Create `.env` file with EVE-NG settings:
```env
# EVE-NG Configuration
EVE_NG_URL=http://your-eve-ng-server:8080
EVE_NG_USERNAME=admin
EVE_NG_PASSWORD=your-eve-password
EVE_NG_API_KEY=your-api-key

# Lab Configuration
LAB_SESSION_TIMEOUT=3600
MAX_CONCURRENT_LABS=50
LAB_CLEANUP_INTERVAL=300

# WebSocket Configuration
TERMINAL_WS_PORT=8081
TERMINAL_WS_PATH=/ws/terminal
```

### Step 2: Database Migration

Run database migrations to create lab tables:
```bash
# Navigate to server directory
cd server

# Run migrations
npx sequelize-cli db:migrate

# Or sync models (development only)
npm run db:sync
```

### Step 3: Install Dependencies

```bash
# Server dependencies
cd server
npm install axios ws node-ssh

# Client dependencies
cd ../client
npm install @xterm/xterm @xterm/addon-attach reactflow
```

### Step 4: Configure EVE-NG API

1. **Enable EVE-NG API**
   ```bash
   # In EVE-NG web interface
   # Go to System > Settings > API
   # Enable REST API
   # Generate API key
   ```

2. **Test API Connection**
   ```bash
   # Test from your platform server
   curl -X GET "http://your-eve-ng-server:8080/api/labs" \
        -H "Authorization: Bearer your-api-key"
   ```

## Device Images and Licensing

### Legal Requirements

⚠️ **IMPORTANT**: You must have valid licenses for all network device images.

### Cisco Images
1. **Cisco Service Contract Required**
   - Purchase Cisco Smart Net Total Care
   - Download IOS/IOS-XE images from Cisco Software Center
   - Upload to EVE-NG server

2. **Supported Image Types**
   - IOS (15.x, 16.x)
   - IOS-XE (16.x, 17.x)
   - IOS-XR (6.x, 7.x)
   - NX-OS (7.x, 9.x)

### Juniper Images
1. **Juniper Support Contract Required**
   - Purchase Juniper Care Plus
   - Download Junos images from Juniper Support Portal
   - Upload to EVE-NG server

2. **Supported Image Types**
   - Junos (18.x, 19.x, 20.x, 21.x)
   - Junos Evolved (20.x, 21.x)

### Open Source Alternatives

For testing and development, you can use open-source alternatives:

1. **FRRouting (FRR)**
   ```bash
   # Download FRR images
   wget https://github.com/FRRouting/frr/releases/download/frr-8.5.1/frr-8.5.1.tar.gz
   ```

2. **VyOS**
   ```bash
   # Download VyOS images
   wget https://github.com/vyos/vyos-rolling/releases/download/current/vyos-1.4-rolling-202312010317-amd64.iso
   ```

3. **OpenWrt**
   ```bash
   # Download OpenWrt images
   wget https://downloads.openwrt.org/releases/23.05.0/targets/x86/64/openwrt-23.05.0-x86-64-generic-ext4-combined.img.gz
   ```

### Image Upload Process

1. **Access EVE-NG Web Interface**
2. **Go to Images > Import**
3. **Upload Device Images**
4. **Configure Image Settings**
5. **Test Image Functionality**

## Deployment Guide

### Step 1: Production Environment Setup

1. **Server Preparation**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install required packages
   sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx
   
   # Configure firewall
   sudo ufw allow 22,80,443,8080,8081/tcp
   sudo ufw enable
   ```

2. **Docker Setup for EVE-NG**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     eve-ng:
       image: eve-ng/eve-ng:latest
       container_name: eve-ng
       privileged: true
       ports:
         - "8080:8080"
       volumes:
         - /opt/unetlab:/opt/unetlab
         - /var/run/docker.sock:/var/run/docker.sock
       environment:
         - EVE_NG_PASSWORD=your-secure-password
       restart: unless-stopped
   ```

### Step 2: Platform Deployment

1. **Build and Deploy Application**
   ```bash
   # Build client
   cd client
   npm run build
   
   # Deploy server
   cd ../server
   npm install --production
   pm2 start index.js --name maiko-edu
   ```

2. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/maiko-edu
   server {
       listen 80;
       server_name your-domain.com;
       
       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
       
       # SSL Configuration
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       
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
       
       # EVE-NG proxy
       location /eve-ng/ {
           proxy_pass http://your-eve-ng-server:8080/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **SSL Certificate Setup**
   ```bash
   # Install SSL certificate
   sudo certbot --nginx -d your-domain.com
   
   # Test SSL configuration
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 3: Monitoring and Maintenance

1. **Set up Monitoring**
   ```bash
   # Install monitoring tools
   sudo apt install -y htop iotop nethogs
   
   # Configure log rotation
   sudo nano /etc/logrotate.d/maiko-edu
   ```

2. **Backup Configuration**
   ```bash
   # Create backup script
   #!/bin/bash
   # backup-labs.sh
   
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/backups/labs"
   
   # Create backup directory
   mkdir -p $BACKUP_DIR
   
   # Backup EVE-NG data
   tar -czf $BACKUP_DIR/eve-ng-$DATE.tar.gz /opt/unetlab
   
   # Backup database
   pg_dump maiko_edu > $BACKUP_DIR/database-$DATE.sql
   
   # Cleanup old backups (keep 30 days)
   find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
   find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
   ```

## Troubleshooting

### Common Issues

1. **EVE-NG Connection Failed**
   ```bash
   # Check EVE-NG status
   systemctl status eve-ng
   
   # Check network connectivity
   ping your-eve-ng-server
   telnet your-eve-ng-server 8080
   ```

2. **Terminal Connection Issues**
   ```bash
   # Check WebSocket server
   netstat -tlnp | grep 8081
   
   # Check firewall rules
   ufw status
   ```

3. **High Resource Usage**
   ```bash
   # Monitor system resources
   htop
   iotop
   
   # Check EVE-NG resource usage
   docker stats eve-ng
   ```

4. **Database Connection Issues**
   ```bash
   # Check database status
   systemctl status postgresql
   
   # Test database connection
   psql -h localhost -U postgres -d maiko_edu
   ```

### Performance Optimization

1. **EVE-NG Optimization**
   ```bash
   # Increase file descriptors
   echo "* soft nofile 65536" >> /etc/security/limits.conf
   echo "* hard nofile 65536" >> /etc/security/limits.conf
   
   # Optimize kernel parameters
   echo "vm.max_map_count=262144" >> /etc/sysctl.conf
   sysctl -p
   ```

2. **Database Optimization**
   ```sql
   -- Optimize PostgreSQL settings
   ALTER SYSTEM SET shared_buffers = '256MB';
   ALTER SYSTEM SET effective_cache_size = '1GB';
   ALTER SYSTEM SET maintenance_work_mem = '64MB';
   ALTER SYSTEM SET checkpoint_completion_target = 0.9;
   ALTER SYSTEM SET wal_buffers = '16MB';
   ALTER SYSTEM SET default_statistics_target = 100;
   ```

### Security Considerations

1. **Network Security**
   - Use VPN for remote access
   - Implement proper firewall rules
   - Enable fail2ban for SSH protection
   - Regular security updates

2. **Application Security**
   - Use HTTPS everywhere
   - Implement proper authentication
   - Regular security audits
   - Monitor for suspicious activity

3. **Data Protection**
   - Regular backups
   - Encrypt sensitive data
   - Implement access controls
   - Monitor data access

## Support and Maintenance

### Regular Maintenance Tasks

1. **Daily**
   - Monitor system resources
   - Check lab session status
   - Review error logs

2. **Weekly**
   - Update system packages
   - Clean up old lab sessions
   - Review security logs

3. **Monthly**
   - Full system backup
   - Performance analysis
   - Security audit

### Getting Help

- **Documentation**: Check this guide and inline code comments
- **Logs**: Review application and system logs
- **Community**: EVE-NG community forums
- **Support**: Contact your system administrator

## Conclusion

This networking lab platform provides a comprehensive solution for hands-on networking education. With proper setup and maintenance, it can support hundreds of concurrent users and provide an excellent learning experience.

Remember to:
- Always maintain valid licenses for device images
- Monitor system resources regularly
- Keep the system updated and secure
- Provide proper training for instructors and students

For additional support or questions, please refer to the troubleshooting section or contact your system administrator.

