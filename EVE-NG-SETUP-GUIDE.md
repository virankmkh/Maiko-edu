# EVE-NG Server Setup Guide

## Option 1: EVE-NG Community Edition (Free)

### Step 1: Download EVE-NG
1. Go to [EVE-NG Downloads](https://www.eve-ng.net/index.php/download/)
2. Download "EVE-NG Community Edition" (latest version)
3. File size: ~2GB

### Step 2: Install EVE-NG

#### Option A: Virtual Machine (Recommended for Testing)
1. **VMware Workstation/Player**:
   - Create new VM
   - Memory: 8GB+ RAM
   - CPU: 4+ cores
   - Storage: 100GB+
   - Network: Bridge mode
   - Boot from EVE-NG ISO

2. **VirtualBox**:
   - Create new VM
   - Type: Linux
   - Version: Ubuntu (64-bit)
   - Memory: 8GB+ RAM
   - CPU: 4+ cores
   - Storage: 100GB+
   - Enable VT-x/AMD-V
   - Boot from EVE-NG ISO

#### Option B: Bare Metal Installation
1. Burn EVE-NG ISO to USB drive
2. Boot from USB
3. Follow installation wizard
4. Set root password: `eve`
5. Configure network settings

### Step 3: Initial Configuration

#### Access EVE-NG Web Interface
1. Open web browser
2. Go to: `https://your-eve-ng-ip`
3. Login credentials:
   - Username: `admin`
   - Password: `eve`

#### Change Default Passwords
```bash
# SSH to EVE-NG server
ssh root@your-eve-ng-ip

# Change root password
passwd root

# Change admin password
passwd admin
```

### Step 4: Configure Network

#### Set Static IP (Recommended)
```bash
# Edit network configuration
nano /etc/network/interfaces

# Add/update:
auto eth0
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4

# Restart networking
systemctl restart networking
```

#### Configure Firewall
```bash
# Allow necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 8080  # EVE-NG API
ufw enable
```

### Step 5: Enable API

1. **Access EVE-NG Web Interface**
2. **Go to**: System → Settings → API
3. **Enable**: REST API
4. **Generate**: API Key
5. **Copy**: API Key for .env file

### Step 6: Test API Connection

```bash
# Test from your development machine
curl -X GET "http://your-eve-ng-ip:8080/api/labs" \
     -H "Authorization: Bearer your-api-key"
```

## Option 2: EVE-NG Professional (Paid)

### Features
- More device support
- Better performance
- Commercial support
- Advanced features

### Pricing
- Contact EVE-NG for pricing
- Educational discounts available

## Option 3: Cloud Deployment

### AWS EC2
1. **Launch Instance**:
   - AMI: Ubuntu Server 20.04 LTS
   - Instance Type: c5.2xlarge or larger
   - Storage: 100GB+ GP3

2. **Install EVE-NG**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install EVE-NG
   wget https://www.eve-ng.net/releases/eve-ng-community-5.0.1-112.iso
   # Follow installation steps
   ```

3. **Configure Security Groups**:
   - SSH (22)
   - HTTP (80)
   - HTTPS (443)
   - Custom (8080) for API

### Google Cloud Platform
1. **Create VM Instance**:
   - Machine Type: n2-standard-8
   - Image: Ubuntu 20.04 LTS
   - Boot Disk: 100GB+ SSD

2. **Install EVE-NG**: Same as AWS

3. **Configure Firewall Rules**:
   - Allow EVE-NG ports

## Device Images Setup

### Open Source Images (Free)

#### FRRouting (FRR)
```bash
# Download FRR image
wget https://github.com/FRRouting/frr/releases/download/frr-8.5.1/frr-8.5.1.tar.gz

# Extract and configure
tar -xzf frr-8.5.1.tar.gz
cd frr-8.5.1

# Build for EVE-NG
./configure --enable-vtysh
make
make install
```

#### VyOS
```bash
# Download VyOS image
wget https://github.com/vyos/vyos-rolling/releases/download/current/vyos-1.4-rolling-202312010317-amd64.iso

# Upload to EVE-NG server
scp vyos-1.4-rolling-202312010317-amd64.iso root@your-eve-ng-ip:/opt/unetlab/addons/qemu/
```

#### OpenWrt
```bash
# Download OpenWrt image
wget https://downloads.openwrt.org/releases/23.05.0/targets/x86/64/openwrt-23.05.0-x86-64-generic-ext4-combined.img.gz

# Upload to EVE-NG server
scp openwrt-23.05.0-x86-64-generic-ext4-combined.img.gz root@your-eve-ng-ip:/opt/unetlab/addons/qemu/
```

### Commercial Images (Require Licenses)

#### Cisco Images
1. **Obtain License**: Cisco Smart Net Total Care
2. **Download Images**: From Cisco Software Center
3. **Upload to EVE-NG**:
   ```bash
   # Example: Cisco 7200 IOS
   scp c7200-adventerprisek9-mz.152-4.M12a.bin root@your-eve-ng-ip:/opt/unetlab/addons/iol/bin/
   
   # Set permissions
   ssh root@your-eve-ng-ip
   chmod +x /opt/unetlab/addons/iol/bin/c7200-adventerprisek9-mz.152-4.M12a.bin
   ```

#### Juniper Images
1. **Obtain License**: Juniper Care Plus
2. **Download Images**: From Juniper Support Portal
3. **Upload to EVE-NG**: Similar to Cisco

## Update .env File

After EVE-NG setup, update your .env file:

```env
# EVE-NG Configuration
EVE_NG_URL=http://your-eve-ng-ip:8080
EVE_NG_USERNAME=admin
EVE_NG_PASSWORD=your-eve-password
EVE_NG_API_KEY=your-generated-api-key
```

## Testing EVE-NG Integration

### Test API Connection
```bash
# From your development machine
curl -X GET "http://your-eve-ng-ip:8080/api/labs" \
     -H "Authorization: Bearer your-api-key"
```

### Test Lab Creation
```bash
# Create a test lab
curl -X POST "http://your-eve-ng-ip:8080/api/labs" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-api-key" \
     -d '{"name": "test-lab", "description": "Test lab"}'
```

## Troubleshooting

### Common Issues

1. **Cannot access web interface**
   - Check firewall settings
   - Verify IP address
   - Check if service is running

2. **API authentication failed**
   - Verify API key
   - Check username/password
   - Ensure API is enabled

3. **Device images not working**
   - Check file permissions
   - Verify image format
   - Check EVE-NG logs

### Logs
```bash
# EVE-NG logs
tail -f /opt/unetlab/logs/eve-ng.log

# System logs
journalctl -u eve-ng
```

## Next Steps

After EVE-NG setup:
1. Update .env file with EVE-NG credentials
2. Test API connection
3. Upload device images
4. Create lab templates
5. Test lab functionality

