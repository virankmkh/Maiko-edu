const { DataTypes } = require('sequelize');

const Ticket = (sequelize) => sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  quantityAvailable: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null means unlimited
    validate: {
      min: 0
    }
  },
  quantitySold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maxPerUser: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  saleStartDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  saleEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'sold_out'),
    allowNull: false,
    defaultValue: 'active'
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'tickets',
  timestamps: true,
  indexes: [
    { fields: ['eventId'] },
    { fields: ['saleStartDate'] },
    { fields: ['saleEndDate'] },
    { fields: ['status'] }
  ]
});

module.exports = Ticket;
