// Event CD Model Associations
const setupEventAssociations = (models) => {
  const { Event, Ticket, EventRegistration, EventCheckIn, EventMessage, User, Organizer } = models;

  // Only set up associations if models exist and are Sequelize models
  if (!Event || typeof Event.belongsTo !== 'function') {
    console.log('⚠️  Event CD models not ready for associations yet');
    return;
  }

  // Event associations
  if (Organizer && typeof Organizer.belongsTo === 'function') {
    Event.belongsTo(Organizer, { 
      foreignKey: 'organizerId', 
      as: 'Organizer',
      onDelete: 'CASCADE'
    });
  }
  
  if (Ticket && typeof Ticket.belongsTo === 'function') {
    Event.hasMany(Ticket, { 
      foreignKey: 'eventId', 
      as: 'Tickets',
      onDelete: 'CASCADE'
    });
  }
  
  if (EventRegistration && typeof EventRegistration.belongsTo === 'function') {
    Event.hasMany(EventRegistration, { 
      foreignKey: 'eventId', 
      as: 'Registrations',
      onDelete: 'CASCADE'
    });
  }
  
  if (EventCheckIn && typeof EventCheckIn.belongsTo === 'function') {
    Event.hasMany(EventCheckIn, { 
      foreignKey: 'eventId', 
      as: 'CheckIns',
      onDelete: 'CASCADE'
    });
  }
  
  if (EventMessage && typeof EventMessage.belongsTo === 'function') {
    Event.hasMany(EventMessage, { 
      foreignKey: 'eventId', 
      as: 'Messages',
      onDelete: 'CASCADE'
    });
  }

  // Ticket associations
  if (Ticket && typeof Ticket.belongsTo === 'function') {
    Ticket.belongsTo(Event, { 
      foreignKey: 'eventId', 
      as: 'Event',
      onDelete: 'CASCADE'
    });
    
    if (EventRegistration && typeof EventRegistration.belongsTo === 'function') {
      Ticket.hasMany(EventRegistration, { 
        foreignKey: 'ticketId', 
        as: 'Registrations',
        onDelete: 'CASCADE'
      });
    }
  }

  // EventRegistration associations
  if (EventRegistration && typeof EventRegistration.belongsTo === 'function') {
    EventRegistration.belongsTo(Event, { 
      foreignKey: 'eventId', 
      as: 'Event',
      onDelete: 'CASCADE'
    });
    
    EventRegistration.belongsTo(Ticket, { 
      foreignKey: 'ticketId', 
      as: 'Ticket',
      onDelete: 'CASCADE'
    });
    
    if (User && typeof User.belongsTo === 'function') {
      EventRegistration.belongsTo(User, { 
        foreignKey: 'userId', 
        as: 'User',
        onDelete: 'SET NULL'
      });
      
      EventRegistration.belongsTo(User, { 
        foreignKey: 'checkedInBy', 
        as: 'CheckedInBy',
        onDelete: 'SET NULL'
      });
    }
    
    if (EventCheckIn && typeof EventCheckIn.belongsTo === 'function') {
      EventRegistration.hasMany(EventCheckIn, { 
        foreignKey: 'registrationId', 
        as: 'CheckIns',
        onDelete: 'CASCADE'
      });
    }
  }

  // EventCheckIn associations
  if (EventCheckIn && typeof EventCheckIn.belongsTo === 'function') {
    EventCheckIn.belongsTo(Event, { 
      foreignKey: 'eventId', 
      as: 'Event',
      onDelete: 'CASCADE'
    });
    
    EventCheckIn.belongsTo(EventRegistration, { 
      foreignKey: 'registrationId', 
      as: 'Registration',
      onDelete: 'CASCADE'
    });
    
    if (User && typeof User.belongsTo === 'function') {
      EventCheckIn.belongsTo(User, { 
        foreignKey: 'checkedInBy', 
        as: 'CheckedInBy',
        onDelete: 'CASCADE'
      });
    }
  }

  // EventMessage associations
  if (EventMessage && typeof EventMessage.belongsTo === 'function') {
    EventMessage.belongsTo(Event, { 
      foreignKey: 'eventId', 
      as: 'Event',
      onDelete: 'CASCADE'
    });
    
    if (User && typeof User.belongsTo === 'function') {
      EventMessage.belongsTo(User, { 
        foreignKey: 'senderId', 
        as: 'Sender',
        onDelete: 'CASCADE'
      });
    }
  }

  // Organizer associations (if not already defined)
  if (Organizer && typeof Organizer.hasMany === 'function') {
    Organizer.hasMany(Event, { 
      foreignKey: 'organizerId', 
      as: 'Events',
      onDelete: 'CASCADE'
    });
  }

  // User associations for Event CD
  if (User && typeof User.hasMany === 'function') {
    if (EventRegistration && typeof EventRegistration.belongsTo === 'function') {
      User.hasMany(EventRegistration, { 
        foreignKey: 'userId', 
        as: 'EventRegistrations',
        onDelete: 'SET NULL'
      });
    }
    
    if (EventCheckIn && typeof EventCheckIn.belongsTo === 'function') {
      User.hasMany(EventCheckIn, { 
        foreignKey: 'checkedInBy', 
        as: 'EventCheckIns',
        onDelete: 'CASCADE'
      });
    }
    
    if (EventMessage && typeof EventMessage.belongsTo === 'function') {
      User.hasMany(EventMessage, { 
        foreignKey: 'senderId', 
        as: 'EventMessages',
        onDelete: 'CASCADE'
      });
    }
  }
};

module.exports = setupEventAssociations;