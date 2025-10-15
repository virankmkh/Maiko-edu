const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/maiko_edu',
  {
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('../models/User');
const Organization = require('../models/Organization');
const Affiliate = require('../models/Affiliate');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const CourseEnrollment = require('../models/CourseEnrollment');
const Lesson = require('../models/Lesson');
const Forum = require('../models/Forum');
const ForumPost = require('../models/ForumPost');
const ForumReaction = require('../models/ForumReaction');
const GroupCall = require('../models/GroupCall');
const LabSession = require('../models/LabSession');
const LabTemplate = require('../models/LabTemplate');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Initialize models
    const models = {
      User: User(sequelize),
      Organization: Organization(sequelize),
      Affiliate: Affiliate(sequelize),
      Course: Course(sequelize),
      Certificate: Certificate(sequelize),
      CourseEnrollment: CourseEnrollment(sequelize),
      Lesson: Lesson(sequelize),
      Forum: Forum(sequelize),
      ForumPost: ForumPost(sequelize),
      ForumReaction: ForumReaction(sequelize),
      GroupCall: GroupCall(sequelize),
      LabSession: LabSession(sequelize),
      LabTemplate: LabTemplate(sequelize)
    };
    
    // Set up associations
    Object.values(models).forEach(model => {
      if (model.associate) {
        model.associate(models);
      }
    });
    
    // Sync models with database
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized');
    
    // Create sample data
    await createSampleData(models);
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Please check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database credentials are correct');
    console.error('3. Database exists');
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function createSampleData(models) {
  try {
    console.log('📊 Creating sample data...');
    
    // Create sample organization
    const organization = await models.Organization.findOrCreate({
      where: { name: 'Maiko EDU' },
      defaults: {
        name: 'Maiko EDU',
        description: 'Leading online education platform',
        website: 'https://maiko-edu.com',
        email: 'contact@maiko-edu.com',
        phone: '+1-555-0123',
        address: '123 Education St, Learning City, LC 12345',
        isActive: true
      }
    });
    
    // Create sample user (instructor)
    const instructor = await models.User.findOrCreate({
      where: { email: 'instructor@maiko-edu.com' },
      defaults: {
        firstName: 'John',
        lastName: 'Instructor',
        email: 'instructor@maiko-edu.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J.8.8.8.8', // password: 'password'
        role: 'instructor',
        isActive: true,
        emailVerified: true,
        organizationId: organization[0].id
      }
    });
    
    // Create sample course with lab content
    const course = await models.Course.findOrCreate({
      where: { title: 'Introduction to Networking' },
      defaults: {
        title: 'Introduction to Networking',
        subtitle: 'Learn networking fundamentals with hands-on labs',
        description: 'A comprehensive course covering networking basics with practical lab exercises using virtual network devices.',
        organizationId: organization[0].id,
        instructorId: instructor[0].id,
        category: 'technology',
        subcategory: 'networking',
        price: 99.99,
        currency: 'USD',
        isFree: false,
        difficulty: 'beginner',
        level: 'basic',
        hasLabContent: true,
        labAccessLevel: 'basic',
        labInstructions: 'This course includes hands-on networking labs. Access labs through the course content.',
        labPrerequisites: [
          'Basic understanding of networking concepts',
          'Familiarity with command line interface',
          'Access to a modern web browser'
        ],
        status: 'published',
        isPublished: true,
        publishedAt: new Date()
      }
    });
    
    // Create sample lab template
    const labTemplate = await models.LabTemplate.findOrCreate({
      where: { eveTemplateId: 'basic-router-lab' },
      defaults: {
        name: 'Basic Router Configuration',
        description: 'Learn fundamental router configuration including interfaces, routing protocols, and basic security.',
        courseId: course[0].id,
        eveTemplateId: 'basic-router-lab',
        topology: {
          name: 'Basic Router Lab',
          devices: {
            'R1': { type: 'router', model: 'c7200', position: { x: 100, y: 100 } },
            'R2': { type: 'router', model: 'c7200', position: { x: 300, y: 100 } },
            'PC1': { type: 'pc', model: 'linux', position: { x: 50, y: 200 } },
            'PC2': { type: 'pc', model: 'linux', position: { x: 350, y: 200 } }
          },
          connections: [
            { from: 'R1', fromPort: 'FastEthernet0/0', to: 'R2', toPort: 'FastEthernet0/0' },
            { from: 'R1', fromPort: 'FastEthernet0/1', to: 'PC1', toPort: 'eth0' },
            { from: 'R2', fromPort: 'FastEthernet0/1', to: 'PC2', toPort: 'eth0' }
          ]
        },
        devices: {
          'R1': { type: 'router', model: 'c7200', host: '192.168.1.10', port: 3001, username: 'admin', password: 'admin' },
          'R2': { type: 'router', model: 'c7200', host: '192.168.1.10', port: 3002, username: 'admin', password: 'admin' },
          'PC1': { type: 'pc', model: 'linux', host: '192.168.1.10', port: 3003, username: 'root', password: 'root' },
          'PC2': { type: 'pc', model: 'linux', host: '192.168.1.10', port: 3004, username: 'root', password: 'root' }
        },
        difficulty: 'beginner',
        estimatedDuration: 60,
        maxConcurrentUsers: 20,
        prerequisites: ['Basic understanding of IP addressing', 'Familiarity with command line interface'],
        learningObjectives: [
          'Configure router interfaces with IP addresses',
          'Set up static routing between routers',
          'Test connectivity using ping and traceroute',
          'Configure basic router security features'
        ],
        instructions: `# Basic Router Configuration Lab

## Lab Overview
Configure two Cisco routers to establish connectivity between two networks.

## Step-by-Step Instructions
1. Configure R1 interfaces
2. Configure R2 interfaces  
3. Set up static routing
4. Test connectivity

## Verification Commands
- \`show ip interface brief\`
- \`show ip route\`
- \`ping\` and \`traceroute\``,
        resourceRequirements: { cpu: 2, ram: 4, storage: 8 },
        isActive: true
      }
    });
    
    console.log('✅ Sample data created successfully');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n🎉 Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database setup failed:', error.message);
      process.exit(1);
    });
}

module.exports = { setupDatabase };

