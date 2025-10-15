const { sequelize, models } = require('./config/database');

async function checkRunningDatabase() {
  try {
    console.log('🔍 Checking the database that the running server is connected to...\n');

    // Check database connection info
    console.log('1. Database connection info:');
    console.log(`   Database URL: ${process.env.DATABASE_URL}`);
    console.log(`   Database name: ${sequelize.config.database}`);
    console.log(`   Host: ${sequelize.config.host}`);
    console.log(`   Port: ${sequelize.config.port}`);

    // Check all users
    console.log('\n2. All users in database:');
    const allUsers = await models.User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role']
    });

    console.log(`   Total users: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.firstName} ${user.lastName}) - ${user.role}`);
    });

    // Check all courses
    console.log('\n3. All courses in database:');
    const allCourses = await models.Course.findAll({
      include: [
        {
          model: models.User,
          as: 'instructor',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    console.log(`   Total courses: ${allCourses.length}`);
    allCourses.forEach(course => {
      console.log(`   - "${course.title}" by ${course.instructor ? course.instructor.firstName + ' ' + course.instructor.lastName : 'Unknown'} (${course.instructor ? course.instructor.email : 'N/A'})`);
    });

    // Check enrollments
    console.log('\n4. All enrollments:');
    const allEnrollments = await models.CourseEnrollment.findAll({
      include: [
        {
          model: models.User,
          as: 'student',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: models.Course,
          attributes: ['title']
        }
      ]
    });

    console.log(`   Total enrollments: ${allEnrollments.length}`);
    allEnrollments.forEach(enrollment => {
      console.log(`   - ${enrollment.student ? enrollment.student.email : 'Unknown'} enrolled in "${enrollment.course ? enrollment.course.title : 'Unknown'}"`);
    });

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRunningDatabase();
