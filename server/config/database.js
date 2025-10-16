const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import models
const User = require('../models/User');
const Organization = require('../models/Organization');
const Affiliate = require('../models/Affiliate');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const CourseEnrollment = require('../models/CourseEnrollment');
const Lesson = require('../models/Lesson');
const Forum = require('../models/Forum');
const ForumPost = require('../models/ForumPost');
const ForumReaction = require('../models/ForumReaction');
const GroupCall = require('../models/GroupCall');
const LiveLessonPayment = require('../models/LiveLessonPayment');
const LiveLessonParticipant = require('../models/LiveLessonParticipant');
const LabSession = require('../models/LabSession');
const LabTemplate = require('../models/LabTemplate');
const StudentActivity = require('../models/StudentActivity');
const CoursePayment = require('../models/CoursePayment');

// Create completely clean Sequelize instance for PostgreSQL
const databaseUrl = process.env.DATABASE_URL;

console.log('🔧 DATABASE_URL check:');
console.log('DATABASE_URL exists:', !!databaseUrl);
console.log('DATABASE_URL value:', databaseUrl ? `${databaseUrl.substring(0, 20)}...` : 'undefined');

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.log('Available environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
  
  // For development, use a fallback
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  Using fallback database configuration for development');
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false,
      define: {
        freezeTableName: true,
        underscored: false
      }
    });
    module.exports = { sequelize, models: {}, testConnection: () => Promise.resolve(false) };
    return;
  } else {
    throw new Error('DATABASE_URL is required for production deployment');
  }
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  define: {
    freezeTableName: true,
    underscored: false
  }
});

// Initialize models
const models = {
  User: User(sequelize),
  Organization: Organization(sequelize),
  Affiliate: Affiliate(sequelize),
  Course: Course(sequelize),
  Certificate: Certificate(sequelize),
  CourseEnrollment: CourseEnrollment(sequelize),
  Lesson: Lesson(sequelize),
  Forum: Forum(sequelize),
  ForumPost: ForumPost(sequelize),
  ForumReaction: ForumReaction(sequelize),
  GroupCall: GroupCall(sequelize),
  LiveLessonPayment: LiveLessonPayment(sequelize),
  LiveLessonParticipant: LiveLessonParticipant(sequelize),
  LabSession: LabSession(sequelize),
  LabTemplate: LabTemplate(sequelize),
  StudentActivity: StudentActivity(sequelize),
  CoursePayment: CoursePayment(sequelize)
};

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Set up StudentActivity associations
if (StudentActivity.associate) {
  StudentActivity.associate(models);
}

// Test database connection
const testConnection = async () => {
  try {
  await sequelize.authenticate();
  console.log('✅ Connected to PostgreSQL database');
    
    // Sync models with database - only create if not exists
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized');
    
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  models,
  testConnection
};
