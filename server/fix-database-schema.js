const { sequelize, models } = require('./config/database');

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Drop all tables to recreate with correct naming
    console.log('🗑️  Dropping existing tables...');
    await sequelize.drop();
    
    // Sync models with database - create tables with correct naming
    console.log('🔄 Creating tables with correct naming...');
    await sequelize.sync({ force: true });
    
    console.log('✅ Database schema fixed successfully!');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection verified');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error fixing database schema:', error.message);
  }
}

fixDatabaseSchema();
