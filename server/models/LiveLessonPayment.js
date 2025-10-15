const { DataTypes } = require('sequelize');

const LiveLessonPayment = (sequelize) => {
  const LiveLessonPayment = sequelize.define('LiveLessonPayment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    callId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group_calls',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1.00
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'paypal', 'bank_transfer', 'crypto'),
      allowNull: false
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'live_lesson_payments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['callId', 'studentId']
      }
    ]
  });

  return LiveLessonPayment;
};

module.exports = LiveLessonPayment;
