const { sequelize, models } = require('./config/database');

async function testFrontendAPI() {
  try {
    console.log('🧪 Testing Frontend API Calls...\n');
    
    // Get instructor user and create a token
    const instructor = await models.User.findOne({ where: { role: 'instructor' } });
    if (!instructor) {
      console.log('❌ No instructor found');
      return;
    }
    
    console.log('Instructor:', instructor.firstName, instructor.lastName);
    
    // Simulate the frontend API call to get forums
    console.log('\n=== TESTING FORUM API CALL ===');
    
    // This simulates what the frontend does
    const courseId = 1;
    const lessonId = null; // Course-level forums
    
    // Check course
    const course = await models.Course.findByPk(courseId);
    if (!course) {
      console.log('❌ Course not found');
      return;
    }
    
    // Check authorization
    const isInstructor = instructor.role === 'instructor' && course.instructorId === instructor.id;
    const isAdmin = instructor.role === 'admin' || instructor.role === 'organization_admin';
    
    if (!isInstructor && !isAdmin) {
      console.log('❌ User not authorized');
      return;
    }
    
    // Get forums (simulating the API response)
    const forums = await models.Forum.findAll({
      where: { courseId, isActive: true, lessonId: null },
      include: [
        {
          model: models.Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'order']
        }
      ],
      order: [
        ['isPinned', 'DESC'], 
        ['postCount', 'DESC'], 
        ['lastActivityAt', 'DESC']
      ]
    });
    
    console.log('Forums returned:', forums.length);
    forums.forEach(f => {
      console.log(`- ${f.title} (Posts: ${f.postCount})`);
    });
    
    // Test posts for first forum
    if (forums.length > 0) {
      console.log('\n=== TESTING POSTS API CALL ===');
      const firstForum = forums[0];
      console.log('Testing posts for:', firstForum.title);
      
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
        console.log(`- ${p.title} by ${p.author.firstName} ${p.author.lastName}`);
      });
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFrontendAPI();
