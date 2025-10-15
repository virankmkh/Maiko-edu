const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const terminalService = require('./services/terminalService');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import database after environment variables are loaded
const { testConnection } = require('./config/database');
console.log('🔧 Current directory:', __dirname);
console.log('🔧 .env file path:', path.join(__dirname, '..', '.env'));
console.log('🔧 File exists:', require('fs').existsSync(path.join(__dirname, '..', '.env')));
console.log('🔧 Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

// Import routes
console.log('🔧 Loading route files...');
try {
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded');
  
  const courseRoutes = require('./routes/courses');
  console.log('✅ Course routes loaded');
  
  const userRoutes = require('./routes/users');
  console.log('✅ User routes loaded');
  
  const organizationRoutes = require('./routes/organizations');
  console.log('✅ Organization routes loaded');
  
  const affiliateRoutes = require('./routes/affiliate');
  console.log('✅ Affiliate routes loaded');
  
  const certificateRoutes = require('./routes/certificates');
  console.log('✅ Certificate routes loaded');
  
  const ideRoutes = require('./routes/ide');
  console.log('✅ IDE routes loaded');
  
  const enrollmentRoutes = require('./routes/enrollments');
  console.log('✅ Enrollment routes loaded');
  
  const analyticsRoutes = require('./routes/analytics');
  console.log('✅ Analytics routes loaded');
  
  const lessonRoutes = require('./routes/lessons');
  console.log('✅ Lesson routes loaded');
  
  const labRoutes = require('./routes/labs');
  console.log('✅ Lab routes loaded');
  
  const uploadRoutes = require('./routes/upload');
  console.log('✅ Upload routes loaded');
  
  const paypalRoutes = require('./routes/paypal');
  console.log('✅ PayPal routes loaded');
  
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "http://localhost:5001", "https:"],
      connectSrc: ["'self'", "http://localhost:5001"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files with proper CORS headers for videos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// Video files with proper CORS and CORP headers
app.use('/videos', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Origin, X-Requested-With');
  next();
}, express.static(path.join(__dirname, 'public', 'videos')));

// Internationalization setup - temporarily disabled for debugging
// i18next
//   .use(i18nextMiddleware.LanguageDetector)
//   .init({
//     fallbackLng: 'en',
//     preload: ['en', 'fr'],
//     ns: ['common', 'auth', 'courses', 'dashboard'],
//     defaultNS: 'common',
//     backend: {
//       loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json')
//     }
//   });

// app.use(i18nextMiddleware.handle(i18next));

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Simple auth test route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth endpoint is working!', timestamp: new Date().toISOString() });
});

// Routes
console.log('🔧 Registering routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('✅ Auth routes registered');
app.use('/api/courses', require('./routes/courses'));
console.log('✅ Course routes registered');
app.use('/api/users', require('./routes/users'));
console.log('✅ User routes registered');
app.use('/api/organizations', require('./routes/organizations'));
console.log('✅ Organization routes registered');
app.use('/api/affiliate', require('./routes/affiliate'));
console.log('✅ Affiliate routes registered');
app.use('/api/certificates', require('./routes/certificates'));
console.log('✅ Certificate routes registered');
app.use('/api/ide', require('./routes/ide'));
console.log('✅ IDE routes registered');
app.use('/api/enrollments', require('./routes/enrollments'));
console.log('✅ Enrollment routes registered');

app.use('/api/paypal', require('./routes/paypal'));
console.log('✅ PayPal routes registered');

app.use('/api/analytics', require('./routes/analytics'));
console.log('✅ Analytics routes registered');

app.use('/api/lessons', require('./routes/lessons'));
console.log('✅ Lesson routes registered');

app.use('/api/lesson-activity', require('./routes/lessonActivity'));
app.use('/api', require('./routes/studentManagement'));
console.log('✅ Lesson activity routes registered');
app.use('/api/forums', require('./routes/forums'));
console.log('✅ Forum routes registered');
app.use('/api/labs', require('./routes/labs'));
console.log('✅ Lab routes registered');
app.use('/api/upload', require('./routes/upload'));
console.log('✅ Upload routes registered');
app.use('/api/jitsi', require('./routes/jitsi'));
console.log('✅ Jitsi routes registered');
app.use('/api/h5p', require('./routes/h5p'));
console.log('✅ H5P routes registered');
app.use('/api/student-activity', require('./routes/studentActivity'));
console.log('✅ Student Activity routes registered');
app.use('/api/simple-students', require('./routes/simple-students'));
console.log('✅ Simple Students routes registered');

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-course', (courseId) => {
    socket.join(`course-${courseId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// WebSocket server for terminal connections
const terminalWss = terminalService.createWebSocketServer(server);
console.log('✅ Terminal WebSocket server created');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Test database connection and start server
const startServer = async () => {
  let dbConnected = false;
  
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('✅ Database connection successful');
      dbConnected = true;
    } else {
      console.log('⚠️  Starting server without database connection...');
    }
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️  Starting server without database connection...');
  }

  const PORT = 5001;
  server.listen(PORT, () => {
    console.log(`🚀 Maiko EDU Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database: ${dbConnected ? 'Connected' : 'Not connected'}`);
    console.log('🔗 API Endpoints available:');
    console.log('   - POST /api/auth/register');
    console.log('   - POST /api/auth/login');
    console.log('   - GET /api/auth/me');
  });
};

startServer();

module.exports = { app, io };
