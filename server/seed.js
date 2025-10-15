const { sequelize } = require('./config/database');
const User = require('./models/User')(sequelize);
const Organization = require('./models/Organization')(sequelize);
const Course = require('./models/Course')(sequelize);
const Affiliate = require('./models/Affiliate')(sequelize);

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create organizations
    const organizations = await Organization.bulkCreate([
      {
        name: 'Tech Academy DRC',
        description: 'Leading technology education in the Democratic Republic of Congo',
        website: 'https://techacademy-drc.com',
        email: 'info@techacademy-drc.com',
        phone: '+243987654321',
        address: 'Kinshasa, DRC',
        isActive: true
      },
      {
        name: 'Maiko EDU',
        description: 'Online learning platform for the Congolese diaspora',
        website: 'https://maikoedu.com',
        email: 'info@maikoedu.com',
        phone: '+243123456789',
        address: 'Global',
        isActive: true
      }
    ]);
    console.log('✅ Organizations created');

    // Create users
    const users = await User.bulkCreate([
      // Students
      {
        firstName: 'Vira',
        lastName: 'Neema',
        email: 'vn@adn.presidence.cd',
        password: 'password123',
        role: 'student',
        isVerified: true,
        isActive: true
      },
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
      },
      // Instructors
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@lecturer.com',
        password: 'lecturer123',
        role: 'instructor',
        organizationId: organizations[0].id,
        isVerified: true,
        isActive: true
      },
      {
        firstName: 'Prof. Jean',
        lastName: 'Mukamba',
        email: 'jean.mukamba@techacademy-drc.com',
        password: 'admin123',
        role: 'organization_admin',
        organizationId: organizations[0].id,
        isVerified: true,
        isActive: true
      }
    ]);
    console.log('✅ Users created');

    // Generate affiliate codes for students
    for (let i = 0; i < 4; i++) {
      users[i].affiliateCode = users[i].generateAffiliateCode();
      await users[i].save();
    }

    // Create affiliate profiles for students
    await Affiliate.bulkCreate([
      { affiliateId: users[0].id, affiliateCode: users[0].affiliateCode },
      { affiliateId: users[1].id, affiliateCode: users[1].affiliateCode },
      { affiliateId: users[2].id, affiliateCode: users[2].affiliateCode },
      { affiliateId: users[3].id, affiliateCode: users[3].affiliateCode }
    ]);
    console.log('✅ Affiliate profiles created');

    // Create courses
    const courses = await Course.bulkCreate([
      {
        title: 'React Fundamentals',
        subtitle: 'Learn React from scratch',
        description: 'A comprehensive course covering React basics, components, state management, and hooks.',
        shortDescription: 'Master React fundamentals with hands-on projects',
        organizationId: organizations[0].id,
        instructorId: users[4].id, // Dr. Sarah Johnson
        category: 'technology',
        subcategory: 'Frontend',
        tags: ['react', 'javascript', 'frontend', 'web'],
        language: 'en',
        difficulty: 'beginner',
        level: 'basic',
        price: 99.99,
        currency: 'USD',
        duration: 480, // 8 hours
        totalLessons: 24,
        status: 'published',
        isActive: true,
        rating: 4.8,
        enrollmentCount: 15
      },
      {
        title: 'JavaScript Advanced',
        subtitle: 'Advanced JavaScript concepts and patterns',
        description: 'Deep dive into advanced JavaScript features, design patterns, and modern ES6+ syntax.',
        shortDescription: 'Advanced JavaScript for experienced developers',
        organizationId: organizations[0].id,
        instructorId: users[4].id, // Dr. Sarah Johnson
        category: 'technology',
        subcategory: 'Programming',
        tags: ['javascript', 'es6', 'advanced', 'programming'],
        language: 'en',
        difficulty: 'advanced',
        level: 'expert',
        price: 149.99,
        currency: 'USD',
        duration: 720, // 12 hours
        totalLessons: 36,
        status: 'published',
        isActive: true,
        rating: 4.9,
        enrollmentCount: 8
      },
      {
        title: 'Node.js Backend Development',
        subtitle: 'Build robust backend applications',
        description: 'Learn to build scalable backend applications using Node.js, Express, and MongoDB.',
        shortDescription: 'Complete backend development with Node.js',
        organizationId: organizations[0].id,
        instructorId: users[4].id, // Dr. Sarah Johnson
        category: 'technology',
        subcategory: 'Backend',
        tags: ['nodejs', 'express', 'mongodb', 'backend'],
        language: 'en',
        difficulty: 'intermediate',
        level: 'intermediate',
        price: 199.99,
        currency: 'USD',
        duration: 960, // 16 hours
        totalLessons: 48,
        status: 'published',
        isActive: true,
        rating: 4.7,
        enrollmentCount: 12
      },
      {
        title: 'Python for Data Science',
        subtitle: 'Data analysis and machine learning with Python',
        description: 'Learn Python programming for data science, including pandas, numpy, and scikit-learn.',
        shortDescription: 'Python programming for data science and ML',
        organizationId: organizations[1].id,
        instructorId: users[5].id, // Prof. Jean Mukamba
        category: 'technology',
        subcategory: 'Programming',
        tags: ['python', 'data-science', 'machine-learning', 'pandas'],
        language: 'en',
        difficulty: 'intermediate',
        level: 'intermediate',
        price: 179.99,
        currency: 'USD',
        duration: 840, // 14 hours
        totalLessons: 42,
        status: 'published',
        isActive: true,
        rating: 4.6,
        enrollmentCount: 20
      },
      // Arts & Compétences Créatives courses
      {
        title: 'Foundations of Graphic Design',
        subtitle: 'Core principles of design, typography, color theory, and visual hierarchy',
        description: 'Learn the fundamental principles of graphic design including typography, color theory, layout, and visual hierarchy. This course covers essential design concepts using industry-standard software like Figma and Adobe Illustrator.',
        shortDescription: 'Master the core principles of graphic design with Figma and Adobe Illustrator',
        organizationId: organizations[0].id,
        instructorId: users[4].id, // Dr. Sarah Johnson
        category: 'arts',
        subcategory: 'digital_design',
        tags: ['design', 'typography', 'color-theory', 'figma', 'illustrator'],
        language: 'en',
        difficulty: 'beginner',
        level: 'basic',
        price: 89.99,
        currency: 'USD',
        duration: 360, // 6 hours
        totalLessons: 18,
        status: 'published',
        isActive: true,
        rating: 4.7,
        enrollmentCount: 25
      },
      {
        title: 'Digital Photography Essentials',
        subtitle: 'Master DSLR and mirrorless camera fundamentals',
        description: 'Complete beginner course on using DSLR or mirrorless cameras. Covers exposure, composition, lighting techniques, and post-processing in Adobe Lightroom.',
        shortDescription: 'Learn professional photography with DSLR and mirrorless cameras',
        organizationId: organizations[0].id,
        instructorId: users[4].id, // Dr. Sarah Johnson
        category: 'arts',
        subcategory: 'visual_arts_photography',
        tags: ['photography', 'dslr', 'mirrorless', 'lightroom', 'composition'],
        language: 'en',
        difficulty: 'beginner',
        level: 'basic',
        price: 79.99,
        currency: 'USD',
        duration: 300, // 5 hours
        totalLessons: 15,
        status: 'published',
        isActive: true,
        rating: 4.8,
        enrollmentCount: 18
      },
      {
        title: 'Video Editing with DaVinci Resolve',
        subtitle: 'Professional video editing and color grading',
        description: 'Comprehensive course on professional video editing using DaVinci Resolve. Covers video and audio synchronization, color grading, and final export settings.',
        shortDescription: 'Master professional video editing with DaVinci Resolve',
        organizationId: organizations[1].id,
        instructorId: users[5].id, // Prof. Jean Mukamba
        category: 'arts',
        subcategory: 'media_production',
        tags: ['video-editing', 'davinci-resolve', 'color-grading', 'post-production'],
        language: 'en',
        difficulty: 'intermediate',
        level: 'intermediate',
        price: 129.99,
        currency: 'USD',
        duration: 480, // 8 hours
        totalLessons: 24,
        status: 'published',
        isActive: true,
        rating: 4.6,
        enrollmentCount: 12
      },
      {
        title: 'Creative Writing for Storytelling',
        subtitle: 'Develop plot, characters, and dialogue for fiction and screenwriting',
        description: 'Master the art of creative writing including developing compelling plots, creating memorable characters, and writing engaging dialogue for fiction, non-fiction, and screenwriting.',
        shortDescription: 'Master creative writing for fiction and screenwriting',
        organizationId: organizations[1].id,
        instructorId: users[5].id, // Prof. Jean Mukamba
        category: 'arts',
        subcategory: 'creative_writing_communication',
        tags: ['creative-writing', 'storytelling', 'fiction', 'screenwriting', 'characters'],
        language: 'en',
        difficulty: 'beginner',
        level: 'basic',
        price: 69.99,
        currency: 'USD',
        duration: 420, // 7 hours
        totalLessons: 21,
        status: 'published',
        isActive: true,
        rating: 4.5,
        enrollmentCount: 30
      }
    ]);
    console.log('✅ Courses created');

    // Create course enrollments (simulate student progress)
    const enrollments = [
      {
        userId: users[1].id, // John Doe
        courseId: courses[0].id, // React Fundamentals
        progress: 75,
        enrolledAt: new Date('2024-01-15'),
        lastAccessedAt: new Date()
      },
      {
        userId: users[2].id, // Jane Smith
        courseId: courses[1].id, // JavaScript Advanced
        progress: 90,
        enrolledAt: new Date('2024-01-14'),
        lastAccessedAt: new Date()
      },
      {
        userId: users[3].id, // Mike Johnson
        courseId: courses[2].id, // Node.js Backend
        progress: 60,
        enrolledAt: new Date('2024-01-13'),
        lastAccessedAt: new Date()
      },
      {
        userId: users[0].id, // Vira Neema
        courseId: courses[0].id, // React Fundamentals
        progress: 45,
        enrolledAt: new Date('2024-01-20'),
        lastAccessedAt: new Date()
      },
      {
        userId: users[1].id, // John Doe
        courseId: courses[1].id, // JavaScript Advanced
        progress: 30,
        enrolledAt: new Date('2024-01-18'),
        lastAccessedAt: new Date()
      }
    ];

    // Note: We'll need to create an enrollments table or add this to the existing schema
    // For now, we'll store this data in a simple way
    console.log('✅ Sample enrollments data prepared');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Organizations: ${organizations.length}`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Courses: ${courses.length} (including ${courses.filter(c => c.category === 'arts').length} Arts & Compétences Créatives courses)`);
    console.log(`- Affiliate profiles: 4`);
    
    console.log('\n👥 Test Accounts:');
    console.log('Students:');
    console.log('- vn@adn.presidence.cd / password123');
    console.log('- john.doe@student.com / password123');
    console.log('- jane.smith@student.com / password123');
    console.log('- mike.johnson@student.com / password123');
    console.log('\nInstructors:');
    console.log('- sarah.johnson@lecturer.com / lecturer123');
    console.log('- jean.mukamba@techacademy-drc.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seed function
seedDatabase();
