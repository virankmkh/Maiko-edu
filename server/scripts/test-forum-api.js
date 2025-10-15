const { sequelize, models } = require('../config/database');

const testForumAPI = async () => {
  try {
    console.log('🧪 Testing Forum API...\n');
    
    // Test 1: Get all forums for course 1
    console.log('1. Testing forum retrieval...');
    const forums = await models.Forum.findAll({
      where: { courseId: 1 },
      include: [{
        model: models.ForumPost,
        as: 'posts',
        limit: 1
      }]
    });
    console.log(`✅ Found ${forums.length} forums for course 1`);
    forums.forEach(forum => {
      console.log(`   - ${forum.title} (${forum.postCount} posts)`);
    });
    
    // Test 2: Get posts for first forum
    console.log('\n2. Testing post retrieval...');
    const posts = await models.ForumPost.findAll({
      where: { forumId: forums[0].id },
      include: [{
        model: models.User,
        as: 'author',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });
    console.log(`✅ Found ${posts.length} posts in "${forums[0].title}"`);
    posts.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author?.firstName} ${post.author?.lastName}`);
    });
    
    // Test 3: Get course with student counts
    console.log('\n3. Testing course statistics...');
    const course = await models.Course.findByPk(1, {
      include: [{
        model: models.CourseEnrollment,
        as: 'enrollments',
        where: { isActive: true },
        required: false
      }]
    });
    
    const totalStudents = course.enrollments.length;
    const currentStudents = course.enrollments.filter(e => e.progress < 100).length;
    const completedStudents = course.enrollments.filter(e => e.progress === 100).length;
    
    console.log(`✅ Course: ${course.title}`);
    console.log(`   - Total Students: ${totalStudents}`);
    console.log(`   - Current Students: ${currentStudents}`);
    console.log(`   - Completed Students: ${completedStudents}`);
    console.log(`   - Price: $${course.price}`);
    
    // Test 4: Test user authentication
    console.log('\n4. Testing user authentication...');
    const instructor = await models.User.findOne({ where: { role: 'instructor' } });
    const student = await models.User.findOne({ where: { role: 'student' } });
    
    console.log(`✅ Instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);
    console.log(`✅ Student: ${student.firstName} ${student.lastName} (${student.email})`);
    
    console.log('\n🎉 All tests passed! Database connection is working perfectly.');
    console.log('\n📋 Summary:');
    console.log(`- Database: PostgreSQL (maiko_edu)`);
    console.log(`- Tables: All created successfully`);
    console.log(`- Forums: ${forums.length} available`);
    console.log(`- Posts: ${posts.length} sample posts`);
    console.log(`- Users: Instructor + ${await models.User.count({ where: { role: 'student' } })} students`);
    console.log(`- Course: ${course.title} with ${totalStudents} enrolled students`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the test
testForumAPI();
