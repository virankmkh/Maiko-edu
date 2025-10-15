const { sequelize, models } = require('./config/database');

async function updatePaymentSchema() {
  try {
    console.log('🔧 Updating payment schema...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync models with database - this will add new columns
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema updated with payment fields');

    // Test the models
    console.log('\n📊 Testing models...');
    console.log('CourseEnrollment fields:', Object.keys(models.CourseEnrollment.rawAttributes));
    console.log('CoursePayment fields:', Object.keys(models.CoursePayment.rawAttributes));

    console.log('\n🎉 Payment schema update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating payment schema:', error.message);
  } finally {
    await sequelize.close();
  }
}

updatePaymentSchema();
