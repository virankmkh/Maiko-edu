# Networking Lab Platform Integration

This document provides a comprehensive guide for the networking lab platform integration with EVE-NG, enabling hands-on networking practice within the Maiko EDU platform.

## 🚀 Features

### Core Functionality
- **Virtual Network Labs**: Create and manage virtual network topologies using EVE-NG
- **Real-time Terminal Access**: SSH/Telnet console access to network devices
- **Interactive Network Diagrams**: Visual network topology with clickable devices
- **Lab Session Management**: Start, stop, save, and resume lab sessions
- **Progress Tracking**: Monitor student progress and lab completion
- **Multi-user Support**: Concurrent lab sessions for multiple students

### Supported Network Devices
- **Cisco Routers**: IOS, IOS-XE, IOS-XR
- **Cisco Switches**: Catalyst, Nexus (NX-OS)
- **Juniper Devices**: Junos, Junos Evolved
- **Open Source**: FRRouting, VyOS, OpenWrt
- **Linux PCs**: Ubuntu, CentOS for end devices

## 🏗️ Architecture

### Backend Components
```
server/
├── models/
│   ├── LabSession.js          # Lab session management
│   └── LabTemplate.js         # Lab template definitions
├── routes/
│   └── labs.js                # Lab API endpoints
├── services/
│   ├── eveNgService.js        # EVE-NG API integration
│   └── terminalService.js     # WebSocket terminal service
└── scripts/
    └── create-sample-lab-templates.js
```

### Frontend Components
```
client/src/
├── pages/
│   ├── LabPage.js             # Main lab interface
│   └── LabManagement.js       # Lab template management
└── components/labs/
    ├── NetworkTopology.js     # Interactive network diagram
    ├── TerminalComponent.js   # xterm.js terminal interface
    └── LabInstructions.js     # Lab instructions and help
```

## 📋 Prerequisites

### System Requirements
- **EVE-NG Server**: Ubuntu 20.04+ with EVE-NG Community/Professional
- **Platform Server**: Node.js 18+, PostgreSQL 13+
- **Client**: Modern web browser with WebSocket support
- **Network**: Stable internet connection for real-time terminal access

### Required Licenses
⚠️ **Important**: You must have valid licenses for all network device images:
- Cisco Smart Net Total Care for Cisco images
- Juniper Care Plus for Juniper images
- Or use open-source alternatives (FRRouting, VyOS, OpenWrt)

## 🛠️ Installation

### Step 1: Install Dependencies

```bash
# Server dependencies
cd server
npm install axios ws node-ssh

# Client dependencies
cd ../client
npm install @xterm/xterm @xterm/addon-attach reactflow
```

### Step 2: Environment Configuration

Create `.env` file in the project root:

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

### Step 3: Database Setup

```bash
# Run database migrations
cd server
npx sequelize-cli db:migrate

# Or sync models (development only)
npm run db:sync
```

### Step 4: Create Sample Lab Templates

```bash
# Run the sample lab template creation script
node scripts/create-sample-lab-templates.js
```

## 🎯 Usage

### For Instructors

#### Creating Lab Templates
1. Navigate to `/labs/management`
2. Click "Create Lab Template"
3. Fill in lab details:
   - Name and description
   - Course assignment
   - Difficulty level
   - Learning objectives
   - Step-by-step instructions
4. Configure network topology
5. Save template

#### Managing Lab Sessions
- Monitor active lab sessions
- View student progress
- Troubleshoot connection issues
- Clean up completed sessions

### For Students

#### Starting a Lab
1. Navigate to a course with lab content
2. Click "Start Lab" button
3. Wait for lab initialization
4. Click on devices in the network diagram
5. Use the terminal to configure devices

#### Using the Terminal
- **Connect**: Click on a device to open its console
- **Commands**: Use standard networking commands
- **Navigation**: Switch between devices as needed
- **Save**: Use the Save button to preserve your work

## 🔧 Configuration

### EVE-NG Server Setup

1. **Install EVE-NG**
   ```bash
   # Download and install EVE-NG Community Edition
   wget https://www.eve-ng.net/releases/eve-ng-community-5.0.1-112.iso
   ```

2. **Configure Network**
   ```bash
   # Set up network bridges
   brctl addbr pnet0
   brctl addif pnet0 eth0
   ip link set pnet0 up
   ```

