const { sequelize, models } = require('./config/database');

async function checkAllUsers() {
  try {
    console.log('🔍 Checking ALL users in database...\n');

    // Get all users
    const users = await models.User.findAll({
      order: [['id', 'ASC']]
    });

    console.log(`📊 Total users: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Organization ID: ${user.organizationId}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Verified: ${user.isVerified}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('   ' + '-'.repeat(50));
    });

    // Check instructors specifically
    const instructors = users.filter(u => u.role === 'instructor');
    console.log(`\n👨‍🏫 Instructors (${instructors.length}):`);
    instructors.forEach(instructor => {
      console.log(`- ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);
    });

    // Check students specifically
    const students = users.filter(u => u.role === 'student');
    console.log(`\n👥 Students (${students.length}):`);
    students.forEach(student => {
      console.log(`- ${student.firstName} ${student.lastName} (${student.email})`);
    });

    // Check courses and their instructors
    const courses = await models.Course.findAll();
    console.log(`\n📚 Courses (${courses.length}):`);
    courses.forEach(course => {
      const instructor = users.find(u => u.id === course.instructorId);
      console.log(`- "${course.title}" by ${instructor ? instructor.firstName + ' ' + instructor.lastName : 'Unknown'} (ID: ${course.instructorId})`);
    });

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllUsers();
