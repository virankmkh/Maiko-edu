const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const performanceConfig = require('../config/performance');

// Redis client for caching and rate limiting
const redis = new Redis(performanceConfig.redis);

// Rate limiting middleware
const createRateLimit = (config) => {
  return rateLimit({
    ...config,
    store: new RedisStore({
      client: redis,
      prefix: 'rl:',
    }),
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// User rate limiting
const userRateLimit = createRateLimit(performanceConfig.rateLimiting.user);

// IP rate limiting
const ipRateLimit = createRateLimit(performanceConfig.rateLimiting.ip);

// Forum posting rate limiting
const forumRateLimit = createRateLimit(performanceConfig.rateLimiting.forum);

// Memory monitoring middleware
const memoryMonitor = (req, res, next) => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  // Log memory usage if it's getting high
  if (memUsageMB.heapUsed > 1500) { // 1.5GB threshold
    console.warn('High memory usage:', memUsageMB);
  }

  // Add memory info to response headers for monitoring
  res.set('X-Memory-Usage', JSON.stringify(memUsageMB));
  next();
};

// Database query optimization middleware
const queryOptimizer = (req, res, next) => {
  // Add query timeout
  req.queryTimeout = performanceConfig.database.queryTimeout;
  next();
};

// WebSocket connection monitoring
const wsConnectionMonitor = (io) => {
  let connectionCount = 0;
  let maxConnections = 0;

  io.on('connection', (socket) => {
    connectionCount++;
    maxConnections = Math.max(maxConnections, connectionCount);

    socket.on('disconnect', () => {
      connectionCount--;
    });

    // Log connection stats every 5 minutes
    setInterval(() => {
      console.log(`WebSocket Stats - Current: ${connectionCount}, Max: ${maxConnections}`);
    }, 5 * 60 * 1000);
  });
};

// Cache middleware for frequently accessed data
const cacheMiddleware = (ttl = 300) => { // 5 minutes default TTL
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original res.json
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        redis.setex(key, ttl, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Database connection pool monitoring
const dbPoolMonitor = (sequelize) => {
  setInterval(() => {
    const pool = sequelize.connectionManager.pool;
    console.log(`DB Pool Stats - Active: ${pool.size}, Idle: ${pool.available}, Waiting: ${pool.pending}`);
  }, 30000); // Every 30 seconds
};

// Performance metrics collection
const performanceMetrics = {
  requests: 0,
  errors: 0,
  avgResponseTime: 0,
  startTime: Date.now()
};

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  performanceMetrics.requests++;

  res.on('finish', () => {
    const duration = Date.now() - start;
    performanceMetrics.avgResponseTime = 
      (performanceMetrics.avgResponseTime + duration) / 2;

    if (res.statusCode >= 400) {
      performanceMetrics.errors++;
    }
  });

  next();
};

// Get performance metrics
const getMetrics = () => {
  const uptime = Date.now() - performanceMetrics.startTime;
  return {
    ...performanceMetrics,
    uptime: Math.round(uptime / 1000), // seconds
    errorRate: performanceMetrics.errors / performanceMetrics.requests,
    requestsPerSecond: performanceMetrics.requests / (uptime / 1000)
  };
};

module.exports = {
  userRateLimit,
  ipRateLimit,
  forumRateLimit,
  memoryMonitor,
  queryOptimizer,
  wsConnectionMonitor,
  cacheMiddleware,
  dbPoolMonitor,
  metricsMiddleware,
  getMetrics,
  redis
};







