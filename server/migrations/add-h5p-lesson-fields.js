const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance for PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'Esther07082015'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'maiko_edu'}`, {
  dialect: 'postgres',
  logging: console.log
});

async function addH5PLessonFields() {
  try {
    console.log('🔄 Starting database migration: Adding H5P fields to lessons table...');
    
    // Add new columns to lessons table
    await sequelize.query(`
      ALTER TABLE lessons 
      ADD COLUMN IF NOT EXISTS "h5pContentId" INTEGER,
      ADD COLUMN IF NOT EXISTS "h5pContentType" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "h5pContentData" JSONB,
      ADD COLUMN IF NOT EXISTS "h5pProgress" JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS "h5pMaxScore" INTEGER,
      ADD COLUMN IF NOT EXISTS "h5pPassingScore" INTEGER;
    `);
    
    // Update the lessonType enum to include 'h5p'
    await sequelize.query(`
      ALTER TYPE "enum_lessons_lessonType" 
      ADD VALUE IF NOT EXISTS 'h5p';
    `);
    
    console.log('✅ Successfully added H5P fields to lessons table');
    console.log('✅ Successfully updated lessonType enum to include h5p');
    
    console.log('🎉 H5P lesson fields migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  addH5PLessonFields()
    .then(() => {
      console.log('✅ H5P lesson fields migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ H5P lesson fields migration failed:', error);
      process.exit(1);
    });
}

module.exports = addH5PLessonFields;
