const { DataTypes } = require('sequelize');

const EventCheckIn = (sequelize) => {
  const EventCheckInModel = sequelize.define('EventCheckIn', {
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
    registrationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'EventRegistrations',
        key: 'id'
      }
    },
    checkedInBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    checkInType: {
      type: DataTypes.ENUM('check_in', 'check_out'),
      allowNull: false,
      defaultValue: 'check_in'
    },
    checkInMethod: {
      type: DataTypes.ENUM('qr_scan', 'manual', 'api'),
      allowNull: false,
      defaultValue: 'qr_scan'
    },
    scannedQRCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deviceInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    validationErrors: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'event_check_ins',
    timestamps: true,
    indexes: [
      {
        fields: ['eventId']
      },
      {
        fields: ['registrationId']
      },
      {
        fields: ['checkedInBy']
      },
      {
        fields: ['checkInType']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return EventCheckInModel;
};

module.exports = EventCheckIn;