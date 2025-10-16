const { DataTypes } = require('sequelize');

const EventRegistration = (sequelize) => {
  const EventRegistrationModel = sequelize.define('EventRegistration', {
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
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tickets',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    // Guest registration (without user account)
    guestEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    guestName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    guestPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'refunded', 'waitlisted'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'paypal', 'orange_money', 'vodacom_mpesa', 'bank_transfer', 'free'),
      allowNull: true
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentGatewayId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    qrCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    qrCodeData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    checkInStatus: {
      type: DataTypes.ENUM('not_checked_in', 'checked_in', 'checked_out'),
      allowNull: false,
      defaultValue: 'not_checked_in'
    },
    checkedInAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    checkedInBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    checkedOutAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customFields: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'event_registrations',
    timestamps: true,
    indexes: [
      {
        fields: ['eventId']
      },
      {
        fields: ['ticketId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['guestEmail']
      },
      {
        fields: ['status']
      },
      {
        fields: ['paymentStatus']
      },
      {
        fields: ['qrCode']
      },
      {
        fields: ['checkInStatus']
      }
    ]
  });

  // Instance methods
  EventRegistrationModel.prototype.generateQRCode = function() {
    const crypto = require('crypto');
    const data = {
      registrationId: this.id,
      eventId: this.eventId,
      ticketId: this.ticketId,
      userId: this.userId,
      guestEmail: this.guestEmail,
      timestamp: this.createdAt.getTime()
    };
    
    const qrData = JSON.stringify(data);
    const qrCode = crypto.createHash('sha256').update(qrData).digest('hex');
    
    this.qrCode = qrCode;
    this.qrCodeData = qrData;
    
    return qrCode;
  };

  EventRegistrationModel.prototype.isValidForCheckIn = function() {
    return this.status === 'confirmed' && 
           this.paymentStatus === 'paid' && 
           this.checkInStatus === 'not_checked_in';
  };

  EventRegistrationModel.prototype.canBeCancelled = function() {
    return this.status === 'confirmed' && 
           this.paymentStatus === 'paid' && 
           !this.checkedInAt;
  };

  EventRegistrationModel.prototype.getDisplayName = function() {
    if (this.userId) {
      return this.User ? this.User.name : 'User';
    }
    return this.guestName || this.guestEmail || 'Guest';
  };

  EventRegistrationModel.prototype.getDisplayEmail = function() {
    if (this.userId) {
      return this.User ? this.User.email : null;
    }
    return this.guestEmail;
  };

  // Hooks
  EventRegistrationModel.beforeCreate(async (registration) => {
    if (!registration.qrCode) {
      registration.generateQRCode();
    }
  });

  EventRegistrationModel.beforeUpdate(async (registration) => {
    if (registration.changed('status') && registration.status === 'confirmed') {
      if (!registration.qrCode) {
        registration.generateQRCode();
      }
    }
  });

  return EventRegistrationModel;
};

module.exports = EventRegistration;