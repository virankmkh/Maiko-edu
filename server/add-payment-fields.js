const { sequelize } = require('./config/database');

async function addPaymentFields() {
  try {
    console.log('🔧 Adding payment fields to course_enrollments table...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Add payment fields one by one
    const fields = [
      {
        name: 'paymentStatus',
        sql: `ALTER TABLE course_enrollments ADD COLUMN "paymentStatus" VARCHAR(255) CHECK ("paymentStatus" IN ('free', 'paid', 'pending')) DEFAULT 'free'`
      },
      {
        name: 'paymentId',
        sql: `ALTER TABLE course_enrollments ADD COLUMN "paymentId" VARCHAR(255)`
      },
      {
        name: 'paidAt',
        sql: `ALTER TABLE course_enrollments ADD COLUMN "paidAt" TIMESTAMP WITH TIME ZONE`
      },
      {
        name: 'freeLessonsCompleted',
        sql: `ALTER TABLE course_enrollments ADD COLUMN "freeLessonsCompleted" INTEGER DEFAULT 0`
      }
    ];

    for (const field of fields) {
      try {
        await sequelize.query(field.sql);
        console.log(`✅ Added ${field.name} column`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Column ${field.name} already exists`);
        } else {
          console.log(`❌ Error adding ${field.name}:`, error.message);
        }
      }
    }

    // Check if course_payments table exists
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'course_payments';
    `);

    if (tables.length === 0) {
      console.log('\n🔧 Creating course_payments table...');
      await sequelize.query(`
        CREATE TABLE course_payments (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL REFERENCES users(id),
          "courseId" INTEGER NOT NULL REFERENCES courses(id),
          "enrollmentId" INTEGER NOT NULL REFERENCES course_enrollments(id),
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          "paymentMethod" VARCHAR(255) CHECK ("paymentMethod" IN ('stripe', 'paypal', 'orange_money', 'vodacom_mpesa', 'bank_transfer')),
          "paymentGatewayId" VARCHAR(255),
          status VARCHAR(255) CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
          "gatewayResponse" JSON,
          "refundedAt" TIMESTAMP WITH TIME ZONE,
          "refundAmount" DECIMAL(10,2),
          "refundReason" TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✅ Created course_payments table');
    } else {
      console.log('✅ course_payments table already exists');
    }

    console.log('\n🎉 Payment fields added successfully!');

  } catch (error) {
    console.error('❌ Error adding payment fields:', error.message);
  } finally {
    await sequelize.close();
  }
}

addPaymentFields();
