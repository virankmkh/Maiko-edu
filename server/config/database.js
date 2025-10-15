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
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: false
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
