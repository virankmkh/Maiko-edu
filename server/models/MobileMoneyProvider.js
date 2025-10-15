const { DataTypes } = require('sequelize');

const MobileMoneyProvider = (sequelize) => {
  const MobileMoneyProvider = sequelize.define('MobileMoneyProvider', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Provider code (e.g., MPESA, ORANGE, AIRTEL)'
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: false,
      comment: 'Country code'
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      comment: 'Supported currency'
    },
    apiEndpoint: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'API endpoint URL'
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Encrypted API key'
    },
    apiSecret: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Encrypted API secret'
    },
    merchantId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Merchant ID'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    supportedOperations: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ['payment', 'refund'],
      comment: 'Supported operations'
    },
    fees: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Fee structure'
    },
    limits: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Transaction limits'
    },
    webhookUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Webhook URL for notifications'
    },
    config: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional configuration'
    }
  }, {
    tableName: 'mobile_money_providers',
    timestamps: true
  });

  return MobileMoneyProvider;
};

module.exports = MobileMoneyProvider;






