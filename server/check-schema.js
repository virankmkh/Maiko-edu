const { sequelize, models } = require('./config/database');

async function checkSchema() {
  try {
    console.log('🔍 Checking current database schema...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Check CourseEnrollment table structure
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'course_enrollments' 
      ORDER BY ordinal_position;
    `);

    console.log('\n📊 CourseEnrollments table columns:');
    results.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Check if payment fields exist
    const paymentFields = ['paymentStatus', 'paymentId', 'paidAt', 'freeLessonsCompleted'];
    const existingFields = results.map(r => r.column_name);
    
    console.log('\n🔍 Payment fields status:');
    paymentFields.forEach(field => {
      const exists = existingFields.includes(field);
      console.log(`- ${field}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });

  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
