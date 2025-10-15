const { sequelize, models } = require('./config/database');

async function testSimpleStudentsAPI() {
  try {
    console.log('🧪 Testing Simple Students API...\n');

    // Get the instructor
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@lecturer.com' }
    });

    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }

    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);

    // Test password verification
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare('lecturer123', instructor.password);
    console.log('🔐 Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');

    if (isPasswordValid) {
      // Test API login endpoint
      console.log('\n🌐 Testing API login...');
      
      try {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        
        const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'sarah.johnson@lecturer.com',
            password: 'lecturer123'
          })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('✅ API Login successful!');
          const token = loginData.token;
          
          // Test the simple students endpoint
          console.log('\n👥 Testing simple students endpoint...');
          const studentsResponse = await fetch('http://localhost:5001/api/simple-students/1', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            console.log('✅ Simple students API successful!');
            console.log('\n📊 Response:');
            console.log(JSON.stringify(studentsData, null, 2));
          } else {
            const errorText = await studentsResponse.text();
            console.log('❌ Simple students API failed:', studentsResponse.status, studentsResponse.statusText);
            console.log('Error:', errorText);
          }
          
        } else {
          const errorText = await loginResponse.text();
          console.log('❌ API Login failed:', loginResponse.status, loginResponse.statusText);
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
    console.error('Stack trace:', error.stack);
  }
}

testSimpleStudentsAPI();
