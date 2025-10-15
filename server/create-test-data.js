const { sequelize, models } = require('./config/database');
const bcrypt = require('bcryptjs');

async function createTestData() {
  try {
    console.log('🧪 Creating test data...\n');

    // Create instructor
    const hashedPassword = await bcrypt.hash('lecturer123', 10);
    const instructor = await models.User.findOrCreate({
      where: { email: 'sarah.johnson@lecturer.com' },
      defaults: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@lecturer.com',
        password: hashedPassword,
        role: 'instructor',
        organizationId: 1,
        isVerified: true,
        isActive: true
      }
    });

    console.log('✅ Instructor created/found:', instructor[0].firstName, instructor[0].lastName);

    // Create some students
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const studentPassword = await bcrypt.hash('student123', 10);
      const student = await models.User.findOrCreate({
        where: { email: `student${i}@test.com` },
        defaults: {
          firstName: `Student`,
          lastName: `${i}`,
          email: `student${i}@test.com`,
          password: studentPassword,
          role: 'student',
          organizationId: 1,
          isVerified: true,
          isActive: true
        }
      });
      students.push(student[0]);
    }

    console.log(`✅ Created ${students.length} students`);

    // Create a course
    const course = await models.Course.findOrCreate({
      where: { title: 'Test Networking Course' },
      defaults: {
        title: 'Test Networking Course',
        subtitle: 'Learn the basics of computer networking',
        description: 'A comprehensive course on computer networking fundamentals',
        shortDescription: 'Learn networking basics',
        organizationId: 1,
        instructorId: instructor[0].id,
        category: 'technology',
        language: 'en',
        difficulty: 'beginner',
        level: 'basic',
        price: 0,
        currency: 'USD',
        isFree: true,
        status: 'published',
        isPublished: true,
        slug: 'test-networking-course',
        totalLessons: 10,
        totalDuration: 1200, // 20 minutes
        providesCertificate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Course created/found:', course[0].title);

    // Create enrollments
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const progress = Math.floor(Math.random() * 100); // Random progress 0-100
      
      await models.CourseEnrollment.findOrCreate({
        where: { 
          courseId: course[0].id, 
          userId: student.id 
        },
        defaults: {
          courseId: course[0].id,
          userId: student.id,
          progress: progress,
          isActive: progress < 100,
          enrolledAt: new Date(),
          lastAccessedAt: new Date(),
          completedAt: progress === 100 ? new Date() : null
        }
      });
    }

    console.log(`✅ Created ${students.length} enrollments`);

    // Verify the data
    const enrollments = await models.CourseEnrollment.findAll({
      where: { courseId: course[0].id },
      include: [
        {
          model: models.User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    console.log('\n📊 Verification:');
    console.log(`- Course: ${course[0].title}`);
    console.log(`- Instructor: ${instructor[0].firstName} ${instructor[0].lastName}`);
    console.log(`- Enrollments: ${enrollments.length}`);
    console.log(`- Students: ${enrollments.map(e => e.student.firstName + ' ' + e.student.lastName).join(', ')}`);

    console.log('\n🎉 Test data created successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('- Instructor: sarah.johnson@lecturer.com / lecturer123');
    console.log('- Students: student1@test.com to student5@test.com / student123');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

createTestData();
