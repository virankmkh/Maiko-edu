const { Sequelize } = require('sequelize');

async function checkAllDatabases() {
  try {
    console.log('🔍 Checking for all PostgreSQL databases...\n');

    // Connect to PostgreSQL server (not specific database)
    const sequelize = new Sequelize('postgresql://postgres:Esther07082015@localhost:5432/postgres', {
      dialect: 'postgres',
      logging: false
    });

    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL server');

    // List all databases
    const [databases] = await sequelize.query(`
      SELECT datname 
      FROM pg_database 
      WHERE datistemplate = false
      ORDER BY datname
    `);

    console.log('\n📊 Available databases:');
    databases.forEach((db, index) => {
      console.log(`${index + 1}. ${db.datname}`);
    });

    // Check if there are other maiko databases
    const maikoDatabases = databases.filter(db => 
      db.datname.toLowerCase().includes('maiko')
    );

    console.log('\n🎯 Maiko-related databases:');
    if (maikoDatabases.length > 0) {
      maikoDatabases.forEach(db => {
        console.log(`- ${db.datname}`);
      });
    } else {
      console.log('No maiko-related databases found');
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllDatabases();
