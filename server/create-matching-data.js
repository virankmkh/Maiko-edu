const { sequelize, models } = require('./config/database');
const bcrypt = require('bcryptjs');

async function createMatchingData() {
  try {
    console.log('🔧 Creating the data that matches your dashboard...\n');

    // 1. Create the instructor account you're using
    console.log('1. Creating sarah.johnson@maiko.edu instructor...');
    
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const instructor = await models.User.create({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@maiko.edu',
      password: hashedPassword,
      role: 'instructor',
      organizationId: 1,
      isVerified: true
    });

    console.log(`✅ Created instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.email})`);

    // 2. Create the courses you see in your dashboard
    console.log('\n2. Creating courses...');
    
    const courses = [
      {
        title: 'test',
        description: 'testing',
        price: 5.00,
        status: 'published',
        instructorId: instructor.id,
        organizationId: 1,
        slug: 'test-course',
        category: 'technology',
        difficulty: 'beginner',
        language: 'en',
        providesCertificate: true
      },
      {
        title: 'React Fundamentals',
        description: 'Learn the basics of React.js from scratch',
        price: 15.00,
        status: 'published',
        instructorId: instructor.id,
        organizationId: 1,
        slug: 'react-fundamentals',
        category: 'technology',
        difficulty: 'beginner',
        language: 'en',
        providesCertificate: true
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build robust backend applications with Node.js',
        price: 15.00,
        status: 'published',
        instructorId: instructor.id,
        organizationId: 1,
        slug: 'nodejs-backend-development',
        category: 'technology',
        difficulty: 'intermediate',
        language: 'en',
        providesCertificate: true
      }
    ];

    const createdCourses = [];
    for (const courseData of courses) {
      const course = await models.Course.create(courseData);
      createdCourses.push(course);
      console.log(`✅ Created course: "${course.title}" (ID: ${course.id})`);
    }

    // 3. Create students
    console.log('\n3. Creating students...');
    
    const students = [];
    for (let i = 1; i <= 19; i++) {
      const student = await models.User.create({
        firstName: `Student${i}`,
        lastName: 'Name',
        email: `student${i}@example.com`,
        password: hashedPassword,
        role: 'student',
        organizationId: 1,
        isVerified: true
      });
      students.push(student);
    }

    console.log(`✅ Created ${students.length} students`);

    // 4. Create enrollments
    console.log('\n4. Creating enrollments...');
    
    // Enroll students in courses
    const enrollments = [];
    
    // Course 1: "test" - 5 students
    for (let i = 0; i < 5; i++) {
      const enrollment = await models.CourseEnrollment.create({
        courseId: createdCourses[0].id,
        userId: students[i].id,
        status: 'active',
        enrolledAt: new Date(),
        progress: Math.floor(Math.random() * 100)
      });
      enrollments.push(enrollment);
    }

    // Course 2: "React Fundamentals" - 3 students
    for (let i = 5; i < 8; i++) {
      const enrollment = await models.CourseEnrollment.create({
        courseId: createdCourses[1].id,
        userId: students[i].id,
        status: 'active',
        enrolledAt: new Date(),
        progress: Math.floor(Math.random() * 100)
      });
      enrollments.push(enrollment);
    }

    // Course 3: "Node.js Backend Development" - 2 students
    for (let i = 8; i < 10; i++) {
      const enrollment = await models.CourseEnrollment.create({
        courseId: createdCourses[2].id,
        userId: students[i].id,
        status: 'active',
        enrolledAt: new Date(),
        progress: Math.floor(Math.random() * 100)
      });
      enrollments.push(enrollment);
    }

    console.log(`✅ Created ${enrollments.length} enrollments`);

    // 5. Test the API
    console.log('\n5. Testing the API with new data...');
    
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sarah.johnson@maiko.edu',
        password: 'password'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful with new account!');
      
      const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log('✅ Courses API successful!');
        
        const activeCourses = coursesData.courses?.filter(course => course.status === 'published' || course.status === 'draft').length || 0;
        const enrolledStudents = coursesData.courses?.reduce((total, course) => total + (course.currentEnrollments || 0), 0) || 0;
        const totalEarnings = coursesData.courses?.reduce((total, course) => total + parseFloat(course.earnings || 0), 0) || 0;

        console.log('\n📊 New dashboard stats:');
        console.log(`   Active Courses: ${activeCourses}`);
        console.log(`   Enrolled Students: ${enrolledStudents}`);
        console.log(`   Total Earnings: $${totalEarnings}`);
      }
    }

    console.log('\n🎉 Data creation complete!');
    console.log('Now you can:');
    console.log('1. Log out of your current session');
    console.log('2. Log in with: sarah.johnson@maiko.edu / password');
    console.log('3. The student list should now work!');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createMatchingData();
