// Performance Configuration for 100 Concurrent Group Calls
const performanceConfig = {
  // Database Connection Pool
  database: {
    pool: {
      min: 20,        // Minimum connections
      max: 100,       // Maximum connections for 100 concurrent calls
      acquire: 30000, // 30 seconds timeout
      idle: 10000     // 10 seconds idle timeout
    },
    // Query optimization
    queryTimeout: 5000, // 5 seconds max query time
    logging: false,     // Disable SQL logging in production
  },

  // WebSocket Configuration
  websocket: {
    maxConnections: 5000,  // 100 calls × 50 participants
    pingTimeout: 60000,    // 1 minute
    pingInterval: 25000,   // 25 seconds
    upgradeTimeout: 10000, // 10 seconds
    maxHttpBufferSize: 1e6, // 1MB
  },

  // Redis Configuration for Caching
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    db: 0,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    // Connection pool
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxMemoryPolicy: 'allkeys-lru'
  },

  // Rate Limiting
  rateLimiting: {
    // Per user rate limits
    user: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // 1000 requests per window
    },
    // Per IP rate limits
    ip: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5000, // 5000 requests per window
    },
    // Forum posting rate limits
    forum: {
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 posts per minute
    }
  },

  // Memory Management
  memory: {
    // Node.js heap size (should be at least 2GB for 100 concurrent calls)
    maxOldSpaceSize: 2048, // 2GB
    // Garbage collection
    gcInterval: 30000, // 30 seconds
  },

  // File Upload Limits
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'video/mp4', 'audio/mp3', 'application/pdf']
  },

  // Video Call Optimization
  videoCalls: {
    maxConcurrentCalls: 100,
    maxParticipantsPerCall: 50,
    // WebRTC configuration
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    // Bandwidth optimization
    videoBitrate: 1000000, // 1Mbps
    audioBitrate: 128000,  // 128kbps
  }
};

module.exports = performanceConfig;
