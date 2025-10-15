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

// Import models
const Forum = require('../models/Forum')(sequelize);
const ForumPost = require('../models/ForumPost')(sequelize);
const Course = require('../models/Course')(sequelize);
const User = require('../models/User')(sequelize);

const addSampleForums = async () => {
  try {
    console.log('🎯 Adding sample forums and posts...');

    // Sync database to ensure tables exist
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

    // Sample forums data
    const sampleForums = [
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
    ];

    // Create forums
    const createdForums = [];
    for (const forumData of sampleForums) {
      const forum = await Forum.create(forumData);
      createdForums.push(forum);
      console.log(`✅ Created forum: ${forum.title}`);
    }

    // Sample posts data
    const samplePosts = [
      {
        forumId: createdForums[0].id,
        authorId: instructor.id,
        parentPostId: null,
        title: 'Welcome to the Course!',
        content: 'Welcome everyone to this amazing course! Feel free to introduce yourself and share your learning goals.',
        postType: 'announcement',
        isPinned: true,
        likeCount: 5,
        replyCount: 3,
        viewCount: 25
      },
      {
        forumId: createdForums[0].id,
        authorId: instructor.id,
        parentPostId: null,
        title: 'Course Materials',
        content: 'All course materials are available in the course content section. Make sure to download the latest version.',
        postType: 'text',
        isPinned: false,
        likeCount: 2,
        replyCount: 1,
        viewCount: 15
      },
      {
        forumId: createdForums[1].id,
        authorId: instructor.id,
        parentPostId: null,
        title: 'How to submit assignments?',
        content: 'I\'m having trouble finding where to submit my assignment. Can someone help me?',
        postType: 'question',
        isPinned: false,
        likeCount: 1,
        replyCount: 2,
        viewCount: 8
      }
    ];

    // Create posts
    for (const postData of samplePosts) {
      const post = await ForumPost.create(postData);
      console.log(`✅ Created post: ${post.title}`);
    }

    // Update forum post counts
    for (const forum of createdForums) {
      const postCount = await ForumPost.count({ where: { forumId: forum.id } });
      await forum.update({ postCount });
    }

    console.log('🎉 Sample forums and posts created successfully!');
    console.log('📚 You can now access the forum in your course');
    console.log(`📊 Created ${createdForums.length} forums and ${samplePosts.length} posts`);

  } catch (error) {
    console.error('❌ Error creating sample forums:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the script
addSampleForums();