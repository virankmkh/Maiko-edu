const { sequelize, models } = require('./config/database');
const bcrypt = require('bcryptjs');

async function enrollStudent() {
  try {
    console.log('🎓 Enrolling student in Advanced Web Development Bootcamp...\n');

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

    // Check if already enrolled
    const existingEnrollment = await models.CourseEnrollment.findOne({
      where: { userId: student.id, courseId: course.id }
    });

    if (existingEnrollment) {
      console.log('✅ Student already enrolled in this course');
      console.log('📊 Enrollment details:');
      console.log(`- Status: ${existingEnrollment.paymentStatus}`);
      console.log(`- Enrolled: ${existingEnrollment.enrolledAt}`);
      console.log(`- Progress: ${existingEnrollment.progress}%`);
    } else {
      // Create enrollment
      const enrollment = await models.CourseEnrollment.create({
        userId: student.id,
        courseId: course.id,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        paymentStatus: 'free', // Development mode - free access
        progress: 0
      });

      console.log('✅ Student enrolled successfully!');
      console.log('📊 Enrollment details:');
      console.log(`- Student: ${student.firstName} ${student.lastName}`);
      console.log(`- Course: ${course.title}`);
      console.log(`- Price: $${course.price}`);
      console.log(`- Status: ${enrollment.paymentStatus}`);
      console.log(`- Enrolled: ${enrollment.enrolledAt}`);
    }

    // Get course lessons
    const lessons = await models.Lesson.findAll({
      where: { courseId: course.id },
      order: [['order', 'ASC']]
    });

    console.log('\n📖 Course Lessons:');
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title}`);
      console.log(`   - Free: ${lesson.isFree ? 'Yes' : 'No'}`);
      console.log(`   - Duration: ${lesson.videoDuration ? Math.floor(lesson.videoDuration / 60) + ' minutes' : 'N/A'}`);
      console.log(`   - Content Types: ${lesson.contentTypes.join(', ')}`);
      console.log('');
    });

    // Get course forum
    const forum = await models.Forum.findOne({
      where: { courseId: course.id }
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

  } catch (error) {
    console.error('❌ Error enrolling student:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
enrollStudent();
