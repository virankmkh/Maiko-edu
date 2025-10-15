const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./config/database');

async function checkInstructorLogin() {
  try {
    console.log('🔍 Checking instructor login...\n');
    
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
    console.log('- Password hash:', instructor.password);
    
    // Test password verification
    const testPassword = 'password';
    console.log('\n🔐 Testing password verification...');
    
    const isPasswordValid = await bcrypt.compare(testPassword, instructor.password);
    console.log('Password test result:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    if (!isPasswordValid) {
      console.log('\n🔧 Fixing password...');
      const newHash = await bcrypt.hash(testPassword, 10);
      instructor.password = newHash;
      await instructor.save();
      
      console.log('✅ Password updated');
      
      // Test again
      const isNewPasswordValid = await bcrypt.compare(testPassword, instructor.password);
      console.log('New password test:', isNewPasswordValid ? '✅ Valid' : '❌ Invalid');
    }
    
    // Test the actual login endpoint
    console.log('\n🌐 Testing login endpoint...');
    
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
        console.log('User:', data.user.firstName, data.user.lastName);
        console.log('Role:', data.user.role);
        console.log('Token length:', data.token ? data.token.length : 'No token');
      } else {
        const errorText = await response.text();
        console.log('❌ API Login failed:', response.status, response.statusText);
        console.log('Error details:', errorText);
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

checkInstructorLogin();
