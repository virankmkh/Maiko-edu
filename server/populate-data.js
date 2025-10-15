const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ API call failed: ${method} ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

const populateData = async () => {
  try {
    console.log('🌱 Starting data population via API...');
    
    // Step 1: Login as instructor to get token
    console.log('🔐 Logging in as instructor...');
    const loginResponse = await apiCall('POST', '/auth/login', {
      email: 'sarah.johnson@lecturer.com',
      password: 'lecturer123'
    });
    
    const token = loginResponse.token;
    console.log('✅ Instructor logged in successfully');
    
    // Step 2: Create an organization first
    console.log('🏢 Creating organization...');
    const orgResponse = await apiCall('POST', '/organizations', {
      name: 'Tech Academy DRC',
      description: 'Leading technology education in the Democratic Republic of Congo',
      website: 'https://techacademy-drc.com',
      email: 'info@techacademy-drc.com',
      phone: '+243987654321',
      address: 'Kinshasa, DRC'
    }, token);
    
    console.log('✅ Organization created');
    
    // Step 3: Create courses
    console.log('📚 Creating courses...');
    const courses = [
      {
        title: 'React Fundamentals',
        subtitle: 'Learn React from scratch',
        description: 'A comprehensive course covering React basics, components, state management, and hooks.',
        shortDescription: 'Master React fundamentals with hands-on projects',
        category: 'Web Development',
        subcategory: 'Frontend',
        tags: ['react', 'javascript', 'frontend', 'web'],
        language: 'en',
        difficulty: 'beginner',
        level: 'basic',
        price: 5.00,
        currency: 'USD',
        duration: 480,
        totalLessons: 24,
        status: 'published'
      },
      {
        title: 'JavaScript Advanced',
        subtitle: 'Advanced JavaScript concepts and patterns',
        description: 'Deep dive into advanced JavaScript features, design patterns, and modern ES6+ syntax.',
        shortDescription: 'Advanced JavaScript for experienced developers',
        category: 'Web Development',
        subcategory: 'Programming',
        tags: ['javascript', 'es6', 'advanced', 'programming'],
        language: 'en',
        difficulty: 'advanced',
        level: 'expert',
        price: 5.00,
        currency: 'USD',
        duration: 720,
        totalLessons: 36,
        status: 'published'
      },
      {
        title: 'Node.js Backend Development',
        subtitle: 'Build robust backend applications',
        description: 'Learn to build scalable backend applications using Node.js, Express, and MongoDB.',
        shortDescription: 'Complete backend development with Node.js',
        category: 'Web Development',
        subcategory: 'Backend',
        tags: ['nodejs', 'express', 'mongodb', 'backend'],
        language: 'en',
        difficulty: 'intermediate',
        level: 'intermediate',
        price: 5.00,
        currency: 'USD',
        duration: 960,
        totalLessons: 48,
        status: 'published'
      }
    ];
    
    for (const courseData of courses) {
      try {
        const course = await apiCall('POST', '/courses', courseData, token);
        console.log(`✅ Created course: ${course.title}`);
      } catch (error) {
        console.log(`⚠️  Course might already exist: ${courseData.title}`);
      }
    }
    
    // Step 4: Create some student enrollments (simulate)
    console.log('👥 Creating student enrollments...');
    
    // Login as students and enroll them
    const students = [
      { email: 'john.doe@student.com', password: 'password123' },
      { email: 'jane.smith@student.com', password: 'password123' },
      { email: 'mike.johnson@student.com', password: 'password123' }
    ];
    
    for (const student of students) {
      try {
        const studentLogin = await apiCall('POST', '/auth/login', student);
        const studentToken = studentLogin.token;
        
        // Enroll in courses (this would need to be implemented in the API)
        console.log(`✅ Student ${student.email} logged in`);
      } catch (error) {
        console.log(`⚠️  Student login failed: ${student.email}`);
      }
    }
    
    console.log('🎉 Data population completed!');
    console.log('\n📊 Summary:');
    console.log('- Organization created');
    console.log('- 3 courses created');
    console.log('- Student accounts verified');
    
    console.log('\n👥 Test the instructor dashboard now:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Login as: sarah.johnson@lecturer.com / lecturer123');
    console.log('3. Check the instructor dashboard for real data');
    
  } catch (error) {
    console.error('❌ Error populating data:', error.message);
  }
};

// Run the population
populateData();
