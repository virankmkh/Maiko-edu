const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Create PostgreSQL connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: false
  }
});

// Import all models
const User = require('../models/User')(sequelize);
const Organization = require('../models/Organization')(sequelize);
const Affiliate = require('../models/Affiliate')(sequelize);
const Course = require('../models/Course')(sequelize);
const Certificate = require('../models/Certificate')(sequelize);
const CourseEnrollment = require('../models/CourseEnrollment')(sequelize);
const Lesson = require('../models/Lesson')(sequelize);
const Forum = require('../models/Forum')(sequelize);
const ForumPost = require('../models/ForumPost')(sequelize);
const ForumReaction = require('../models/ForumReaction')(sequelize);
const GroupCall = require('../models/GroupCall')(sequelize);
const LiveLessonPayment = require('../models/LiveLessonPayment')(sequelize);
const LiveLessonParticipant = require('../models/LiveLessonParticipant')(sequelize);
const LabSession = require('../models/LabSession')(sequelize);
const LabTemplate = require('../models/LabTemplate')(sequelize);

// Initialize models object
const models = {
  User,
  Organization,
  Affiliate,
  Course,
  Certificate,
  CourseEnrollment,
  Lesson,
  Forum,
  ForumPost,
  ForumReaction,
  GroupCall,
  LiveLessonPayment,
  LiveLessonParticipant,
  LabSession,
  LabTemplate
};

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up complete database...\n');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database');
    
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('✅ All database tables created successfully');
    
    // Create sample data
    console.log('📊 Creating sample data...');
    
    // Create organization
    const organization = await Organization.create({
      name: 'Maiko EDU',
      description: 'Leading online education platform for Congolese community',
      website: 'https://maiko-edu.com',
      email: 'contact@maiko-edu.com',
      isActive: true
    });
    console.log('✅ Organization created');
    
    // Create instructor
    const instructor = await User.create({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@maiko-edu.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J.8.8.8.8', // password: 'password'
      role: 'instructor',
      isActive: true,
      emailVerified: true,
      organizationId: organization.id
    });
    console.log('✅ Instructor created');
    
    // Create course
    const course = await Course.create({
      title: 'React Fundamentals',
      subtitle: 'Learn React from scratch with hands-on projects',
      description: 'A comprehensive course covering React fundamentals including components, state management, hooks, and modern development practices.',
      organizationId: organization.id,
      instructorId: instructor.id,
      category: 'technology',
      subcategory: 'web-development',
      price: 5.00,
      currency: 'USD',
      isFree: false,
      difficulty: 'beginner',
      level: 'basic',
      slug: 'react-fundamentals',
      hasLabContent: true,
      labAccessLevel: 'basic',
      status: 'published',
      isPublished: true,
      publishedAt: new Date(),
      averageRating: 4.5,
      totalStudents: 35,
      currentStudents: 28,
      completedStudents: 7
    });
    console.log('✅ Course created');
    
    // Create lessons
    const lessons = await Lesson.bulkCreate([
      {
        courseId: course.id,
        title: 'Introduction to React',
        content: 'Learn the basics of React and its core concepts.',
        order: 1,
        duration: 30,
        isPublished: true
      },
      {
        courseId: course.id,
        title: 'Components and JSX',
        content: 'Understanding React components and JSX syntax.',
        order: 2,
        duration: 45,
        isPublished: true
      },
      {
        courseId: course.id,
        title: 'State and Props',
        content: 'Managing component state and passing props.',
        order: 3,
        duration: 60,
        isPublished: true
      }
    ]);
    console.log('✅ Lessons created');
    
    // Create forums
    const forums = await Forum.bulkCreate([
      {
        courseId: course.id,
        lessonId: null,
        title: 'General Discussion',
        description: 'General questions and discussions about the course content',
        isPinned: true,
        isLocked: false,
        creatorId: instructor.id,
        postCount: 0,
        participantCount: 0,
        lastActivityAt: new Date()
      },
      {
        courseId: course.id,
        lessonId: null,
        title: 'Q&A Forum',
        description: 'Ask questions about the course material and get help from peers and instructors',
        isPinned: false,
        isLocked: false,
        creatorId: instructor.id,
        postCount: 0,
        participantCount: 0,
        lastActivityAt: new Date()
      },
      {
        courseId: course.id,
        lessonId: null,
        title: 'Project Showcase',
        description: 'Share your projects and get feedback from the community',
        isPinned: false,
        isLocked: false,
        creatorId: instructor.id,
        postCount: 0,
        participantCount: 0,
        lastActivityAt: new Date()
      },
      {
        courseId: course.id,
        lessonId: null,
        title: 'Study Groups',
        description: 'Find study partners and organize group study sessions',
        isPinned: false,
        isLocked: false,
        creatorId: instructor.id,
        postCount: 0,
        participantCount: 0,
        lastActivityAt: new Date()
      },
      {
        courseId: course.id,
        lessonId: null,
        title: 'Announcements',
        description: 'Important announcements and updates from the instructor',
        isPinned: true,
        isLocked: true,
        creatorId: instructor.id,
        postCount: 0,
        participantCount: 0,
        lastActivityAt: new Date()
      }
    ]);
    console.log('✅ Forums created');
    
    // Create sample posts
    const posts = await ForumPost.bulkCreate([
      {
        forumId: forums[0].id,
        authorId: instructor.id,
        parentPostId: null,
        title: 'Welcome to the Course!',
        content: 'Welcome everyone to this amazing React course! Feel free to introduce yourself and share your learning goals. I\'m excited to help you learn React from the ground up.',
        postType: 'announcement',
        isPinned: true,
        likeCount: 5,
        replyCount: 3,
        viewCount: 25
      },
      {
        forumId: forums[0].id,
        authorId: instructor.id,
        parentPostId: null,
        title: 'Course Materials Available',
        content: 'All course materials including slides, code examples, and project files are now available in the course content section. Make sure to download the latest version.',
        postType: 'text',
        isPinned: false,
        likeCount: 2,
        replyCount: 1,
        viewCount: 15
      },
      {
        forumId: forums[1].id,
        authorId: instructor.id,
        parentPostId: null,
        title: 'How to submit assignments?',
        content: 'I\'m having trouble finding where to submit my assignment. Can someone help me navigate to the submission area?',
        postType: 'question',
        isPinned: false,
        likeCount: 1,
        replyCount: 2,
        viewCount: 8
      }
    ]);
    console.log('✅ Forum posts created');
    
    // Create sample students
    const students = await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J.8.8.8.8',
        role: 'student',
        isActive: true,
        emailVerified: true,
        organizationId: organization.id
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J.8.8.8.8',
        role: 'student',
        isActive: true,
        emailVerified: true,
        organizationId: organization.id
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J.8.8.8.8',
        role: 'student',
        isActive: true,
        emailVerified: true,
        organizationId: organization.id
      },
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J.8.8.8.8',
        role: 'student',
        isActive: true,
        emailVerified: true,
        organizationId: organization.id
      }
    ]);
    console.log('✅ Students created');
    
    // Create course enrollments
    const enrollments = await CourseEnrollment.bulkCreate([
      {
        courseId: course.id,
        userId: students[0].id,
        enrolledAt: new Date(),
        progress: 25,
        isActive: true
      },
      {
        courseId: course.id,
        userId: students[1].id,
        enrolledAt: new Date(),
        progress: 50,
        isActive: true
      },
      {
        courseId: course.id,
        userId: students[2].id,
        enrolledAt: new Date(),
        progress: 100,
        isActive: true
      },
      {
        courseId: course.id,
        userId: students[3].id,
        enrolledAt: new Date(),
        progress: 75,
        isActive: true
      }
    ]);
    console.log('✅ Course enrollments created');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Organization: ${organization.name}`);
    console.log(`- Instructor: ${instructor.firstName} ${instructor.lastName}`);
    console.log(`- Course: ${course.title} ($${course.price})`);
    console.log(`- Lessons: ${lessons.length}`);
    console.log(`- Forums: ${forums.length}`);
    console.log(`- Posts: ${posts.length}`);
    console.log(`- Students: ${students.length}`);
    console.log(`- Enrollments: ${enrollments.length}`);
    
    console.log('\n🔗 Test Accounts:');
    console.log('Instructor: sarah.johnson@maiko-edu.com / password');
    console.log('Student: john.doe@example.com / password');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the setup
setupDatabase();
