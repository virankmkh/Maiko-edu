const { DataTypes } = require('sequelize');

const CheckIn = (sequelize) => sequelize.define('CheckIn', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  registrationId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true // Each registration can only be checked in once
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  checkedInBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Organizers',
      key: 'id'
    }
  },
  checkInMethod: {
    type: DataTypes.ENUM('qr_scan', 'manual', 'api'),
    allowNull: false,
    defaultValue: 'qr_scan'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'check_ins',
  timestamps: true,
  indexes: [
    { fields: ['registrationId'], unique: true },
    { fields: ['eventId'] },
    { fields: ['checkedInBy'] },
    { fields: ['checkInTime'] }
  ]
});

module.exports = CheckIn;
