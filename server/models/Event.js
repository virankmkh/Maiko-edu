const { DataTypes } = require('sequelize');

const Event = (sequelize) => {
  const EventModel = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    organizerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Organizers',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    category: {
      type: DataTypes.ENUM('conference', 'workshop', 'seminar', 'summit', 'exhibition', 'networking', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    eventType: {
      type: DataTypes.ENUM('online', 'offline', 'hybrid'),
      allowNull: false,
      defaultValue: 'offline'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    registrationStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    registrationEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Africa/Kinshasa'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'RDC'
    },
    coordinates: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Latitude and longitude for map display'
    },
    onlineLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    maxAttendees: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    currentAttendees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'draft'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    customFields: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        allowWaitlist: true,
        requireApproval: false,
        allowCancellation: true,
        cancellationDeadline: null,
        sendReminders: true,
        reminderDays: [7, 1],
        allowSharing: true
      }
    },
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seoDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'events',
    timestamps: true,
    indexes: [
      {
        fields: ['organizerId']
      },
      {
        fields: ['startDate']
      },
      {
        fields: ['status']
      },
      {
        fields: ['isPublic', 'isPublished']
      },
      {
        fields: ['category']
      },
      {
        fields: ['city', 'country']
      },
      {
        fields: ['slug']
      }
    ]
  });

  // Instance methods
  EventModel.prototype.isRegistrationOpen = function() {
    const now = new Date();
    const regStart = this.registrationStartDate || this.createdAt;
    const regEnd = this.registrationEndDate || this.startDate;
    
    return now >= regStart && now <= regEnd && this.status === 'published';
  };

  EventModel.prototype.isFullyBooked = function() {
    return this.maxAttendees && this.currentAttendees >= this.maxAttendees;
  };

  EventModel.prototype.getAvailableSpots = function() {
    if (!this.maxAttendees) return null;
    return Math.max(0, this.maxAttendees - this.currentAttendees);
  };

  EventModel.prototype.generateSlug = function() {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  };

  // Hooks
  EventModel.beforeCreate(async (event) => {
    if (!event.slug) {
      event.slug = event.generateSlug();
    }
  });

  EventModel.beforeUpdate(async (event) => {
    if (event.changed('title') && !event.changed('slug')) {
      event.slug = event.generateSlug();
    }
  });

  return EventModel;
};

module.exports = Event;