const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./config/database');

async function testStudentsAPI() {
  try {
    console.log('🧪 Testing Students API...\n');
    
    // Get the instructor user
    const instructor = await models.User.findOne({ 
      where: { email: 'sarah.johnson@lecturer.com' } 
    });
    
    if (!instructor) {
      console.log('❌ Instructor not found');
      return;
    }
    
    console.log('✅ Instructor found:', instructor.firstName, instructor.lastName);
    console.log('📧 Email:', instructor.email);
    console.log('🔑 Role:', instructor.role);
    
    // Test password verification
    const testPassword = 'lecturer123';
    const isPasswordValid = await bcrypt.compare(testPassword, instructor.password);
    
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
          
          // Test getting instructor's courses
          console.log('\n📚 Testing courses endpoint...');
          const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            console.log('✅ Courses fetched successfully!');
            console.log(`📊 Found ${coursesData.courses?.length || 0} courses`);
            
            if (coursesData.courses && coursesData.courses.length > 0) {
              const courseId = coursesData.courses[0].id;
              console.log(`\n🎯 Testing with course: ${coursesData.courses[0].title} (ID: ${courseId})`);
              
              // Test getting students for the course
              console.log('\n👥 Testing students endpoint...');
              const studentsResponse = await fetch(`http://localhost:5001/api/courses/${courseId}/students`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (studentsResponse.ok) {
                const studentsData = await studentsResponse.json();
                console.log('✅ Students data fetched successfully!');
                console.log('\n📊 Statistics:');
                console.log('- Total students:', studentsData.statistics?.totalStudents || 0);
                console.log('- Current students:', studentsData.statistics?.currentStudents || 0);
                console.log('- Completed students:', studentsData.statistics?.completedStudents || 0);
                
                console.log('\n👥 Student Lists:');
                console.log('- Total list length:', studentsData.students?.total?.length || 0);
                console.log('- Current list length:', studentsData.students?.current?.length || 0);
                console.log('- Completed list length:', studentsData.students?.completed?.length || 0);
                
                // Check student data structure
                if (studentsData.students?.total && studentsData.students.total.length > 0) {
                  console.log('\n📋 Sample student data structure:');
                  const sampleStudent = studentsData.students.total[0];
                  console.log(JSON.stringify(sampleStudent, null, 2));
                  
                  // Check required properties
                  const requiredProps = ['id', 'name', 'email', 'progress', 'enrolledAt'];
                  const missingProps = requiredProps.filter(prop => !sampleStudent.hasOwnProperty(prop));
                  
                  if (missingProps.length === 0) {
                    console.log('✅ All required properties present in student data');
                  } else {
                    console.log('❌ Missing properties in student data:', missingProps);
                  }
                } else {
                  console.log('⚠️ No students found in this course');
                }
                
                console.log('\n🎉 Students API test completed successfully!');
                
              } else {
                const errorText = await studentsResponse.text();
                console.log('❌ Students API failed:', studentsResponse.status, studentsResponse.statusText);
                console.log('Error:', errorText);
              }
            } else {
              console.log('⚠️ No courses found for this instructor');
            }
            
          } else {
            const errorText = await coursesResponse.text();
            console.log('❌ Courses API failed:', coursesResponse.status, coursesResponse.statusText);
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

testStudentsAPI();
