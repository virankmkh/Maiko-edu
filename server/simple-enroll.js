const { sequelize, models } = require('./config/database');
const bcrypt = require('bcryptjs');

async function simpleEnroll() {
  try {
    console.log('🎓 Simple enrollment in Advanced Web Development Bootcamp...\n');

    // Find or create a test student
    let student = await models.User.findOne({
      where: { email: 'student@maiko.edu' }
    });

    if (!student) {
      console.log('👤 Creating test student account...');
      const hashedPassword = await bcrypt.hash('student123', 10);
      student = await models.User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'student@maiko.edu',
        password: hashedPassword,
        role: 'student',
        isActive: true,
        isVerified: true,
        phone: '+243 987 654 321',
        dateOfBirth: '1995-03-20'
      });
      console.log('✅ Student created:', student.email);
    }

    // Find the course
    const course = await models.Course.findOne({
      where: { slug: 'advanced-web-development-bootcamp-2025' }
    });

    if (!course) {
      console.log('❌ Course not found');
      return;
    }

    console.log('📚 Found course:', course.title);

    // Check if already enrolled (without payment fields)
    const existingEnrollment = await models.CourseEnrollment.findOne({
      where: { userId: student.id, courseId: course.id },
      attributes: ['id', 'userId', 'courseId', 'enrolledAt', 'progress', 'lastAccessedAt', 'isActive']
    });

    if (existingEnrollment) {
      console.log('✅ Student already enrolled in this course');
      console.log('📊 Enrollment details:');
      console.log(`- Enrolled: ${existingEnrollment.enrolledAt}`);
      console.log(`- Progress: ${existingEnrollment.progress}%`);
    } else {
      // Create enrollment (without payment fields)
      const enrollment = await models.CourseEnrollment.create({
        userId: student.id,
        courseId: course.id,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        progress: 0,
        isActive: true
      });

      console.log('✅ Student enrolled successfully!');
      console.log('📊 Enrollment details:');
      console.log(`- Student: ${student.firstName} ${student.lastName}`);
      console.log(`- Course: ${course.title}`);
      console.log(`- Price: $${course.price}`);
      console.log(`- Enrolled: ${enrollment.enrolledAt}`);
    }

    // Get course lessons
    const lessons = await models.Lesson.findAll({
      where: { courseId: course.id },
      order: [['order', 'ASC']],
      attributes: ['id', 'title', 'description', 'order', 'isFree', 'videoDuration', 'contentTypes']
    });

    console.log('\n📖 Course Lessons:');
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title}`);
      console.log(`   - Free: ${lesson.isFree ? 'Yes' : 'No'}`);
      console.log(`   - Duration: ${lesson.videoDuration ? Math.floor(lesson.videoDuration / 60) + ' minutes' : 'N/A'}`);
      console.log(`   - Content Types: ${lesson.contentTypes ? lesson.contentTypes.join(', ') : 'N/A'}`);
      console.log('');
    });

    // Get course forum
    const forum = await models.Forum.findOne({
      where: { courseId: course.id },
      attributes: ['title', 'description', 'isActive']
    });

    if (forum) {
      console.log('💬 Course Forum:');
      console.log(`- Title: ${forum.title}`);
      console.log(`- Description: ${forum.description}`);
      console.log(`- Active: ${forum.isActive ? 'Yes' : 'No'}`);
    }

    console.log('\n🔗 Access Information:');
    console.log(`- Student Login: student@maiko.edu / student123`);
    console.log(`- Course URL: http://localhost:3000/courses`);
    console.log(`- Development Mode: Payment restrictions disabled`);

    console.log('\n🎯 Course Features Available:');
    console.log('✅ 4 Comprehensive Lessons');
    console.log('✅ Quizzes and Assignments');
    console.log('✅ Course Forum');
    console.log('✅ IDE Integration');
    console.log('✅ Video Content');
    console.log('✅ Progress Tracking');

  } catch (error) {
    console.error('❌ Error enrolling student:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
simpleEnroll();
