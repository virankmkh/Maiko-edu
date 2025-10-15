const { sequelize, models } = require('./config/database');

async function testForumAPI() {
  try {
    console.log('🧪 Testing Forum API...\n');
    
    // Test 1: Get forums for course 1
    console.log('=== TEST 1: Get Course Forums ===');
    const course = await models.Course.findByPk(1);
    if (!course) {
      console.log('❌ Course not found');
      return;
    }
    console.log('Course found:', course.title);
    
    // Check if user is instructor
    const instructor = await models.User.findOne({ where: { role: 'instructor' } });
    if (!instructor) {
      console.log('❌ No instructor found');
      return;
    }
    console.log('Instructor found:', instructor.firstName, instructor.lastName);
    
    const isInstructor = instructor.role === 'instructor' && course.instructorId === instructor.id;
    const isAdmin = instructor.role === 'admin' || instructor.role === 'organization_admin';
    
    console.log('Is instructor:', isInstructor);
    console.log('Is admin:', isAdmin);
    
    if (!isInstructor && !isAdmin) {
      console.log('❌ User is not authorized to access forums');
      return;
    }
    
    // Get forums
    const forums = await models.Forum.findAll({
      where: { courseId: 1, isActive: true },
      include: [
        {
          model: models.Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'order']
        }
      ],
      order: [['isPinned', 'DESC'], ['lastActivityAt', 'DESC']]
    });
    
    console.log('Forums found:', forums.length);
    forums.forEach(f => {
      console.log(`- ${f.title} (Posts: ${f.postCount})`);
    });
    
    // Test 2: Get posts for first forum
    if (forums.length > 0) {
      console.log('\n=== TEST 2: Get Forum Posts ===');
      const firstForum = forums[0];
      console.log('Testing forum:', firstForum.title);
      
      const posts = await models.ForumPost.findAndCountAll({
        where: { forumId: firstForum.id, parentPostId: null },
        include: [
          {
            model: models.User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName', 'role']
          },
          {
            model: models.ForumPost,
            as: 'replies',
            include: [
              {
                model: models.User,
                as: 'author',
                attributes: ['id', 'firstName', 'lastName']
              }
            ],
            limit: 3,
            order: [['createdAt', 'ASC']]
          }
        ],
        order: [['isPinned', 'DESC'], ['createdAt', 'DESC']],
        limit: 10,
        offset: 0
      });
      
      console.log('Posts found:', posts.count);
      posts.rows.forEach(p => {
        console.log(`- ${p.title} by ${p.author.firstName} ${p.author.lastName} (Replies: ${p.replies.length})`);
      });
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testForumAPI();
