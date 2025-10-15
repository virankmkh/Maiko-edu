const { DataTypes } = require('sequelize');

const Transaction = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique transaction identifier'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payment_methods',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true,
      comment: 'Exchange rate for currency conversion'
    },
    localAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Amount in local currency (CDF for DRC)'
    },
    localCurrency: {
      type: DataTypes.STRING(3),
      allowNull: true,
      comment: 'Local currency (CDF)'
    },
    transactionType: {
      type: DataTypes.ENUM('course_purchase', 'live_lesson', 'subscription', 'refund', 'withdrawal'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
      defaultValue: 'pending'
    },
    providerTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'External provider transaction ID'
    },
    providerResponse: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Full provider response data'
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      comment: 'Transaction fees'
    },
    netAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Amount after fees'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional transaction metadata'
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'status']
      },
      {
        fields: ['transactionType', 'status']
      },
      {
        fields: ['providerTransactionId']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return Transaction;
};

module.exports = Transaction;
