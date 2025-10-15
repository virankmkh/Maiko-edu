# 🚀 Maiko EDU - Production Deployment Guide

## 🌐 **Domain Setup (Namecheap)**

### **Step 1: Configure DNS**
1. **Login to Namecheap**
   - Go to [namecheap.com](https://namecheap.com)
   - Login to your account
   - Go to "Domain List" → "Manage"

2. **Set DNS Records**
   ```
   Type: A Record
   Host: @
   Value: [Your hosting provider's IP]
   TTL: Automatic

   Type: CNAME
   Host: www
   Value: your-domain.com
   TTL: Automatic
   ```

### **Step 2: SSL Certificate**
- Most hosting providers offer **free SSL certificates**
- Enable HTTPS for security

---

## 🎯 **Deployment Options**

### **Option 1: Vercel (Recommended) ⭐**

**Why Vercel?**
- ✅ Free tier with generous limits
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL certificates
- ✅ Global CDN for fast loading
- ✅ Perfect for React apps

**Steps:**
1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import Project**
   - Click "New Project"
   - Import `Maiko-edu` repository
   - Vercel auto-detects React app

3. **Configure Build Settings**
   ```
   Framework Preset: Create React App
   Root Directory: client
   Build Command: npm run build
   Output Directory: build
   ```

4. **Environment Variables**
   - Add all variables from `env-production.txt`
   - Set `CLIENT_URL` to your domain

5. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

**Cost:** FREE for personal use

---

### **Option 2: Netlify**

**Steps:**
1. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Connect GitHub account

2. **Deploy Site**
   - Click "New site from Git"
   - Select `Maiko-edu` repository
   - Configure build settings:
     ```
     Build command: cd client && npm run build
     Publish directory: client/build
     ```

3. **Custom Domain**
   - Go to "Domain settings"
   - Add your custom domain
   - Configure DNS in Namecheap

**Cost:** FREE tier available

---

### **Option 3: DigitalOcean App Platform**

**Why DigitalOcean?**
- ✅ Handles both frontend and backend
- ✅ PostgreSQL database included
- ✅ More control over configuration
- ✅ Scales automatically

**Steps:**
1. **Create App**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"

2. **Connect GitHub**
   - Select `Maiko-edu` repository
   - Choose "Autodeploy"

3. **Configure Services**
   - **Frontend Service:**
     ```
     Source: client/
     Build Command: npm run build
     Run Command: npm start
     ```
   - **Backend Service:**
     ```
     Source: server/
     Build Command: npm install
     Run Command: npm start
     ```

4. **Add Database**
   - Add PostgreSQL database
   - Update `DATABASE_URL` in environment variables

**Cost:** ~$12-25/month

---

### **Option 4: Railway**

**Steps:**
1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Project**
   - Click "New Project"
   - Select `Maiko-edu` repository
   - Railway auto-detects the structure

3. **Configure Services**
   - Frontend: `client/`
   - Backend: `server/`
   - Database: Add PostgreSQL

4. **Environment Variables**
   - Add all variables from `env-production.txt`

**Cost:** ~$5-20/month

---

## 🔧 **Pre-Deployment Checklist**

### **Frontend Preparation**
- [x] Build configuration ready
- [x] Environment variables set
- [x] API endpoints configured
- [x] Static assets optimized

### **Backend Preparation**
- [x] Production environment config
- [x] Database connection ready
- [x] Security middleware enabled
- [x] Error handling implemented

### **Domain Configuration**
- [ ] DNS records set in Namecheap
- [ ] SSL certificate enabled
- [ ] Custom domain configured
- [ ] HTTPS redirect enabled

---

## 🚀 **Quick Start (Vercel)**

### **1. Prepare Repository**
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin master
```

### **2. Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import `Maiko-edu` repository
5. Configure:
   - **Framework:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### **3. Set Environment Variables**
Add these in Vercel dashboard:
```
NODE_ENV=production
CLIENT_URL=https://your-domain.com
DATABASE_URL=your-postgresql-url
JWT_SECRET=your-secret-key
```

### **4. Deploy Backend Separately**
For the backend, use:
- **Railway** (easiest)
- **Heroku** (popular)
- **DigitalOcean** (reliable)

### **5. Configure Domain**
1. In Vercel, go to "Domains"
2. Add your custom domain
3. Update DNS in Namecheap:
   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   ```

---

## 🔒 **Security Checklist**

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection enabled

---

## 📊 **Performance Optimization**

- [ ] Images optimized
- [ ] Code minified
- [ ] CDN enabled
- [ ] Caching configured
- [ ] Database indexed
- [ ] API responses optimized

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Build Fails**
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check for TypeScript errors

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is accessible

3. **Domain Not Working**
   - Check DNS propagation (24-48 hours)
   - Verify CNAME/A records
   - Check SSL certificate status

4. **API Errors**
   - Check CORS configuration
   - Verify environment variables
   - Check server logs

---

## 🎉 **Success!**

Once deployed, your Maiko EDU platform will be live at:
- **Frontend:** https://your-domain.com
- **Backend API:** https://your-backend-url.com/api
- **Admin Panel:** https://your-domain.com/admin

**Test your deployment:**
1. Visit your domain
2. Test user registration/login
3. Test course creation
4. Test video conferencing
5. Test payment integration

---

**Need Help?**
- Check the logs in your hosting provider
- Review the troubleshooting section
- Check GitHub issues
- Contact support

**Last Updated:** January 2025
