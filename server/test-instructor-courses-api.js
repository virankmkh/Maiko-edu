const { sequelize, models } = require('./config/database');

async function testInstructorCoursesAPI() {
  try {
    console.log('🔍 Testing the /api/courses/instructor endpoint logic...\n');

    // Find the instructor
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@lecturer.com' }
    });

    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }

    console.log(`✅ Found instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);

    // Simulate the courses/instructor endpoint logic
    const courses = await models.Course.findAll({
      where: { instructorId: instructor.id },
      include: [
        {
          model: models.CourseEnrollment,
          as: 'enrollments',
          include: [
            {
              model: models.User,
              as: 'student',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    console.log(`\n📚 Found ${courses.length} courses:`);
    
    const coursesData = courses.map(course => {
      const enrollments = course.enrollments || [];
      const currentEnrollments = enrollments.length;
      
      console.log(`\nCourse: "${course.title}"`);
      console.log(`  ID: ${course.id}`);
      console.log(`  Status: ${course.status}`);
      console.log(`  Price: $${course.price}`);
      console.log(`  Enrollments: ${currentEnrollments}`);
      
      if (enrollments.length > 0) {
        console.log(`  Students:`);
        enrollments.forEach(enrollment => {
          console.log(`    - ${enrollment.student ? enrollment.student.email : 'Unknown'}`);
        });
      }

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        status: course.status,
        currentEnrollments: currentEnrollments,
        totalStudents: currentEnrollments,
        earnings: 0 // Would calculate from payments
      };
    });

    console.log('\n📊 Final courses data that would be returned:');
    console.log(JSON.stringify(coursesData, null, 2));

    // Calculate stats like the frontend does
    const activeCourses = coursesData.filter(course => course.status === 'published' || course.status === 'draft').length;
    const enrolledStudents = coursesData.reduce((total, course) => total + course.currentEnrollments, 0);
    const totalEarnings = coursesData.reduce((total, course) => total + parseFloat(course.earnings || 0), 0);

    console.log('\n📈 Stats that would be calculated:');
    console.log(`  Active Courses: ${activeCourses}`);
    console.log(`  Enrolled Students: ${enrolledStudents}`);
    console.log(`  Total Earnings: $${totalEarnings}`);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testInstructorCoursesAPI();