3. **Enable API**
   - Access EVE-NG web interface
   - Go to System > Settings > API
   - Enable REST API
   - Generate API key

### Platform Configuration

#### Lab Session Limits
```javascript
// Configure in server/index.js
const labConfig = {
  maxConcurrentSessions: 50,
  sessionTimeout: 3600, // 1 hour
  cleanupInterval: 300,  // 5 minutes
  maxDevicesPerLab: 20
};
```

#### Terminal Settings
```javascript
// Configure in client/src/components/labs/TerminalComponent.js
const terminalConfig = {
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  cursorBlink: true,
  scrollback: 1000
};
```

## 📊 API Endpoints

### Lab Management
- `GET /api/labs/templates/:courseId` - Get lab templates for a course
- `POST /api/labs/start` - Start a new lab session
- `POST /api/labs/:sessionId/stop` - Stop a lab session
- `POST /api/labs/:sessionId/save` - Save lab session state
- `GET /api/labs/:sessionId/status` - Get lab session status
- `GET /api/labs/my-sessions` - Get user's lab sessions

### WebSocket Endpoints
- `ws://your-server/ws/terminal` - Terminal connection WebSocket

## 🔍 Troubleshooting

### Common Issues

#### Lab Won't Start
```bash
# Check EVE-NG connectivity
curl -X GET "http://your-eve-ng-server:8080/api/labs" \
     -H "Authorization: Bearer your-api-key"

# Check server logs
tail -f server/logs/app.log
```

#### Terminal Connection Failed
```bash
# Check WebSocket server
netstat -tlnp | grep 8081

# Check firewall rules
ufw status
```

#### High Resource Usage
```bash
# Monitor system resources
htop
iotop

# Check EVE-NG resource usage
docker stats eve-ng
```

### Debug Mode

Enable debug logging:

```javascript
// In server/index.js
process.env.DEBUG = 'eve-ng,terminal,lab-session';
```

## 🚀 Deployment

### Production Deployment

1. **Server Setup**
   ```bash
   # Install PM2 for process management
   npm install -g pm2
   
   # Start application
   pm2 start server/index.js --name maiko-edu
   pm2 startup
   pm2 save
   ```

2. **Nginx Configuration**
   ```nginx
   # Add to your nginx config
   location /ws/terminal {
       proxy_pass http://localhost:5001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
   }
   ```

3. **SSL Configuration**
   ```bash
   # Install SSL certificate
   certbot --nginx -d your-domain.com
   ```

### Docker Deployment

```dockerfile
# Dockerfile for EVE-NG integration
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 5001 8081

CMD ["node", "server/index.js"]
```

## 📈 Performance Optimization

### Server Optimization
- Use Redis for session caching
- Implement connection pooling
- Optimize database queries
- Use CDN for static assets

### EVE-NG Optimization
- Increase file descriptors
- Optimize kernel parameters
- Use SSD storage
- Configure proper memory limits

## 🔒 Security Considerations

### Network Security
- Use VPN for remote access
- Implement proper firewall rules
- Enable fail2ban for SSH protection
- Regular security updates

### Application Security
- Use HTTPS everywhere
- Implement proper authentication
- Regular security audits
- Monitor for suspicious activity

## 📚 Learning Resources

### Lab Templates Included
1. **Basic Router Configuration** - Beginner
2. **VLAN Configuration Lab** - Intermediate  
3. **OSPF Routing Lab** - Advanced

### Additional Resources
- [EVE-NG Documentation](https://www.eve-ng.net/index.php/documentation/)
- [Cisco IOS Command Reference](https://www.cisco.com/c/en/us/support/index.html)
- [Juniper Junos Documentation](https://www.juniper.net/documentation/)

## 🤝 Contributing

### Adding New Lab Templates
1. Create template in `server/scripts/create-sample-lab-templates.js`
2. Define topology and device configurations
3. Write detailed instructions
4. Test with sample data
5. Submit pull request

### Reporting Issues
- Use GitHub Issues for bug reports
- Include logs and error messages
- Provide steps to reproduce
- Include system information

## 📄 License

This networking lab integration is part of the Maiko EDU platform and follows the same licensing terms.

## 🆘 Support

For technical support:
- Check the troubleshooting section
- Review server logs
- Contact system administrator
- Submit GitHub issue

---

**Note**: This integration requires proper licensing for network device images. Ensure compliance with vendor licensing agreements before using commercial device images in production.

