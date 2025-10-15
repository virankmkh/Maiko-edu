const { sequelize, models } = require('./config/database');

async function checkRealData() {
  try {
    console.log('🔍 Checking for the REAL data you see in your dashboard...\n');

    // Check for the correct instructor email
    console.log('1. Looking for sarah.johnson@maiko.edu...');
    const correctInstructor = await models.User.findOne({
      where: { email: 'sarah.johnson@maiko.edu' }
    });

    if (correctInstructor) {
      console.log('✅ Found correct instructor:');
      console.log(`   Name: ${correctInstructor.firstName} ${correctInstructor.lastName}`);
      console.log(`   Email: ${correctInstructor.email}`);
      console.log(`   Role: ${correctInstructor.role}`);
      console.log(`   ID: ${correctInstructor.id}`);
    } else {
      console.log('❌ sarah.johnson@maiko.edu NOT found');
    }

    // Check for the courses you see
    console.log('\n2. Looking for your courses...');
    const courseNames = ['test', 'React Fundamentals', 'Node.js Backend Development'];
    
    for (const courseName of courseNames) {
      const course = await models.Course.findOne({
        where: { title: courseName }
      });
      
      if (course) {
        console.log(`✅ Found course: "${course.title}" (ID: ${course.id})`);
        console.log(`   Instructor ID: ${course.instructorId}`);
        console.log(`   Status: ${course.status}`);
        console.log(`   Price: $${course.price}`);
      } else {
        console.log(`❌ Course "${courseName}" NOT found`);
      }
    }

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

    allCourses.forEach(course => {
      console.log(`   - "${course.title}" by ${course.instructor ? course.instructor.firstName + ' ' + course.instructor.lastName : 'Unknown'} (${course.instructor ? course.instructor.email : 'N/A'})`);
    });

    // Check total students
    console.log('\n4. Total students count:');
    const totalStudents = await models.User.count({
      where: { role: 'student' }
    });
    console.log(`   Total students: ${totalStudents}`);

    // Check if there are more users than I found
    console.log('\n5. All users count:');
    const totalUsers = await models.User.count();
    console.log(`   Total users: ${totalUsers}`);

    // Check database connection info
    console.log('\n6. Database connection info:');
    console.log(`   Database URL: ${process.env.DATABASE_URL}`);
    console.log(`   Database name: ${sequelize.config.database}`);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRealData();
