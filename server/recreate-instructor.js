const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./config/database');

async function recreateInstructor() {
  try {
    console.log('🔄 Recreating instructor...\n');
    
    // Delete existing instructor
    const existingInstructor = await models.User.findOne({ 
      where: { email: 'sarah.johnson@maiko.edu' } 
    });
    
    if (existingInstructor) {
      console.log('🗑️ Deleting existing instructor...');
      await existingInstructor.destroy();
    }
    
    // Get organization
    const organization = await models.Organization.findOne();
    if (!organization) {
      console.log('❌ No organization found');
      return;
    }
    
    // Create new instructor with fresh password
    console.log('👩‍🏫 Creating new instructor...');
    const instructor = await models.User.create({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@maiko.edu',
      password: await bcrypt.hash('password', 10),
      role: 'instructor',
      isActive: true,
      organizationId: organization.id,
      phone: '+1-555-0124',
      bio: 'Experienced software engineer and educator with 10+ years in web development',
      avatar: null,
      emailVerified: true,
      lastLoginAt: new Date()
    });
    
    console.log('✅ Instructor created:', instructor.firstName, instructor.lastName);
    console.log('📧 Email:', instructor.email);
    console.log('🔑 Password hash:', instructor.password);
    
    // Test password immediately
    const isPasswordValid = await bcrypt.compare('password', instructor.password);
    console.log('🔐 Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    // Update all courses to use this instructor
    console.log('\n📚 Updating courses...');
    const courses = await models.Course.findAll();
    for (const course of courses) {
      course.instructorId = instructor.id;
      await course.save();
    }
    console.log(`✅ Updated ${courses.length} courses`);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

recreateInstructor();
