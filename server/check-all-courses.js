const { sequelize, models } = require('./config/database');

async function checkAllCourses() {
  try {
    console.log('🔍 Checking ALL courses in database...\n');

    // Get all courses with their instructors
    const courses = await models.Course.findAll({
      include: [
        {
          model: models.User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['id', 'ASC']]
    });

    console.log(`📚 Total courses: ${courses.length}\n`);

    courses.forEach((course, index) => {
      console.log(`${index + 1}. Course ID: ${course.id}`);
      console.log(`   Title: "${course.title}"`);
      console.log(`   Instructor: ${course.instructor ? course.instructor.firstName + ' ' + course.instructor.lastName : 'Unknown'} (${course.instructor ? course.instructor.email : 'N/A'})`);
      console.log(`   Instructor ID: ${course.instructorId}`);
      console.log(`   Status: ${course.status}`);
      console.log(`   Published: ${course.isPublished}`);
      console.log(`   Price: $${course.price}`);
      console.log(`   Created: ${course.createdAt}`);
      console.log(`   Updated: ${course.updatedAt}`);
      console.log('   ' + '-'.repeat(60));
    });

    // Check enrollments for each course
    console.log('\n🎓 Enrollments per course:');
    for (const course of courses) {
      const enrollments = await models.CourseEnrollment.findAll({
        where: { courseId: course.id },
        include: [
          {
            model: models.User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      console.log(`\n📖 "${course.title}" (ID: ${course.id}):`);
      console.log(`   Enrollments: ${enrollments.length}`);
      
      if (enrollments.length > 0) {
        enrollments.forEach(enrollment => {
          console.log(`   - ${enrollment.student.firstName} ${enrollment.student.lastName} (${enrollment.student.email}) - Progress: ${enrollment.progress}%`);
        });
      } else {
        console.log('   - No enrollments');
      }
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllCourses();
