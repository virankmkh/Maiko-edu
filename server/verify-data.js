const { sequelize, models } = require('./config/database');

async function verifyData() {
  try {
    console.log('🔍 Verifying data setup...\n');
    
    // Check courses
    const courses = await models.Course.findAll({
      include: [
        { model: models.User, as: 'instructor', attributes: ['firstName', 'lastName'] }
      ]
    });
    
    console.log('=== COURSES ===');
    console.log('Total courses:', courses.length);
    courses.forEach(c => {
      console.log(`- ${c.title} - $${c.price} - Instructor: ${c.instructor.firstName} ${c.instructor.lastName}`);
    });
    
    // Check students
    const students = await models.User.findAll({ where: { role: 'student' } });
    console.log('\n=== STUDENTS ===');
    console.log('Total students:', students.length);
    students.forEach(s => {
      console.log(`- ${s.firstName} ${s.lastName} (${s.email})`);
    });
    
    // Check enrollments
    const enrollments = await models.CourseEnrollment.findAll();
    console.log('\n=== ENROLLMENTS ===');
    console.log('Total enrollments:', enrollments.length);
    
    // Check enrollments per course
    for (const course of courses) {
      const courseEnrollments = await models.CourseEnrollment.findAll({
        where: { courseId: course.id }
      });
      console.log(`- ${course.title}: ${courseEnrollments.length} students enrolled`);
    }
    
    // Check forums
    const forums = await models.Forum.findAll();
    console.log('\n=== FORUMS ===');
    console.log('Total forums:', forums.length);
    
    // Check forum posts
    const posts = await models.ForumPost.findAll();
    console.log('\n=== FORUM POSTS ===');
    console.log('Total forum posts:', posts.length);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyData();
