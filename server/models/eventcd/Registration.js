const { DataTypes } = require('sequelize');

const Registration = (sequelize) => sequelize.define('Registration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  ticketId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  attendeeName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  attendeeEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  attendeePhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'waitlisted', 'checked_in'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  customFields: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refundId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'registrations',
  timestamps: true,
  indexes: [
    { fields: ['eventId'] },
    { fields: ['ticketId'] },
    { fields: ['attendeeEmail'] },
    { fields: ['status'] },
    { fields: ['paymentStatus'] },
    { fields: ['qrCode'], unique: true }
  ]
});

module.exports = Registration;
