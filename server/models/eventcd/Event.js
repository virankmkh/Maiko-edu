const { DataTypes } = require('sequelize');

const Event = (sequelize) => sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Organizations',
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
      len: [10, 500]
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
    defaultValue: 'UTC'
  },
  venue: {
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
    allowNull: true
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
    defaultValue: 0,
    validate: {
      min: 0
    }
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
  isFree: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
    allowNull: false,
    defaultValue: 'draft'
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
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'events',
  timestamps: true,
  indexes: [
    { fields: ['organizerId'] },
    { fields: ['startDate'] },
    { fields: ['status'] },
    { fields: ['isPublic', 'isPublished'] },
    { fields: ['category'] },
    { fields: ['city', 'country'] },
    { fields: ['slug'] }
  ],
  hooks: {
    beforeCreate: async (event) => {
      if (!event.slug) {
        event.slug = event.generateSlug();
      }
    },
    beforeUpdate: async (event) => {
      if (event.changed('title') && !event.changed('slug')) {
        event.slug = event.generateSlug();
      }
    }
  }
});

// Instance methods (will be added after model creation)

module.exports = Event;
