const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Simple Analytics Events Table without foreign key constraints
const AnalyticsEvent = sequelize.define('AnalyticsEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  eventCategory: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  eventAction: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  eventLabel: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  eventValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lessonId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referrer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  customData: {
    type: DataTypes.JSON,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'analytics_events',
  timestamps: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['eventType'] },
    { fields: ['eventCategory'] },
    { fields: ['courseId'] },
    { fields: ['lessonId'] },
    { fields: ['timestamp'] },
    { fields: ['userId', 'eventType'] },
    { fields: ['courseId', 'eventType'] }
  ]
});

// Simple User Sessions Table
const UserSession = sequelize.define('UserSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true
  },
  pageViews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  actions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'user_sessions',
  timestamps: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['sessionId'] },
    { fields: ['startTime'] },
    { fields: ['isActive'] }
  ]
});

// Simple Course Analytics Table
const CourseAnalytics = sequelize.define('CourseAnalytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalEnrollments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalCompletions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageCompletionTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'course_analytics',
  timestamps: false,
  indexes: [
    { fields: ['courseId'] },
    { fields: ['totalEnrollments'] },
    { fields: ['totalCompletions'] },
    { fields: ['totalRevenue'] }
  ]
});

// Simple Lesson Analytics Table
const LessonAnalytics = sequelize.define('LessonAnalytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lessonId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalViews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalCompletions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageWatchTime: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true
  },
  totalWatchTime: {
    type: DataTypes.INTEGER, // in seconds
    defaultValue: 0
  },
  completionRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'lesson_analytics',
  timestamps: false,
  indexes: [
    { fields: ['lessonId'] },
    { fields: ['courseId'] },
    { fields: ['totalViews'] },
    { fields: ['completionRate'] }
  ]
});

module.exports = {
  AnalyticsEvent,
  UserSession,
  CourseAnalytics,
  LessonAnalytics
};
