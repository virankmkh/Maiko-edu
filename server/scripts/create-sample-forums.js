const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Create PostgreSQL connection
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
  }
});
const Forum = require('../models/Forum')(sequelize);
const Course = require('../models/Course')(sequelize);
const User = require('../models/User')(sequelize);

const createSampleForums = async () => {
  try {
    console.log('🎯 Creating sample forums...');

    // Sync database to create tables
    await sequelize.sync();
    console.log('✅ Database tables synchronized');

    // Get the first course
    const course = await Course.findOne();
    if (!course) {
      console.log('❌ No courses found. Please create a course first.');
      return;
    }

    // Get the instructor
    const instructor = await User.findOne({ where: { role: 'instructor' } });
    if (!instructor) {
      console.log('❌ No instructor found. Please create an instructor first.');
      return;
    }

    // Sample forums
    const sampleForums = [
      {
        courseId: course.id,
        lessonId: null, // Course-level forum
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
        isLocked: true, // Only instructor can post
        creatorId: instructor.id,
        postCount: 0,
        participantCount: 0,
        lastActivityAt: new Date()
      }
    ];

    // Create forums
    for (const forumData of sampleForums) {
      const forum = await Forum.create(forumData);
      console.log(`✅ Created forum: ${forum.title}`);
    }

    console.log('🎉 Sample forums created successfully!');
    console.log(`📚 Course: ${course.title}`);
    console.log(`👨‍🏫 Instructor: ${instructor.firstName} ${instructor.lastName}`);
    console.log(`📊 Total forums: ${sampleForums.length}`);

  } catch (error) {
    console.error('❌ Error creating sample forums:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
createSampleForums();
