const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance for PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'Esther07082015'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'maiko_edu'}`, {
  dialect: 'postgres',
  logging: console.log
});

async function addCourseEnhancements() {
  try {
    console.log('🔄 Starting database migration: Adding course enhancements...');
    
    // Add new columns to courses table
    await sequelize.query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS "enableLiveSessions" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "enableInteractiveContent" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "enableMarketing" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "enableMaikoCampaign" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "instructorShare" DECIMAL(10,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS "maikoCommission" DECIMAL(10,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS "firstLessonFree" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "enrolledStudents" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "earnings" DECIMAL(10,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS "rating" DECIMAL(3,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS "lessonsCount" INTEGER DEFAULT 0;
    `);
    
    console.log('✅ Successfully added course enhancement columns');
    
    // Update existing courses with default values
    await sequelize.query(`
      UPDATE courses 
      SET 
        "enableLiveSessions" = false,
        "enableInteractiveContent" = false,
        "enableMarketing" = false,
        "enableMaikoCampaign" = false,
        "instructorShare" = price * 0.4,
        "maikoCommission" = 0.00,
        "firstLessonFree" = true,
        "enrolledStudents" = 0,
        "earnings" = 0.00,
        "rating" = 0.00,
        "lessonsCount" = 0
      WHERE "enableLiveSessions" IS NULL;
    `);
    
    console.log('✅ Successfully updated existing courses with default values');
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  addCourseEnhancements()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addCourseEnhancements;
