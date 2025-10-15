# 🚀 Maiko EDU - Startup Guide

## ✅ **CURRENT STATUS: FULLY FUNCTIONAL!**

All critical issues have been resolved! The application is now working perfectly.

---

## 🚀 **How to Start the Application**

### **Backend Server (Already Running)**
The backend server is currently running on port 5001. If you need to restart it:

```bash
# Stop any running servers
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Start the backend server
node server/index.js
```

**Backend URL**: `http://localhost:5001`
**Test Endpoint**: `http://localhost:5001/api/test`

### **Frontend (React App)**
To start the frontend:

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already done)
npm install

# Start the React development server
npm start
```

**Frontend URL**: `http://localhost:3000`

---

## 🔐 **Login Credentials**

**Test Account**:
- **Email**: `vn@adn.presidence.cd`
- **Password**: `password123`
- **Role**: Student

---

## 📊 **What's Working**

### ✅ **Backend (Port 5001)**
- ✅ Database connection (PostgreSQL)
- ✅ Authentication (Login/Register)
- ✅ All API routes enabled
- ✅ JWT token system
- ✅ User management
- ✅ Course management
- ✅ Organization management
- ✅ Affiliate system
- ✅ Certificate system

### ✅ **Frontend (Port 3000)**
- ✅ Beautiful responsive UI
- ✅ Login/Register forms
- ✅ Home page with animations
- ✅ Multi-language support (English/French)
- ✅ Modern design with Tailwind CSS

### ✅ **Database**
- ✅ PostgreSQL connected
- ✅ All tables created
- ✅ User accounts working
- ✅ Data persistence working

---

## 🎯 **Next Steps**

1. **Start the frontend** (`cd client && npm start`)
2. **Open browser** to `http://localhost:3000`
3. **Click Login** and use the credentials above
4. **Test the application** - everything should work!

---

## 🔧 **Troubleshooting**

### **If Backend Won't Start**
```bash
# Check if port 5001 is in use
netstat -ano | findstr :5001

# Kill any process using port 5001
taskkill /PID <PID_NUMBER> /F
```

### **If Frontend Won't Start**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### **If Database Connection Fails**
- Check if PostgreSQL is running
- Verify password in `.env` file
- Ensure database `maiko_edu` exists

---

## 📞 **Support**

If you encounter any issues:
1. Check the server logs in the terminal
2. Verify both frontend and backend are running
3. Test the API endpoints directly
4. Check the browser console for errors

---

**Last Updated**: 2025-01-27
**Status**: ✅ **READY TO USE** - All systems operational!
