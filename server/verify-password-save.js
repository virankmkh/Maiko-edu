const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./config/database');

async function verifyPasswordSave() {
  try {
    console.log('🔍 Verifying password save...\n');
    
    // Get the instructor fresh from database
    const instructor = await models.User.findOne({ 
      where: { email: 'sarah.johnson@maiko.edu' } 
    });
    
    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }
    
    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);
    console.log('🔑 Password hash from DB:', instructor.password);
    
    // Test password verification
    const testPassword = 'password';
    const isPasswordValid = await bcrypt.compare(testPassword, instructor.password);
    console.log('🔐 Password verification:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    // Let's try a different approach - create a completely new user
    console.log('\n🆕 Creating a new test user...');
    
    const testUser = await models.User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      role: 'instructor',
      isActive: true,
      organizationId: instructor.organizationId,
      emailVerified: true
    });
    
    console.log('✅ Test user created');
    
    // Test the new user's password
    const isTestPasswordValid = await bcrypt.compare('password', testUser.password);
    console.log('🔐 Test user password:', isTestPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    // Clean up test user
    await testUser.destroy();
    console.log('🧹 Test user cleaned up');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyPasswordSave();
