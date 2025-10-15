const { sequelize, models } = require('./config/database');
const bcrypt = require('bcryptjs');

async function fixInstructorPassword() {
  try {
    console.log('🔧 Fixing instructor password...\n');

    // Find the instructor
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@lecturer.com' }
    });

    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }

    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);

    // Hash the correct password
    const hashedPassword = await bcrypt.hash('lecturer123', 10);
    
    // Update the password directly in the database
    await models.User.update(
      { password: hashedPassword },
      { where: { id: instructor.id } }
    );
    
    console.log('✅ Password updated successfully');

    // Reload the instructor to get the updated password
    await instructor.reload();
    
    // Test the password
    const isPasswordValid = await bcrypt.compare('lecturer123', instructor.password);
    console.log('🔐 Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    // Also test with the old password
    const isOldPasswordValid = await bcrypt.compare('password', instructor.password);
    console.log('🔐 Old password test:', isOldPasswordValid ? '✅ Valid' : '❌ Invalid');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixInstructorPassword();
