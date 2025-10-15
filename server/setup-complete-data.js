const { sequelize, models } = require('./config/database');

async function setupCompleteData() {
  try {
    console.log('🚀 Setting up complete data with 5 courses and 10 students each...\n');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await sequelize.sync({ force: true });
    
    // Create organization
    console.log('🏢 Creating organization...');
    const organization = await models.Organization.create({
      name: 'Maiko Education',
      description: 'Leading online education platform',
      website: 'https://maiko.edu',
      email: 'contact@maiko.edu',
      phone: '+1-555-0123',
      address: '123 Education Street, Learning City, LC 12345',
      isActive: true
    });
    
    // Create instructor (Dr. Sarah Johnson)
    console.log('👩‍🏫 Creating instructor...');
    const instructor = await models.User.create({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@maiko.edu',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'instructor',
      isActive: true,
      organizationId: organization.id,
      phone: '+1-555-0124',
      bio: 'Experienced software engineer and educator with 10+ years in web development',
      avatar: null,
      emailVerified: true,
      lastLoginAt: new Date()
    });
    
    // Create 5 courses with $15 price
    console.log('📚 Creating 5 courses...');
    const courses = [
      {
        title: 'React Fundamentals',
        slug: 'react-fundamentals',
        description: 'Learn the basics of React.js from scratch',
        price: 15.00,
        currency: 'USD',
        instructorId: instructor.id,
        organizationId: organization.id,
        category: 'Web Development',
        level: 'Beginner',
        duration: 40,
        language: 'English',
        isPublished: true,
        isActive: true,
        approvedBy: instructor.id,
        approvedAt: new Date(),
        averageRating: 4.8,
        totalRatings: 25,
        views: 150,
        thumbnail: null
      },
      {
        title: 'JavaScript Advanced',
        slug: 'javascript-advanced',
        description: 'Master advanced JavaScript concepts and patterns',
        price: 15.00,
        currency: 'USD',
        instructorId: instructor.id,
        organizationId: organization.id,
        category: 'Web Development',
        level: 'Intermediate',
        duration: 60,
        language: 'English',
        isPublished: true,
        isActive: true,
        approvedBy: instructor.id,
        approvedAt: new Date(),
        averageRating: 4.9,
        totalRatings: 18,
        views: 120,
        thumbnail: null
      },
      {
        title: 'Node.js Backend Development',
        slug: 'nodejs-backend-development',
        description: 'Build robust backend applications with Node.js',
        price: 15.00,
        currency: 'USD',
        instructorId: instructor.id,
        organizationId: organization.id,
        category: 'Backend Development',
        level: 'Intermediate',
        duration: 50,
        language: 'English',
        isPublished: true,
        isActive: true,
        approvedBy: instructor.id,
        approvedAt: new Date(),
        averageRating: 4.7,
        totalRatings: 22,
        views: 180,
        thumbnail: null
      },
      {
        title: 'Python for Data Science',
        slug: 'python-data-science',
        description: 'Learn Python programming for data analysis and visualization',
        price: 15.00,
        currency: 'USD',
        instructorId: instructor.id,
        organizationId: organization.id,
        category: 'Data Science',
        level: 'Beginner',
        duration: 45,
        language: 'English',
        isPublished: true,
        isActive: true,
        approvedBy: instructor.id,
        approvedAt: new Date(),
        averageRating: 4.6,
        totalRatings: 20,
        views: 200,
        thumbnail: null
      },
      {
        title: 'Full Stack Web Development',
        slug: 'full-stack-web-development',
        description: 'Complete web development course covering frontend and backend',
        price: 15.00,
        currency: 'USD',
        instructorId: instructor.id,
        organizationId: organization.id,
        category: 'Web Development',
        level: 'Advanced',
        duration: 80,
        language: 'English',
        isPublished: true,
        isActive: true,
        approvedBy: instructor.id,
        approvedAt: new Date(),
        averageRating: 4.9,
        totalRatings: 15,
        views: 100,
        thumbnail: null
      }
    ];
    
    const createdCourses = [];
    for (const courseData of courses) {
      const course = await models.Course.create(courseData);
      createdCourses.push(course);
      console.log(`✅ Created course: ${course.title}`);
    }
    
    // Create 10 students
    console.log('\n👥 Creating 10 students...');
    const students = [];
    for (let i = 1; i <= 10; i++) {
      const student = await models.User.create({
        firstName: `Student${i}`,
        lastName: `Last${i}`,
        email: `student${i}@example.com`,
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'student',
        isActive: true,
        organizationId: organization.id,
        phone: `+1-555-01${20 + i}`,
        bio: `Student ${i} learning web development`,
        avatar: null,
        emailVerified: true,
        lastLoginAt: new Date()
      });
      students.push(student);
      console.log(`✅ Created student: ${student.firstName} ${student.lastName}`);
    }
    
    // Enroll all students in all courses
    console.log('\n📝 Enrolling students in courses...');
    for (const course of createdCourses) {
      for (const student of students) {
        await models.CourseEnrollment.create({
          userId: student.id,
          courseId: course.id,
          enrolledAt: new Date(),
          isActive: true,
          progress: Math.floor(Math.random() * 100), // Random progress 0-100
          completedAt: Math.random() > 0.7 ? new Date() : null // 30% chance of completion
        });
      }
      console.log(`✅ Enrolled 10 students in ${course.title}`);
    }
    
    // Create lessons for each course
    console.log('\n📖 Creating lessons for each course...');
    for (const course of createdCourses) {
      const lessons = [
        { title: 'Introduction', order: 1, duration: 10 },
        { title: 'Getting Started', order: 2, duration: 15 },
        { title: 'Core Concepts', order: 3, duration: 20 },
        { title: 'Advanced Topics', order: 4, duration: 25 },
        { title: 'Final Project', order: 5, duration: 30 }
      ];
      
      for (const lessonData of lessons) {
        await models.Lesson.create({
          ...lessonData,
          courseId: course.id,
          content: `This is the content for ${lessonData.title} in ${course.title}`,
          isPublished: true,
          isActive: true
        });
      }
      console.log(`✅ Created 5 lessons for ${course.title}`);
    }
    
    // Create forums for each course
    console.log('\n💬 Creating forums for each course...');
    for (const course of createdCourses) {
      const forums = [
        { title: 'General Discussion', description: 'General course discussions', isPinned: true },
        { title: 'Q&A Forum', description: 'Ask questions about the course', isPinned: false },
        { title: 'Project Showcase', description: 'Share your projects', isPinned: false },
        { title: 'Study Groups', description: 'Find study partners', isPinned: false },
        { title: 'Announcements', description: 'Course announcements', isPinned: true }
      ];
      
      for (const forumData of forums) {
        await models.Forum.create({
          ...forumData,
          courseId: course.id,
          isActive: true,
          postCount: 0,
          lastActivityAt: new Date()
        });
      }
      console.log(`✅ Created 5 forums for ${course.title}`);
    }
    
    // Create some sample forum posts
    console.log('\n📝 Creating sample forum posts...');
    for (const course of createdCourses) {
      const generalForum = await models.Forum.findOne({
        where: { courseId: course.id, title: 'General Discussion' }
      });
      
      if (generalForum) {
        // Create posts by instructor
        await models.ForumPost.create({
          forumId: generalForum.id,
          authorId: instructor.id,
          title: `Welcome to ${course.title}!`,
          content: `Welcome everyone to ${course.title}! I'm excited to have you all here. Let's make this a great learning experience.`,
          isPinned: true
        });
        
        await models.ForumPost.create({
          forumId: generalForum.id,
          authorId: instructor.id,
          title: `Course Materials Available`,
          content: `All course materials are now available in the course dashboard. Please review them before starting the lessons.`,
          isPinned: false
        });
        
        // Create posts by students
        const randomStudents = students.sort(() => 0.5 - Math.random()).slice(0, 3);
        for (const student of randomStudents) {
          await models.ForumPost.create({
            forumId: generalForum.id,
            authorId: student.id,
            title: `Question about ${course.title}`,
            content: `I have a question about the course content. Can someone help me understand this concept better?`,
            isPinned: false
          });
        }
        
        // Update forum post count
        const postCount = await models.ForumPost.count({
          where: { forumId: generalForum.id }
        });
        generalForum.postCount = postCount;
        generalForum.lastActivityAt = new Date();
        await generalForum.save();
        
        console.log(`✅ Created forum posts for ${course.title}`);
      }
    }
    
    // Display summary
    console.log('\n🎉 Data setup complete!');
    console.log('📊 Summary:');
    console.log(`- 1 Organization: ${organization.name}`);
    console.log(`- 1 Instructor: ${instructor.firstName} ${instructor.lastName}`);
    console.log(`- 5 Courses: All priced at $15.00`);
    console.log(`- 10 Students: All enrolled in all courses`);
    console.log(`- 50 Total Enrollments`);
    console.log(`- 25 Lessons: 5 per course`);
    console.log(`- 25 Forums: 5 per course`);
    console.log(`- Multiple Forum Posts: Created for each course`);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error setting up data:', error.message);
    console.error('Stack:', error.stack);
  }
}

setupCompleteData();
