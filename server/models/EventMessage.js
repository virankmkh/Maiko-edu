const { DataTypes } = require('sequelize');

const EventMessage = (sequelize) => {
  const EventMessageModel = sequelize.define('EventMessage', {
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
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    messageType: {
      type: DataTypes.ENUM('announcement', 'reminder', 'update', 'welcome', 'thank_you', 'custom'),
      allowNull: false,
      defaultValue: 'custom'
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200]
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contentType: {
      type: DataTypes.ENUM('text', 'html'),
      allowNull: false,
      defaultValue: 'text'
    },
    recipientType: {
      type: DataTypes.ENUM('all', 'confirmed', 'waitlisted', 'cancelled', 'custom'),
      allowNull: false,
      defaultValue: 'all'
    },
    customRecipients: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    totalRecipients: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    sentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    failedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deliveryReport: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    isUrgent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    requiresConfirmation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    confirmationCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'event_messages',
    timestamps: true,
    indexes: [
      {
        fields: ['eventId']
      },
      {
        fields: ['senderId']
      },
      {
        fields: ['messageType']
      },
      {
        fields: ['status']
      },
      {
        fields: ['scheduledFor']
      },
      {
        fields: ['isUrgent']
      }
    ]
  });

  return EventMessageModel;
};

module.exports = EventMessage;