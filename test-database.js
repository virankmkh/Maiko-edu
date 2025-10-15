const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔧 Testing Database Connection...');
console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL);

// Create Sequelize instance for PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'Esther07082015'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'maiko_edu'}`, {
  dialect: 'postgres',
  logging: console.log
});

async function testConnection() {
  try {
    console.log('🔄 Testing PostgreSQL connection...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection successful!');
    
    console.log('🔄 Testing simple query...');
    const result = await sequelize.query('SELECT 1 as test');
    console.log('✅ Query result:', result);
    
    console.log('🔄 Testing table existence...');
    const tables = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('✅ Available tables:', tables[0]);
    
    await sequelize.close();
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testConnection();
