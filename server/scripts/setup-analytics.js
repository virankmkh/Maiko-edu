const { testConnection } = require('../config/database');
const migration = require('../migrations/add_analytics_tables');

console.log('🚀 Setting up Custom Analytics System\n');

async function setupAnalytics() {
  try {
    console.log('📋 Step 1: Testing database connection...');
    await testConnection();
    console.log('✅ Database connection successful');
    
    console.log('\n📋 Step 2: Running analytics migration...');
    await migration.up(require('sequelize').getQueryInterface(), require('sequelize').Sequelize);
    console.log('✅ Analytics tables created successfully');
    
    console.log('\n🎉 Analytics setup complete!');
    console.log('\n📊 Your custom analytics system is ready:');
    console.log('✅ Analytics events tracking');
    console.log('✅ User session tracking');
    console.log('✅ Course analytics');
    console.log('✅ Lesson analytics');
    console.log('✅ Real-time dashboard');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Restart your Node.js server');
    console.log('2. Update your .env file with:');
    console.log('   ANALYTICS_ENABLED=true');
    console.log('3. Start tracking your e-learning analytics!');
    
    console.log('\n📈 Access analytics at: /api/analytics/dashboard');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupAnalytics();
