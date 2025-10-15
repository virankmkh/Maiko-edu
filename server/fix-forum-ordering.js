const { sequelize, models } = require('./config/database');

async function fixForumOrdering() {
  try {
    console.log('🔧 Fixing Forum Ordering...\n');
    
    // Update lastActivityAt for forums that have posts
    const forums = await models.Forum.findAll({
      where: { courseId: 1 }
    });
    
    for (const forum of forums) {
      // Get the latest post for this forum
      const latestPost = await models.ForumPost.findOne({
        where: { forumId: forum.id },
        order: [['createdAt', 'DESC']]
      });
      
      if (latestPost) {
        forum.lastActivityAt = latestPost.createdAt;
        await forum.save();
        console.log(`Updated ${forum.title} lastActivityAt to ${latestPost.createdAt}`);
      } else {
        // Set to forum creation date if no posts
        forum.lastActivityAt = forum.createdAt;
        await forum.save();
        console.log(`Set ${forum.title} lastActivityAt to creation date`);
      }
    }
    
    // Test the new ordering
    console.log('\n=== NEW FORUM ORDERING ===');
    const orderedForums = await models.Forum.findAll({
      where: { courseId: 1, isActive: true },
      order: [['isPinned', 'DESC'], ['lastActivityAt', 'DESC']]
    });
    
    orderedForums.forEach(f => {
      console.log(`- ${f.title} (Posts: ${f.postCount}, Last Activity: ${f.lastActivityAt})`);
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixForumOrdering();
