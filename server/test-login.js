const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./config/database');

async function testLogin() {
  try {
    console.log('🔐 Testing Login...\n');
    
    // Get the instructor user
    const instructor = await models.User.findOne({ 
      where: { email: 'sarah.johnson@maiko.edu' } 
    });
    
    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }
    
    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);
    console.log('📧 Email:', instructor.email);
    console.log('🔑 Role:', instructor.role);
    
    // Test password verification
    const testPassword = 'password';
    const isPasswordValid = await bcrypt.compare(testPassword, instructor.password);
    
    console.log('🔐 Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    if (isPasswordValid) {
      // Create a JWT token
      const token = jwt.sign(
        { 
          id: instructor.id, 
          email: instructor.email, 
          role: instructor.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );
      
      console.log('🎫 Token created successfully');
      console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
      
      // Test API login endpoint
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
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
