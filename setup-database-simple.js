const { Client } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function setupDatabase() {
  console.log('🔧 Setting up database...\n');
  
  // Try different connection configurations
  const connectionConfigs = [
    {
      name: 'Default postgres user',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'postgres'
      }
    },
    {
      name: 'Empty password',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: ''
      }
    },
    {
      name: 'No password',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres'
      }
    }
  ];
  
  let workingConfig = null;
  
  for (const config of connectionConfigs) {
    console.log(`Trying ${config.name}...`);
    try {
      const client = new Client(config.config);
      await client.connect();
      console.log(`✅ Connected with ${config.name}`);
      workingConfig = config.config;
      await client.end();
      break;
    } catch (error) {
      console.log(`❌ Failed with ${config.name}: ${error.message}`);
    }
  }
  
  if (!workingConfig) {
    console.log('\n❌ Could not connect to PostgreSQL with any configuration.');
    console.log('\nPlease check:');
    console.log('1. PostgreSQL is installed and running');
    console.log('2. Try opening pgAdmin to see what credentials work');
    console.log('3. Or reset postgres password:');
    console.log('   psql -U postgres');
    console.log('   ALTER USER postgres PASSWORD \'password\';');
    return;
  }
  
  console.log(`\n✅ Using configuration: ${workingConfig.user}@${workingConfig.host}:${workingConfig.port}`);
  
  // Create database
  try {
    const client = new Client(workingConfig);
    await client.connect();
    
    // Check if database exists
    const result = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = 'maiko_edu'
    `);
    
    if (result.rows.length === 0) {
      console.log('Creating database maiko_edu...');
      await client.query('CREATE DATABASE maiko_edu');
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database maiko_edu already exists');
    }
    
    await client.end();
    
  } catch (error) {
    console.log(`❌ Error creating database: ${error.message}`);
    return;
  }
  
  // Update .env file with working configuration
  try {
    const fs = require('fs');
    let envContent = fs.readFileSync('.env', 'utf8');
    
    // Update database URL
    const newDatabaseUrl = `postgresql://${workingConfig.user}:${workingConfig.password}@${workingConfig.host}:${workingConfig.port}/maiko_edu`;
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${newDatabaseUrl}`
    );
    
    // Update individual database variables
    envContent = envContent.replace(/DB_HOST=.*/, `DB_HOST=${workingConfig.host}`);
    envContent = envContent.replace(/DB_PORT=.*/, `DB_PORT=${workingConfig.port}`);
    envContent = envContent.replace(/DB_NAME=.*/, `DB_NAME=maiko_edu`);
    envContent = envContent.replace(/DB_USER=.*/, `DB_USER=${workingConfig.user}`);
    envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${workingConfig.password}`);
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ Updated .env file with working database configuration');
    
  } catch (error) {
    console.log(`❌ Error updating .env file: ${error.message}`);
  }
  
  console.log('\n🎉 Database setup completed!');
  console.log('\nNext steps:');
  console.log('1. Run: node test-setup.js (to verify)');
  console.log('2. Run: cd server && node scripts/setup-database.js');
  console.log('3. Start the application');
}

// Run setup
setupDatabase().catch(console.error);

