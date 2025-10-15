const { sequelize, models } = require('./config/database');

async function debugStudentsEndpoint() {
  try {
    console.log('🔍 Debugging students endpoint...\n');

    const courseId = 1; // Test course ID
    
    // Check if user is instructor or admin
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@lecturer.com' }
    });

    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }

    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);

    // Get course to verify ownership
    const course = await models.Course.findByPk(courseId);
    if (!course) {
      console.log('❌ Course not found');
      return;
    }

    console.log('✅ Course found:', course.title);

    // Check if instructor owns this course
    if (instructor.role === 'instructor' && course.instructorId !== instructor.id) {
      console.log('❌ Access denied - instructor does not own this course');
      return;
    }

    console.log('✅ Access granted');

    // Use models from database config
    const CourseEnrollment = models.CourseEnrollment;
    const User = models.User;

    console.log('📊 Models loaded successfully');

    // Get all enrollments for this course
    console.log('🔍 Fetching enrollments...');
    const enrollments = await CourseEnrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    console.log('✅ Enrollments fetched:', enrollments.length);

    // Calculate statistics
    console.log('📊 Calculating statistics...');
    const totalStudents = enrollments.length;
    const currentStudents = enrollments.filter(e => e.isActive && e.progress < 100).length;
    const completedStudents = enrollments.filter(e => e.progress === 100).length;

    console.log('📊 Statistics calculated:');
    console.log('- Total students:', totalStudents);
    console.log('- Current students:', currentStudents);
    console.log('- Completed students:', completedStudents);

    // Get student lists
    console.log('👥 Creating student lists...');
    const totalStudentsList = enrollments.map(e => ({
      id: e.student.id,
      name: `${e.student.firstName} ${e.student.lastName}`,
      email: e.student.email,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt
    }));

    const currentStudentsList = enrollments
      .filter(e => e.isActive && e.progress < 100)
      .map(e => ({
        id: e.student.id,
        name: `${e.student.firstName} ${e.student.lastName}`,
        email: e.student.email,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
        lastAccessedAt: e.lastAccessedAt
      }));

    const completedStudentsList = enrollments
      .filter(e => e.progress === 100)
      .map(e => ({
        id: e.student.id,
        name: `${e.student.firstName} ${e.student.lastName}`,
        email: e.student.email,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        progress: e.progress
      }));

    console.log('✅ Student lists created:');
    console.log('- Total list length:', totalStudentsList.length);
    console.log('- Current list length:', currentStudentsList.length);
    console.log('- Completed list length:', completedStudentsList.length);

    // Create response object
    const response = {
      statistics: {
        totalStudents,
        currentStudents,
        completedStudents
      },
      students: {
        total: totalStudentsList,
        current: currentStudentsList,
        completed: completedStudentsList
      }
    };

    console.log('✅ Response object created successfully');
    console.log('📋 Sample response:', JSON.stringify(response, null, 2));

    console.log('\n🎉 Students endpoint debug completed successfully!');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

debugStudentsEndpoint();
