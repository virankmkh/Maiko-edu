const { DataTypes } = require('sequelize');

const PaymentMethod = (sequelize) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
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
    methodType: {
      type: DataTypes.ENUM('stripe', 'paypal', 'bank_transfer', 'crypto', 'mobile_money', 'visa_card'),
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Provider name (e.g., Stripe, PayPal, M-Pesa, Orange Money)'
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'External account identifier'
    },
    accountDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Encrypted account details (card last 4 digits, etc.)'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: 'Country code (CD for DRC)'
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'failed'),
      defaultValue: 'pending'
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'payment_methods',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'methodType']
      },
      {
        fields: ['userId', 'isDefault']
      }
    ]
  });

  return PaymentMethod;
};

module.exports = PaymentMethod;
