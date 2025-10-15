const { sequelize, models } = require('./config/database');

async function checkForums() {
  try {
    console.log('🔍 Checking Forum Data...\n');
    
    // Check forums
    const forums = await models.Forum.findAll({
      include: [
        { 
          model: models.Course, 
          as: 'course', 
          attributes: ['id', 'title'] 
        }
      ]
    });
    
    console.log('=== ALL FORUMS ===');
    console.log('Total forums:', forums.length);
    forums.forEach(f => {
      console.log(`- ${f.title} (Course: ${f.course?.title || 'No course'}) - Posts: ${f.postCount}`);
    });
    
    // Check posts
    const posts = await models.ForumPost.findAll({
      include: [
        { 
          model: models.User, 
          as: 'author', 
          attributes: ['id', 'firstName', 'lastName'] 
        }
      ]
    });
    
    console.log('\n=== ALL FORUM POSTS ===');
    console.log('Total posts:', posts.length);
    posts.forEach(p => {
      console.log(`- ${p.title} by ${p.author?.firstName} ${p.author?.lastName}`);
    });
    
    // Check course 1 specifically
    console.log('\n=== COURSE 1 FORUMS ===');
    const course1Forums = await models.Forum.findAll({
      where: { courseId: 1 },
      include: [
        { 
          model: models.Course, 
          as: 'course', 
          attributes: ['id', 'title'] 
        }
      ]
    });
    
    console.log('Course 1 forums:', course1Forums.length);
    course1Forums.forEach(f => {
      console.log(`- ${f.title} - Posts: ${f.postCount}`);
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkForums();
