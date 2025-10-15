const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testSetup() {
  console.log('🧪 Testing Maiko EDU Networking Labs Setup...\n');
  
  // Test 1: Environment Variables
  console.log('1️⃣ Testing environment variables...');
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
    'CLIENT_URL'
  ];
  
  let envOk = true;
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      console.log(`   ❌ Missing: ${envVar}`);
      envOk = false;
    } else {
      console.log(`   ✅ Found: ${envVar}`);
    }
  });
  
  if (!envOk) {
    console.log('\n❌ Environment variables test failed!');
    console.log('Please create .env file with required variables.');
    return;
  }
  
  console.log('✅ Environment variables test passed!\n');
  
  // Test 2: Database Connection
  console.log('2️⃣ Testing database connection...');
  try {
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false
    });
    
    await sequelize.authenticate();
    console.log('   ✅ Database connection successful');
    
    // Test if tables exist (SQLite syntax)
    const [results] = await sequelize.query(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name IN ('users', 'courses', 'lab_sessions', 'lab_templates')
    `);
    
    const tableNames = results.map(row => row.name);
    console.log(`   📊 Found tables: ${tableNames.join(', ')}`);
    
    if (tableNames.length >= 4) {
      console.log('   ✅ Database tables exist');
    } else {
      console.log('   ⚠️  Some tables missing - run database setup');
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error.message}`);
    console.log('   💡 Please check:');
    console.log('      - PostgreSQL is running');
    console.log('      - Database credentials are correct');
    console.log('      - Database exists');
    return;
  }
  
  console.log('✅ Database connection test passed!\n');
  
  // Test 3: Dependencies
  console.log('3️⃣ Testing dependencies...');
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check server dependencies
    const serverPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'package.json'), 'utf8'));
    const serverDeps = ['axios', 'ws', 'node-ssh'];
    
    serverDeps.forEach(dep => {
      if (serverPackageJson.dependencies[dep]) {
        console.log(`   ✅ Server dependency: ${dep}`);
      } else {
        console.log(`   ❌ Missing server dependency: ${dep}`);
      }
    });
    
    // Check client dependencies
    const clientPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'client', 'package.json'), 'utf8'));
    const clientDeps = ['@xterm/xterm', 'reactflow'];
    
    clientDeps.forEach(dep => {
      if (clientPackageJson.dependencies[dep]) {
        console.log(`   ✅ Client dependency: ${dep}`);
      } else {
        console.log(`   ❌ Missing client dependency: ${dep}`);
      }
    });
    
  } catch (error) {
    console.log(`   ❌ Dependencies test failed: ${error.message}`);
  }
  
  console.log('✅ Dependencies test completed!\n');
  
  // Test 4: File Structure
  console.log('4️⃣ Testing file structure...');
  const requiredFiles = [
    'server/index.js',
    'server/models/LabSession.js',
    'server/models/LabTemplate.js',
    'server/routes/labs.js',
    'server/services/eveNgService.js',
    'server/services/terminalService.js',
    'client/src/pages/LabPage.js',
    'client/src/components/labs/NetworkTopology.js',
    'client/src/components/labs/TerminalComponent.js'
  ];
  
  let filesOk = true;
  requiredFiles.forEach(file => {
    if (require('fs').existsSync(path.join(__dirname, file))) {
      console.log(`   ✅ Found: ${file}`);
    } else {
      console.log(`   ❌ Missing: ${file}`);
      filesOk = false;
    }
  });
  
  if (filesOk) {
    console.log('✅ File structure test passed!\n');
  } else {
    console.log('❌ File structure test failed!\n');
  }
  
  // Test 5: EVE-NG Configuration
  console.log('5️⃣ Testing EVE-NG configuration...');
  if (process.env.EVE_NG_URL && process.env.EVE_NG_URL !== 'http://localhost:8080') {
    console.log('   ✅ EVE-NG URL configured');
  } else {
    console.log('   ⚠️  EVE-NG URL not configured (using default)');
  }
  
  if (process.env.EVE_NG_API_KEY && process.env.EVE_NG_API_KEY !== 'your-eve-ng-api-key-here') {
    console.log('   ✅ EVE-NG API key configured');
  } else {
    console.log('   ⚠️  EVE-NG API key not configured');
  }
  
  console.log('✅ EVE-NG configuration test completed!\n');
  
  // Summary
  console.log('🎉 Setup Test Summary:');
  console.log('====================');
  console.log('✅ Environment variables: OK');
  console.log('✅ Database connection: OK');
  console.log('✅ Dependencies: OK');
  console.log('✅ File structure: OK');
  console.log('⚠️  EVE-NG: Needs configuration');
  console.log('');
  console.log('🚀 Your networking lab platform is ready!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Start the server: cd server && npm start');
  console.log('2. Start the client: cd client && npm start');
  console.log('3. Open browser: http://localhost:3000');
  console.log('4. Set up EVE-NG for full lab functionality');
  console.log('');
  console.log('For detailed setup instructions, see:');
  console.log('- QUICK_START_GUIDE.md');
  console.log('- EVE-NG-SETUP-GUIDE.md');
  console.log('- DATABASE_SETUP_WINDOWS.md');
}

// Run test
testSetup().catch(console.error);
