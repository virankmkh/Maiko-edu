const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./config/database');

async function updateInstructorPassword() {
  try {
    console.log('🔧 Updating instructor password...\n');
    
    // Get the instructor
    const instructor = await models.User.findOne({ 
      where: { email: 'sarah.johnson@maiko.edu' } 
    });
    
    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }
    
    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);
    
    // Create a fresh hash
    const newPassword = 'password';
    const newHash = await bcrypt.hash(newPassword, 10);
    console.log('🔑 New hash created:', newHash);
    
    // Test the new hash before saving
    const isNewHashValid = await bcrypt.compare(newPassword, newHash);
    console.log('🧪 New hash test:', isNewHashValid ? '✅ Valid' : '❌ Invalid');
    
    // Update the password using raw SQL to avoid any ORM issues
    await sequelize.query(
      'UPDATE users SET password = ? WHERE id = ?',
      {
        replacements: [newHash, instructor.id],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('💾 Password updated in database');
    
    // Verify the update by reading the user again
    const updatedInstructor = await models.User.findByPk(instructor.id);
    console.log('🔍 Updated password hash:', updatedInstructor.password);
    
    // Test the updated password
    const isUpdatedValid = await bcrypt.compare(newPassword, updatedInstructor.password);
    console.log('🔐 Updated password test:', isUpdatedValid ? '✅ Valid' : '❌ Invalid');
    
    // Test API login
    console.log('\n🌐 Testing API login...');
    
    try {
      const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
      
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'sarah.johnson@maiko.edu',
          password: 'password'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Login successful!');
        console.log('Response:', JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        console.log('❌ API Login failed:', response.status, response.statusText);
        console.log('Error:', errorText);
      }
    } catch (fetchError) {
      console.log('❌ API Error:', fetchError.message);
      console.log('Make sure the server is running on port 5001');
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateInstructorPassword();
