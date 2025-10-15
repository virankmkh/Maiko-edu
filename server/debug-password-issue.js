const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./config/database');

async function debugPasswordIssue() {
  try {
    console.log('🔍 Debugging password issue...\n');
    
    // Get the instructor
    const instructor = await models.User.findOne({ 
      where: { email: 'sarah.johnson@maiko.edu' } 
    });
    
    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }
    
    console.log('✅ Instructor found:');
    console.log('- Name:', instructor.firstName, instructor.lastName);
    console.log('- Email:', instructor.email);
    console.log('- Role:', instructor.role);
    console.log('- Password hash length:', instructor.password.length);
    console.log('- Password hash:', instructor.password);
    
    // Test different approaches
    const testPassword = 'password';
    console.log('\n🔐 Testing different password verification methods...');
    
    // Method 1: Direct bcrypt.compare
    console.log('1. Direct bcrypt.compare:');
    const directCompare = await bcrypt.compare(testPassword, instructor.password);
    console.log('   Result:', directCompare ? '✅ Valid' : '❌ Invalid');
    
    // Method 2: Using comparePassword method
    console.log('2. Using comparePassword method:');
    const methodCompare = await instructor.comparePassword(testPassword);
    console.log('   Result:', methodCompare ? '✅ Valid' : '❌ Invalid');
    
    // Method 3: Create a fresh hash and compare
    console.log('3. Fresh hash comparison:');
    const freshHash = await bcrypt.hash(testPassword, 10);
    const freshCompare = await bcrypt.compare(testPassword, freshHash);
    console.log('   Fresh hash:', freshHash);
    console.log('   Fresh compare result:', freshCompare ? '✅ Valid' : '❌ Invalid');
    
    // Method 4: Check if password contains any hidden characters
    console.log('4. Password analysis:');
    console.log('   Test password length:', testPassword.length);
    console.log('   Test password bytes:', Buffer.from(testPassword).toString('hex'));
    console.log('   Stored hash length:', instructor.password.length);
    console.log('   Stored hash starts with $2a$:', instructor.password.startsWith('$2a$'));
    
    // Method 5: Try updating password with fresh hash
    console.log('\n🔧 Updating password with fresh hash...');
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('New hash:', newHash);
    
    // Update using raw SQL to avoid any ORM issues
    await sequelize.query(
      'UPDATE users SET password = ? WHERE id = ?',
      {
        replacements: [newHash, instructor.id],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('✅ Password updated via raw SQL');
    
    // Test the updated password
    const updatedInstructor = await models.User.findByPk(instructor.id);
    const updatedCompare = await updatedInstructor.comparePassword(testPassword);
    console.log('Updated password test:', updatedCompare ? '✅ Valid' : '❌ Invalid');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugPasswordIssue();
