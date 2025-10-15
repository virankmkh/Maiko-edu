const jwt = require('jsonwebtoken');
const { sequelize, models } = require('./config/database');

async function testAPIEndpoint() {
  try {
    console.log('🧪 Testing API Endpoint...\n');
    
    // Get instructor user
    const instructor = await models.User.findOne({ where: { role: 'instructor' } });
    if (!instructor) {
      console.log('❌ No instructor found');
      return;
    }
    
    // Create a test token
    const token = jwt.sign(
      { 
        id: instructor.id, 
        email: instructor.email, 
        role: instructor.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('Test token created for:', instructor.firstName, instructor.lastName);
    console.log('Token:', token.substring(0, 50) + '...');
    
    // Test the API endpoint
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    
    try {
      const response = await fetch('http://localhost:5000/api/forums/course/1', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log('❌ API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.log('Error details:', errorText);
        return;
      }
      
      const data = await response.json();
      console.log('✅ API Response successful');
      console.log('Forums returned:', data.length);
      data.forEach(f => {
        console.log(`- ${f.title} (Posts: ${f.postCount})`);
      });
      
    } catch (fetchError) {
      console.log('❌ Fetch Error:', fetchError.message);
      console.log('Make sure the server is running on port 5000');
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPIEndpoint();
