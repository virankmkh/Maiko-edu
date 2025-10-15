const { sequelize, models } = require('./config/database');

async function findJavascriptCourse() {
  try {
    console.log('🔍 Searching for "Javascript introduction" course...\n');

    // First, find the instructor
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@lecturer.com' }
    });

    if (!instructor) {
      console.log('❌ Instructor sarah.johnson@lecturer.com not found');
      return;
    }

    console.log(`✅ Found instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);

    // Search for courses with "javascript" in the title (case insensitive)
    console.log('\n1. Searching for courses with "javascript" in title...');
    const javascriptCourses = await models.Course.findAll({
      where: {
        instructorId: instructor.id,
        title: {
          [sequelize.Op.iLike]: '%javascript%'
        }
      },
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

    console.log(`Found ${javascriptCourses.length} courses with "javascript" in title:`);
    javascriptCourses.forEach(course => {
      console.log(`\n📚 Course: "${course.title}"`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Status: ${course.status}`);
      console.log(`   Price: $${course.price}`);
      console.log(`   Enrollments: ${course.enrollments ? course.enrollments.length : 0}`);
      
      if (course.enrollments && course.enrollments.length > 0) {
        console.log(`   Students:`);
        course.enrollments.forEach(enrollment => {
          console.log(`     - ${enrollment.student ? enrollment.student.email : 'Unknown'} (${enrollment.student ? enrollment.student.firstName + ' ' + enrollment.student.lastName : 'Unknown'})`);
        });
      } else {
        console.log(`   No students enrolled`);
      }
    });

    // Also search for courses with "introduction" in the title
    console.log('\n2. Searching for courses with "introduction" in title...');
    const introCourses = await models.Course.findAll({
      where: {
        instructorId: instructor.id,
        title: {
          [sequelize.Op.iLike]: '%introduction%'
        }
      },
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

    console.log(`Found ${introCourses.length} courses with "introduction" in title:`);
    introCourses.forEach(course => {
      console.log(`\n📚 Course: "${course.title}"`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Status: ${course.status}`);
      console.log(`   Price: $${course.price}`);
      console.log(`   Enrollments: ${course.enrollments ? course.enrollments.length : 0}`);
      
      if (course.enrollments && course.enrollments.length > 0) {
        console.log(`   Students:`);
        course.enrollments.forEach(enrollment => {
          console.log(`     - ${enrollment.student ? enrollment.student.email : 'Unknown'} (${enrollment.student ? enrollment.student.firstName + ' ' + enrollment.student.lastName : 'Unknown'})`);
        });
      } else {
        console.log(`   No students enrolled`);
      }
    });

    // List ALL courses for this instructor
    console.log('\n3. All courses for sarah.johnson@lecturer.com:');
    const allCourses = await models.Course.findAll({
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

    console.log(`Total courses: ${allCourses.length}`);
    allCourses.forEach(course => {
      console.log(`\n📚 Course: "${course.title}"`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Status: ${course.status}`);
      console.log(`   Price: $${course.price}`);
      console.log(`   Enrollments: ${course.enrollments ? course.enrollments.length : 0}`);
      
      if (course.enrollments && course.enrollments.length > 0) {
        console.log(`   Students:`);
        course.enrollments.forEach(enrollment => {
          console.log(`     - ${enrollment.student ? enrollment.student.email : 'Unknown'} (${enrollment.student ? enrollment.student.firstName + ' ' + enrollment.student.lastName : 'Unknown'})`);
        });
      } else {
        console.log(`   No students enrolled`);
      }
    });

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findJavascriptCourse();
