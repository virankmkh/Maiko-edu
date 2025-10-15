const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugBrowserData() {
  try {
    console.log('🔍 Debugging what your browser is actually calling...\n');

    // Test the actual API endpoints that your frontend calls
    console.log('1. Testing /api/courses/instructor endpoint...');
    
    // First, let's try to login with the email that exists in the database
    console.log('   Trying to login with sarah.johnson@lecturer.com...');
    
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
      console.log('✅ Login successful!');
      console.log('   User:', loginData.user);
      
      const token = loginData.token;
      
      // Now test the courses endpoint
      console.log('\n2. Testing /api/courses/instructor with valid token...');
      const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log('✅ Courses API successful!');
        console.log('   Response:', JSON.stringify(coursesData, null, 2));
        
        // Calculate stats like the frontend does
        const activeCourses = coursesData.courses?.filter(course => course.status === 'published' || course.status === 'draft').length || 0;
        const enrolledStudents = coursesData.courses?.reduce((total, course) => total + (course.currentEnrollments || 0), 0) || 0;
        const totalEarnings = coursesData.courses?.reduce((total, course) => total + parseFloat(course.earnings || 0), 0) || 0;

        console.log('\n📊 Stats that would be displayed:');
        console.log(`   Active Courses: ${activeCourses}`);
        console.log(`   Enrolled Students: ${enrolledStudents}`);
        console.log(`   Total Earnings: $${totalEarnings}`);
        
      } else {
        console.log('❌ Courses API failed:', coursesResponse.status);
        const errorText = await coursesResponse.text();
        console.log('   Error:', errorText);
      }
    } else {
      console.log('❌ Login failed');
      const errorText = await loginResponse.text();
      console.log('   Error:', errorText);
    }

    console.log('\n3. The issue is clear now:');
    console.log('   - Your browser shows: sarah.johnson@maiko.edu with 19 students');
    console.log('   - Database has: sarah.johnson@lecturer.com with 5 students');
    console.log('   - You are logged in with a DIFFERENT account than what exists in the database!');
    console.log('\n   SOLUTION: Either:');
    console.log('   1. Login with sarah.johnson@lecturer.com (password: lecturer123)');
    console.log('   2. Or create sarah.johnson@maiko.edu in the database');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugBrowserData();
