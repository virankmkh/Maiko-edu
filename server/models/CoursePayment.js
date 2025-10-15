const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoursePayment = sequelize.define('CoursePayment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    enrollmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'course_enrollments',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Payment amount in USD'
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'paypal', 'orange_money', 'vodacom_mpesa', 'bank_transfer'),
      allowNull: false,
      comment: 'Payment method used'
    },
    paymentGatewayId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Payment gateway transaction ID'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    gatewayResponse: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Raw response from payment gateway'
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Amount refunded'
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'course_payments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId']
      },
      {
        fields: ['paymentGatewayId']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Associations
  CoursePayment.associate = (models) => {
    CoursePayment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    CoursePayment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    CoursePayment.belongsTo(models.CourseEnrollment, { foreignKey: 'enrollmentId', as: 'enrollment' });
  };

  return CoursePayment;
};
