const { sequelize, models } = require('./config/database');

async function testAPIDirect() {
  try {
    console.log('🧪 Testing API directly...\n');

    // Get the instructor
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@lecturer.com' }
    });

    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }

    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);

    // Get the course
    const course = await models.Course.findOne({
      where: { instructorId: instructor.id }
    });

    if (!course) {
      console.log('❌ Course not found');
      return;
    }

    console.log('✅ Course found:', course.title);

    // Test the students query directly
    console.log('\n👥 Testing students query...');
    
    const CourseEnrollment = models.CourseEnrollment;
    const User = models.User;

    // Get all enrollments for this course
    const enrollments = await CourseEnrollment.findAll({
      where: { courseId: course.id },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    console.log('✅ Enrollments found:', enrollments.length);

    // Calculate statistics
    const totalStudents = enrollments.length;
    const currentStudents = enrollments.filter(e => e.isActive && e.progress < 100).length;
    const completedStudents = enrollments.filter(e => e.progress === 100).length;

    console.log('📊 Statistics:');
    console.log('- Total students:', totalStudents);
    console.log('- Current students:', currentStudents);
    console.log('- Completed students:', completedStudents);

    // Get student lists
    const totalStudentsList = enrollments.map(e => ({
      id: e.student.id,
      name: `${e.student.firstName} ${e.student.lastName}`,
      email: e.student.email,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt
    }));

    console.log('\n👥 Student lists:');
    console.log('- Total list length:', totalStudentsList.length);
    console.log('- Sample student:', totalStudentsList[0]);

    console.log('\n🎉 Direct API test completed successfully!');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testAPIDirect();
