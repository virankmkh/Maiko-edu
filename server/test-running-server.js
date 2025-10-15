const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRunningServer() {
  try {
    console.log('🔍 Testing the server running on port 5001...\n');

    // Test 1: Check if server is responding
    console.log('1. Testing server health...');
    try {
      const healthResponse = await fetch('http://localhost:5001/api/test');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Server is healthy:', healthData);
      } else {
        console.log('❌ Health check failed:', healthResponse.status);
      }
    } catch (error) {
      console.log('❌ Health check error:', error.message);
    }

    // Test 2: Try to login with the email you see in your dashboard
    console.log('\n2. Testing login with sarah.johnson@lecturer.com...');
    try {
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
        console.log('✅ Login successful with sarah.johnson@lecturer.com!');
        console.log('User:', loginData.user);
        
        // Test 3: Get courses for this instructor
        console.log('\n3. Getting courses for this instructor...');
        const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
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
              console.log(`  Students: ${course.totalStudents || 0}`);
              console.log(`  Price: $${course.price || 0}`);
            });
          }
        } else {
          console.log('❌ Courses API failed:', coursesResponse.status);
          const errorText = await coursesResponse.text();
          console.log('Error:', errorText);
        }
      } else {
        console.log('❌ Login failed with sarah.johnson@maiko.edu');
        const errorText = await loginResponse.text();
        console.log('Error:', errorText);
        
        // Try with different password
        console.log('\nTrying with password "lecturer123"...');
        const loginResponse2 = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'sarah.johnson@maiko.edu',
            password: 'lecturer123'
          })
        });

        if (loginResponse2.ok) {
          console.log('✅ Login successful with lecturer123!');
        } else {
          console.log('❌ Login failed with both passwords');
        }
      }
    } catch (error) {
      console.log('❌ Login error:', error.message);
    }

    // Test 4: Check what users exist (using the token from login)
    console.log('\n4. Checking what users exist...');
    try {
      // First get a token by logging in
      const loginForToken = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'sarah.johnson@lecturer.com',
          password: 'lecturer123'
        })
      });

      if (loginForToken.ok) {
        const loginData = await loginForToken.json();
        const token = loginData.token;

        const usersResponse = await fetch('http://localhost:5001/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log('✅ Users API successful!');
          console.log(`Found ${usersData.users?.length || 0} users:`);
          
          if (usersData.users) {
            usersData.users.slice(0, 5).forEach(user => {
              console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - ${user.role}`);
            });
            if (usersData.users.length > 5) {
              console.log(`... and ${usersData.users.length - 5} more users`);
            }
          }
        } else {
          console.log('❌ Users API failed:', usersResponse.status);
          const errorText = await usersResponse.text();
          console.log('Error:', errorText);
        }
      } else {
        console.log('❌ Could not get token for users API');
      }
    } catch (error) {
      console.log('❌ Users API error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRunningServer();
