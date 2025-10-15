const { sequelize, models } = require('./config/database');
const bcrypt = require('bcryptjs');

async function debugPassword() {
  try {
    console.log('🔍 Debugging password...\n');

    // Find the instructor
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@lecturer.com' }
    });

    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }

    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);
    console.log('📧 Email:', instructor.email);
    console.log('🔑 Stored password hash:', instructor.password);
    console.log('🔑 Password length:', instructor.password.length);

    // Test with different passwords
    const passwords = ['lecturer123', 'password', 'password123', 'admin123'];
    
    for (const pwd of passwords) {
      const isValid = await bcrypt.compare(pwd, instructor.password);
      console.log(`🔐 Testing "${pwd}":`, isValid ? '✅ Valid' : '❌ Invalid');
    }

    // Create a new hash and test it
    console.log('\n🆕 Creating new hash...');
    const newHash = await bcrypt.hash('lecturer123', 10);
    console.log('🔑 New hash:', newHash);
    
    const isNewHashValid = await bcrypt.compare('lecturer123', newHash);
    console.log('🔐 New hash test:', isNewHashValid ? '✅ Valid' : '❌ Invalid');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugPassword();