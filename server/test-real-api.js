const { sequelize, models } = require('./config/database');

async function testRealAPI() {
  try {
    console.log('🧪 Testing the REAL API that your frontend uses...\n');

    // First, let's find the correct instructor
    console.log('1. Looking for sarah.johnson@maiko.edu...');
    const instructor = await models.User.findOne({
      where: { email: 'sarah.johnson@maiko.edu' }
    });

    if (!instructor) {
      console.log('❌ sarah.johnson@maiko.edu not found');
      console.log('Let me check all instructor emails...');
      
      const allInstructors = await models.User.findAll({
        where: { role: 'instructor' }
      });
      
      console.log('Available instructors:');
      allInstructors.forEach(inst => {
        console.log(`- ${inst.email} (${inst.firstName} ${inst.lastName})`);
      });
      
      return;
    }

    console.log(`✅ Found instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);

    // Test the courses/instructor endpoint
    console.log('\n2. Testing /api/courses/instructor endpoint...');
    
    try {
      const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
      
      // Login first
      const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: instructor.email,
          password: 'password' // Try common passwords
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful!');
        const token = loginData.token;

        // Get instructor's courses
        const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          console.log('✅ Courses API successful!');
          console.log(`Found ${coursesData.courses?.length || 0} courses:`);
          
          if (coursesData.courses) {
            coursesData.courses.forEach(course => {
              console.log(`- "${course.title}" (ID: ${course.id})`);
            });
          }
        } else {
          console.log('❌ Courses API failed:', coursesResponse.status);
        }
      } else {
        console.log('❌ Login failed - trying different password...');
        
        // Try with lecturer123
        const loginResponse2 = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: instructor.email,
            password: 'lecturer123'
          })
        });

        if (loginResponse2.ok) {
          console.log('✅ Login successful with lecturer123!');
        } else {
          console.log('❌ Login failed with both passwords');
        }
      }
    } catch (fetchError) {
      console.log('❌ API Error:', fetchError.message);
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealAPI();
