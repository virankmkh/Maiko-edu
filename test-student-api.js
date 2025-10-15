const fetch = require('node-fetch');

async function testStudentAPI() {
  try {
    console.log('🧪 Testing Student API...\n');

    // Step 1: Login as instructor
    console.log('1. Logging in as instructor...');
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

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // Step 2: Get instructor's courses
    console.log('\n2. Getting instructor courses...');
    const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!coursesResponse.ok) {
      throw new Error(`Courses fetch failed: ${coursesResponse.status} ${coursesResponse.statusText}`);
    }

    const coursesData = await coursesResponse.json();
    console.log(`✅ Found ${coursesData.courses?.length || 0} courses`);

    if (coursesData.courses && coursesData.courses.length > 0) {
      const courseId = coursesData.courses[0].id;
      console.log(`📚 Testing with course: ${coursesData.courses[0].title} (ID: ${courseId})`);

      // Step 3: Get students for the first course
      console.log('\n3. Getting students for course...');
      const studentsResponse = await fetch(`http://localhost:5001/api/courses/${courseId}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!studentsResponse.ok) {
        throw new Error(`Students fetch failed: ${studentsResponse.status} ${studentsResponse.statusText}`);
      }

      const studentsData = await studentsResponse.json();
      console.log('✅ Students data received:');
      console.log('📊 Statistics:', studentsData.statistics);
      console.log('👥 Total students:', studentsData.students?.total?.length || 0);
      console.log('📖 Current students:', studentsData.students?.current?.length || 0);
      console.log('🎓 Completed students:', studentsData.students?.completed?.length || 0);

      // Step 4: Check student data structure
      if (studentsData.students?.total && studentsData.students.total.length > 0) {
        console.log('\n4. Checking student data structure...');
        const sampleStudent = studentsData.students.total[0];
        console.log('📋 Sample student data:');
        console.log('- ID:', sampleStudent.id);
        console.log('- Name:', sampleStudent.name);
        console.log('- Email:', sampleStudent.email);
        console.log('- Progress:', sampleStudent.progress);
        console.log('- Enrolled At:', sampleStudent.enrolledAt);
        console.log('- Last Accessed:', sampleStudent.lastAccessedAt);
        console.log('- Avatar:', sampleStudent.avatar);

        // Check if all required properties exist
        const requiredProps = ['id', 'name', 'email', 'progress', 'enrolledAt'];
        const missingProps = requiredProps.filter(prop => !sampleStudent.hasOwnProperty(prop));
        
        if (missingProps.length === 0) {
          console.log('✅ All required properties present');
        } else {
          console.log('❌ Missing properties:', missingProps);
        }
      } else {
        console.log('⚠️ No students found in this course');
      }
    } else {
      console.log('⚠️ No courses found for this instructor');
    }

    console.log('\n🎉 API test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testStudentAPI();
