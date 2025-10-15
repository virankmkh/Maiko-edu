const { sequelize, models } = require('./config/database');

async function checkDatabaseComplete() {
  try {
    console.log('🔍 Complete Database Analysis - PostgreSQL (maiko_edu)\n');
    console.log('=' .repeat(60));

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database: maiko_edu\n');

    // Get all table names
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('📊 Database Tables:');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });
    console.log('');

    // Check each table's content
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`\n📋 Table: ${tableName}`);
      console.log('-'.repeat(40));

      try {
        // Get row count
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const rowCount = countResult[0].count;
        console.log(`📊 Rows: ${rowCount}`);

        if (rowCount > 0) {
          // Get sample data (first 3 rows)
          const [sampleData] = await sequelize.query(`SELECT * FROM "${tableName}" LIMIT 3`);
          console.log('📄 Sample data:');
          sampleData.forEach((row, index) => {
            console.log(`  Row ${index + 1}:`, JSON.stringify(row, null, 2));
          });
        } else {
          console.log('📄 No data in this table');
        }

        // Get column information
        const [columns] = await sequelize.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = '${tableName}' 
          ORDER BY ordinal_position
        `);
        
        console.log('🏗️  Columns:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });

      } catch (error) {
        console.log(`❌ Error reading table ${tableName}:`, error.message);
      }
    }

    // Check specific relationships
    console.log('\n🔗 Checking Relationships:');
    console.log('-'.repeat(40));

    // Check users and their roles
    const [users] = await sequelize.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    console.log('👥 Users by role:');
    users.forEach(user => {
      console.log(`  - ${user.role}: ${user.count}`);
    });

    // Check courses and instructors
    const [courses] = await sequelize.query(`
      SELECT c.title, u.firstName, u.lastName, u.email
      FROM courses c
      LEFT JOIN users u ON c."instructorId" = u.id
    `);
    console.log('\n📚 Courses and Instructors:');
    courses.forEach(course => {
      console.log(`  - "${course.title}" by ${course.firstName} ${course.lastName} (${course.email})`);
    });

    // Check enrollments
    const [enrollments] = await sequelize.query(`
      SELECT 
        c.title as course_title,
        u.firstName, u.lastName, u.email,
        ce.progress, ce."isActive"
      FROM course_enrollments ce
      LEFT JOIN courses c ON ce."courseId" = c.id
      LEFT JOIN users u ON ce."userId" = u.id
      ORDER BY c.title, u.firstName
    `);
    console.log('\n🎓 Enrollments:');
    enrollments.forEach(enrollment => {
      console.log(`  - ${enrollment.firstName} ${enrollment.lastName} (${enrollment.email}) in "${enrollment.course_title}" - Progress: ${enrollment.progress}% (Active: ${enrollment.isActive})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ Database analysis complete!');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

checkDatabaseComplete();
