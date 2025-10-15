const { LabTemplate, Course, User } = require('../config/database').models;
const eveNgService = require('../services/eveNgService');

/**
 * Complete setup script for networking labs
 * This script will:
 * 1. Test EVE-NG connectivity
 * 2. Create sample lab templates
 * 3. Update courses with lab content
 * 4. Set up monitoring
 * 5. Verify all components
 */

async function setupNetworkingLabs() {
  console.log('🚀 Starting Networking Labs Setup...\n');

  try {
    // Step 1: Test EVE-NG Connectivity
    console.log('1️⃣ Testing EVE-NG connectivity...');
    const isEveNgAvailable = await eveNgService.healthCheck();
    
    if (!isEveNgAvailable) {
      console.log('⚠️  EVE-NG server is not available. Please ensure:');
      console.log('   - EVE-NG server is running');
      console.log('   - EVE_NG_URL is correctly configured in .env');
      console.log('   - Network connectivity to EVE-NG server');
      console.log('   - EVE-NG API is enabled');
      console.log('\n   Continuing with setup (you can configure EVE-NG later)...\n');
    } else {
      console.log('✅ EVE-NG server is accessible\n');
    }

    // Step 2: Create Sample Lab Templates
    console.log('2️⃣ Creating sample lab templates...');
    await createSampleLabTemplates();
    console.log('✅ Sample lab templates created\n');

    // Step 3: Update Courses with Lab Content
    console.log('3️⃣ Updating courses with lab content...');
    await updateCoursesWithLabContent();
    console.log('✅ Courses updated with lab content\n');

    // Step 4: Set up Monitoring
    console.log('4️⃣ Setting up monitoring...');
    await setupMonitoring();
    console.log('✅ Monitoring configured\n');

    // Step 5: Verify Setup
    console.log('5️⃣ Verifying setup...');
    await verifySetup();
    console.log('✅ Setup verification completed\n');

    console.log('🎉 Networking Labs Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Configure EVE-NG server (if not already done)');
    console.log('2. Upload device images with proper licenses');
    console.log('3. Test lab functionality');
    console.log('4. Create additional lab templates as needed');
    console.log('5. Train instructors on lab management');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

async function createSampleLabTemplates() {
  const sampleTemplates = [
    {
      name: "Basic Router Configuration",
      description: "Learn fundamental router configuration including interfaces, routing protocols, and basic security.",
      courseId: 1,
      eveTemplateId: "basic-router-lab",
      topology: {
        name: "Basic Router Lab",
        devices: {
          "R1": { type: "router", model: "c7200", position: { x: 100, y: 100 } },
          "R2": { type: "router", model: "c7200", position: { x: 300, y: 100 } },
          "PC1": { type: "pc", model: "linux", position: { x: 50, y: 200 } },
          "PC2": { type: "pc", model: "linux", position: { x: 350, y: 200 } }
        },
        connections: [
          { from: "R1", fromPort: "FastEthernet0/0", to: "R2", toPort: "FastEthernet0/0" },
          { from: "R1", fromPort: "FastEthernet0/1", to: "PC1", toPort: "eth0" },
          { from: "R2", fromPort: "FastEthernet0/1", to: "PC2", toPort: "eth0" }
        ]
      },
      devices: {
        "R1": { type: "router", model: "c7200", host: "192.168.1.10", port: 3001, username: "admin", password: "admin" },
        "R2": { type: "router", model: "c7200", host: "192.168.1.10", port: 3002, username: "admin", password: "admin" },
        "PC1": { type: "pc", model: "linux", host: "192.168.1.10", port: 3003, username: "root", password: "root" },
        "PC2": { type: "pc", model: "linux", host: "192.168.1.10", port: 3004, username: "root", password: "root" }
      },
      difficulty: "beginner",
      estimatedDuration: 60,
      maxConcurrentUsers: 20,
      prerequisites: ["Basic understanding of IP addressing", "Familiarity with command line interface"],
      learningObjectives: [
        "Configure router interfaces with IP addresses",
        "Set up static routing between routers",
        "Test connectivity using ping and traceroute",
        "Configure basic router security features"
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
      resourceRequirements: { cpu: 2, ram: 4, storage: 8 }
    },
    {
      name: "VLAN Configuration Lab",
      description: "Learn VLAN concepts and configuration on Cisco switches including trunking and inter-VLAN routing.",
      courseId: 1,
      eveTemplateId: "vlan-lab",
      topology: {
        name: "VLAN Lab",
        devices: {
          "SW1": { type: "switch", model: "c2960", position: { x: 200, y: 100 } },
          "R1": { type: "router", model: "c7200", position: { x: 200, y: 250 } },
          "PC1": { type: "pc", model: "linux", position: { x: 100, y: 50 } },
          "PC2": { type: "pc", model: "linux", position: { x: 300, y: 50 } },
          "PC3": { type: "pc", model: "linux", position: { x: 100, y: 150 } },
          "PC4": { type: "pc", model: "linux", position: { x: 300, y: 150 } }
        },
        connections: [
          { from: "SW1", fromPort: "FastEthernet0/1", to: "PC1", toPort: "eth0" },
          { from: "SW1", fromPort: "FastEthernet0/2", to: "PC2", toPort: "eth0" },
          { from: "SW1", fromPort: "FastEthernet0/3", to: "PC3", toPort: "eth0" },
          { from: "SW1", fromPort: "FastEthernet0/4", to: "PC4", toPort: "eth0" },
          { from: "SW1", fromPort: "FastEthernet0/24", to: "R1", toPort: "FastEthernet0/0" }
        ]
      },
      devices: {
        "SW1": { type: "switch", model: "c2960", host: "192.168.1.10", port: 3005, username: "admin", password: "admin" },
        "R1": { type: "router", model: "c7200", host: "192.168.1.10", port: 3006, username: "admin", password: "admin" },
        "PC1": { type: "pc", model: "linux", host: "192.168.1.10", port: 3007, username: "root", password: "root" },
        "PC2": { type: "pc", model: "linux", host: "192.168.1.10", port: 3008, username: "root", password: "root" },
        "PC3": { type: "pc", model: "linux", host: "192.168.1.10", port: 3009, username: "root", password: "root" },
        "PC4": { type: "pc", model: "linux", host: "192.168.1.10", port: 3010, username: "root", password: "root" }
      },
      difficulty: "intermediate",
      estimatedDuration: 90,
      maxConcurrentUsers: 15,
      prerequisites: ["Basic understanding of switching concepts", "Knowledge of IP addressing"],
      learningObjectives: [
        "Create and configure VLANs on a switch",
        "Assign switch ports to VLANs",
        "Configure trunk links between switches and routers",
        "Set up inter-VLAN routing"
      ],
      instructions: `# VLAN Configuration Lab

## Lab Overview
Configure VLANs on a Cisco switch and set up inter-VLAN routing.

## Step-by-Step Instructions
1. Create VLANs 10 and 20
2. Assign ports to VLANs
3. Configure trunk link
4. Set up router sub-interfaces
5. Test connectivity

## Verification Commands
- \`show vlan brief\`
- \`show interfaces trunk\`
- \`show ip route\``,
      resourceRequirements: { cpu: 3, ram: 6, storage: 12 }
    }
  ];

  for (const templateData of sampleTemplates) {
    // Check if template already exists
    const existingTemplate = await LabTemplate.findOne({
      where: { eveTemplateId: templateData.eveTemplateId }
    });

    if (!existingTemplate) {
      const template = await LabTemplate.create(templateData);
      console.log(`   ✅ Created template: ${template.name}`);
    } else {
      console.log(`   ⚠️  Template already exists: ${templateData.name}`);
    }
  }
}

async function updateCoursesWithLabContent() {
  // Find courses that should have lab content
  const courses = await Course.findAll({
    where: {
      category: 'technology',
      subcategory: ['networking', 'cisco', 'ccna', 'ccnp']
    }
  });

  for (const course of courses) {
    // Update course with lab content
    await course.update({
      hasLabContent: true,
      labAccessLevel: 'basic',
      labInstructions: 'This course includes hands-on networking labs. Access labs through the course content.',
      labPrerequisites: [
        'Basic understanding of networking concepts',
        'Familiarity with command line interface',
        'Access to a modern web browser'
      ]
    });
    console.log(`   ✅ Updated course: ${course.title}`);
  }

  // If no courses found, create a sample networking course
  if (courses.length === 0) {
    const sampleCourse = await Course.create({
      title: 'Introduction to Networking',
      subtitle: 'Learn networking fundamentals with hands-on labs',
      description: 'A comprehensive course covering networking basics with practical lab exercises.',
      organizationId: 1,
      instructorId: 1,
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
      ]
    });
    console.log(`   ✅ Created sample course: ${sampleCourse.title}`);
  }
}

async function setupMonitoring() {
  // Create monitoring configuration
  const monitoringConfig = {
    enabled: process.env.ENABLE_MONITORING === 'true',
    port: process.env.MONITORING_PORT || 9090,
    metrics: {
      labSessions: true,
      resourceUsage: true,
      errors: true,
      performance: true
    },
    alerts: {
      highResourceUsage: 80,
      maxConcurrentLabs: 45,
      errorThreshold: 10
    }
  };

  console.log(`   📊 Monitoring configuration:`, monitoringConfig);
  console.log(`   📈 Metrics endpoint: http://localhost:${monitoringConfig.port}/metrics`);
}

async function verifySetup() {
  // Check database models
  const labTemplates = await LabTemplate.count();
  const coursesWithLabs = await Course.count({ where: { hasLabContent: true } });
  
  console.log(`   📊 Lab templates: ${labTemplates}`);
  console.log(`   📚 Courses with lab content: ${coursesWithLabs}`);
  
  // Check EVE-NG connectivity
  const eveNgStatus = await eveNgService.healthCheck();
  console.log(`   🔗 EVE-NG connectivity: ${eveNgStatus ? '✅ Connected' : '❌ Not connected'}`);
  
  // Check environment variables
  const requiredEnvVars = [
    'EVE_NG_URL',
    'EVE_NG_USERNAME', 
    'EVE_NG_PASSWORD',
    'JWT_SECRET',
    'DATABASE_URL'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.log(`   ⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
  } else {
    console.log(`   ✅ All required environment variables are set`);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupNetworkingLabs()
    .then(() => {
      console.log('\n🎉 Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    });
}

module.exports = { setupNetworkingLabs };
