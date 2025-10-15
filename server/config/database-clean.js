const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });

console.log('🔧 Creating clean PostgreSQL connection...');
console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL);

// Create a completely clean Sequelize instance for PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: false
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Clean PostgreSQL connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Clean PostgreSQL connection failed:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};
