const { sequelize, models } = require('./config/database');

async function checkSpecificUser() {
  try {
    console.log('🔍 Checking for specific user: sarah.johnson@maiko.edu\n');

    // Search for the specific email
    const user = await models.User.findOne({
      where: { email: 'sarah.johnson@maiko.edu' }
    });

    if (user) {
      console.log('✅ Found user:');
      console.log(`- ID: ${user.id}`);
      console.log(`- Name: ${user.firstName} ${user.lastName}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Active: ${user.isActive}`);
    } else {
      console.log('❌ User not found with email: sarah.johnson@maiko.edu');
    }

    // Also check for any email containing 'maiko.edu'
    console.log('\n🔍 Searching for any emails containing "maiko.edu"...');
    const usersWithMaikoEdu = await models.User.findAll({
      where: {
        email: {
          [require('sequelize').Op.like]: '%maiko.edu%'
        }
      }
    });

    if (usersWithMaikoEdu.length > 0) {
      console.log(`✅ Found ${usersWithMaikoEdu.length} user(s) with maiko.edu email:`);
      usersWithMaikoEdu.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.log('❌ No users found with maiko.edu email');
    }

    // Check all instructor emails
    console.log('\n👨‍🏫 All instructor emails:');
    const instructors = await models.User.findAll({
      where: { role: 'instructor' }
    });
    
    instructors.forEach(instructor => {
      console.log(`- ${instructor.email}`);
    });

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSpecificUser();
