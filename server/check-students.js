const { sequelize, models } = require('./config/database');

async function checkStudents() {
  try {
    console.log('🔍 Checking students in PostgreSQL database...\n');

    // Check all users
    const allUsers = await models.User.findAll();
    console.log(`📊 Total users in database: ${allUsers.length}`);

    // Check students specifically
    const students = await models.User.findAll({ 
      where: { role: 'student' } 
    });
    console.log(`👥 Students found: ${students.length}`);

    if (students.length > 0) {
      console.log('\n📋 Student list:');
      students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.firstName} ${student.lastName} (${student.email})`);
      });
    } else {
      console.log('⚠️ No students found in database');
    }

    // Check instructors
    const instructors = await models.User.findAll({ 
      where: { role: 'instructor' } 
    });
    console.log(`\n👨‍🏫 Instructors found: ${instructors.length}`);
    if (instructors.length > 0) {
      instructors.forEach((instructor, index) => {
        console.log(`${index + 1}. ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);
      });
    }

    // Check courses
    const courses = await models.Course.findAll();
    console.log(`\n📚 Courses found: ${courses.length}`);
    if (courses.length > 0) {
      courses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.title} (Instructor ID: ${course.instructorId})`);
      });
    }

    // Check enrollments
    const enrollments = await models.CourseEnrollment.findAll();
    console.log(`\n🎓 Enrollments found: ${enrollments.length}`);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkStudents();
