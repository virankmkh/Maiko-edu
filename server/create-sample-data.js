const { sequelize } = require('./config/database');
const User = require('./models/User')(sequelize);
const Organization = require('./models/Organization')(sequelize);
const Course = require('./models/Course')(sequelize);

const createSampleData = async () => {
  try {
    console.log('Creating sample data...');
    
    // Create organization first
    const org = await Organization.create({
      name: 'Tech Academy DRC',
      description: 'Leading technology education in the Democratic Republic of Congo',
      website: 'https://techacademy-drc.com',
      email: 'info@techacademy-drc.com',
      phone: '+243987654321',
      address: 'Kinshasa, DRC',
      isActive: true
    });
    console.log('Organization created:', org.id);

    // Create instructor
    const instructor = await User.create({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@lecturer.com',
      password: 'lecturer123',
      role: 'instructor',
      organizationId: org.id,
      isVerified: true,
      isActive: true
    });
    console.log('Instructor created:', instructor.id);

    // Create students
    const students = await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.com',
        password: 'password123',
        role: 'student',
        isVerified: true,
        isActive: true
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@student.com',
        password: 'password123',
        role: 'student',
        isVerified: true,
        isActive: true
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@student.com',
        password: 'password123',
        role: 'student',
        isVerified: true,
        isActive: true
      }
    ]);
    console.log('Students created:', students.length);

    // Create courses
    const courses = await Course.bulkCreate([
      {
        title: 'React Fundamentals',
        subtitle: 'Learn React from scratch',
        description: 'A comprehensive course covering React basics, components, state management, and hooks.',
        shortDescription: 'Master React fundamentals with hands-on projects',
        organizationId: org.id,
        instructorId: instructor.id,
        category: 'Web Development',
        subcategory: 'Frontend',
        tags: ['react', 'javascript', 'frontend', 'web'],
        language: 'en',
        difficulty: 'beginner',
        level: 'basic',
        price: 99.99,
        currency: 'USD',
        duration: 480,
        totalLessons: 24,
        status: 'published',
        isActive: true,
        rating: 4.8,
        enrollmentCount: 15,
        slug: 'react-fundamentals'
      },
      {
        title: 'JavaScript Advanced',
        subtitle: 'Advanced JavaScript concepts and patterns',
        description: 'Deep dive into advanced JavaScript features, design patterns, and modern ES6+ syntax.',
        shortDescription: 'Advanced JavaScript for experienced developers',
        organizationId: org.id,
        instructorId: instructor.id,
        category: 'Web Development',
        subcategory: 'Programming',
        tags: ['javascript', 'es6', 'advanced', 'programming'],
        language: 'en',
        difficulty: 'advanced',
        level: 'expert',
        price: 149.99,
        currency: 'USD',
        duration: 720,
        totalLessons: 36,
        status: 'published',
        isActive: true,
        rating: 4.9,
        enrollmentCount: 8,
        slug: 'javascript-advanced'
      },
      {
        title: 'Node.js Backend Development',
        subtitle: 'Build robust backend applications',
        description: 'Learn to build scalable backend applications using Node.js, Express, and MongoDB.',
        shortDescription: 'Complete backend development with Node.js',
        organizationId: org.id,
        instructorId: instructor.id,
        category: 'Web Development',
        subcategory: 'Backend',
        tags: ['nodejs', 'express', 'mongodb', 'backend'],
        language: 'en',
        difficulty: 'intermediate',
        level: 'intermediate',
        price: 199.99,
        currency: 'USD',
        duration: 960,
        totalLessons: 48,
        status: 'published',
        isActive: true,
        rating: 4.7,
        enrollmentCount: 12,
        slug: 'nodejs-backend-development'
      }
    ]);
    console.log('Courses created:', courses.length);

    console.log('Sample data created successfully!');
    console.log('You can now test the instructor dashboard with real data.');
    
  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await sequelize.close();
  }
};

createSampleData();
