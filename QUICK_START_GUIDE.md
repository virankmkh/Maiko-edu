# 🚀 Quick Start Guide - Maiko EDU Networking Labs

## Prerequisites Check

Before we start, let's make sure you have everything needed:

### 1. PostgreSQL Setup
```bash
# Check if PostgreSQL is running
psql --version

# If not installed, download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey: choco install postgresql
```

### 2. Node.js Setup
```bash
# Check Node.js version (should be 18+)
node --version
npm --version
```

## Step 1: Database Setup (Windows)

### Option A: Using pgAdmin (Recommended)
1. **Download pgAdmin**: https://www.pgadmin.org/download/
2. **Install and open pgAdmin**
3. **Connect to PostgreSQL server** (default password usually empty or 'postgres')
4. **Create database**:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `maiko_edu`
   - Click "Save"
5. **Create user** (optional):
   - Right-click "Login/Group Roles" → "Create" → "Login/Group Role"
   - Name: `maiko_user`
   - Password: `password`
   - Go to "Privileges" tab, check "Can login"
   - Click "Save"

### Option B: Using Command Line
```cmd
# Open Command Prompt as Administrator
# Start PostgreSQL service
net start postgresql-x64-17

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE maiko_edu;

# Create user (optional)
CREATE USER maiko_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE maiko_edu TO maiko_user;

# Exit
\q
```

## Step 2: Environment Configuration

### Create .env file
Copy the content from `env-template.txt` to create `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/maiko_edu
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maiko_edu
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=maiko-edu-super-secret-jwt-key-2024-networking-labs-platform
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# EVE-NG Configuration (Update after EVE-NG setup)
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

# Monitoring Configuration
ENABLE_MONITORING=true
MONITORING_PORT=9090
LOG_LEVEL=info

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## Step 3: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Step 4: Database Setup

```bash
# Run database setup script
cd server
node scripts/setup-database.js
```

## Step 5: Build and Start Application

```bash
# Build client
cd client
npm run build

# Start server (in new terminal)
cd ../server
npm start

# Start client (in another terminal)
cd client
npm start
```

## Step 6: Test Application

1. **Open browser**: http://localhost:3000
2. **Register/Login**: Create an account
3. **Access course**: Go to "Introduction to Networking" course
4. **Test lab access**: Try to access lab content

## Step 7: EVE-NG Setup (Optional for Testing)

### Quick EVE-NG Setup
1. **Download EVE-NG**: https://www.eve-ng.net/index.php/download/
2. **Install in VM**: Use VMware or VirtualBox
3. **Configure network**: Set static IP
4. **Enable API**: In web interface, go to System → Settings → API
5. **Update .env**: Add EVE-NG credentials

### Without EVE-NG (Testing Mode)
The application will work without EVE-NG, but lab functionality will be limited. You can:
- View lab templates
- See lab instructions
- Test the interface
- But cannot start actual lab sessions

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
net start postgresql-x64-17

# Test connection
psql -U postgres -d maiko_edu

# If password issues, reset postgres password
psql -U postgres
ALTER USER postgres PASSWORD 'password';
```

### Port Already in Use
```bash
# Check what's using port 5001
netstat -ano | findstr :5001

# Kill process if needed
taskkill /PID <process_id> /F
```

### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

## Testing Checklist

- [ ] Database connection works
- [ ] Server starts without errors
- [ ] Client builds successfully
- [ ] Can access web interface
- [ ] Can register/login
- [ ] Can view courses
- [ ] Can access lab content (even without EVE-NG)
- [ ] Lab templates are created
- [ ] Course integration works

## Next Steps

1. **Set up EVE-NG** for full lab functionality
2. **Upload device images** (with proper licenses)
3. **Create custom lab templates**
4. **Test with students**
5. **Deploy to production**

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error logs
3. Ensure all prerequisites are met
4. Contact support if needed

---

**🎉 You're ready to start using the networking lab platform!**

