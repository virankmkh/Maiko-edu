const { Sequelize } = require('sequelize');

async function testPostgreSQLConnection() {
  console.log('🔍 Testing PostgreSQL connection...\n');
  
  const commonPasswords = [
    'postgres',
    'password', 
    'admin',
    'root',
    '123456',
    '',
    'maiko',
    'maiko123'
  ];
  
  for (const password of commonPasswords) {
    try {
      console.log(`🔐 Trying password: "${password}"`);
      
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'maiko_edu',
        username: 'postgres',
        password: password,
        logging: false
      });
      
      await sequelize.authenticate();
      console.log(`✅ SUCCESS! Password is: "${password}"`);
      
      // Test a simple query
      const result = await sequelize.query('SELECT version() as version');
      console.log('📊 Database version:', result[0][0].version);
      
      await sequelize.close();
      return password;
      
    } catch (error) {
      console.log(`❌ Failed with password: "${password}"`);
    }
  }
  
  console.log('\n❌ None of the common passwords worked.');
  console.log('Please check your PostgreSQL password and update the connection string.');
  return null;
}

testPostgreSQLConnection();
