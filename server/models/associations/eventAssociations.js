// Event CD Model Associations
const setupEventAssociations = (models) => {
  const { Event, Ticket, EventRegistration, EventCheckIn, EventMessage, User, Organizer } = models;

  // Event associations
  Event.belongsTo(Organizer, { 
    foreignKey: 'organizerId', 
    as: 'Organizer',
    onDelete: 'CASCADE'
  });
  
  Event.hasMany(Ticket, { 
    foreignKey: 'eventId', 
    as: 'Tickets',
    onDelete: 'CASCADE'
  });
  
  Event.hasMany(EventRegistration, { 
    foreignKey: 'eventId', 
    as: 'Registrations',
    onDelete: 'CASCADE'
  });
  
  Event.hasMany(EventCheckIn, { 
    foreignKey: 'eventId', 
    as: 'CheckIns',
    onDelete: 'CASCADE'
  });
  
  Event.hasMany(EventMessage, { 
    foreignKey: 'eventId', 
    as: 'Messages',
    onDelete: 'CASCADE'
  });

  // Ticket associations
  Ticket.belongsTo(Event, { 
    foreignKey: 'eventId', 
    as: 'Event',
    onDelete: 'CASCADE'
  });
  
  Ticket.hasMany(EventRegistration, { 
    foreignKey: 'ticketId', 
    as: 'Registrations',
    onDelete: 'CASCADE'
  });

  // EventRegistration associations
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
  
  EventRegistration.hasMany(EventCheckIn, { 
    foreignKey: 'registrationId', 
    as: 'CheckIns',
    onDelete: 'CASCADE'
  });

  // EventCheckIn associations
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
  
  EventCheckIn.belongsTo(User, { 
    foreignKey: 'checkedInBy', 
    as: 'CheckedInBy',
    onDelete: 'CASCADE'
  });

  // EventMessage associations
  EventMessage.belongsTo(Event, { 
    foreignKey: 'eventId', 
    as: 'Event',
    onDelete: 'CASCADE'
  });
  
  EventMessage.belongsTo(User, { 
    foreignKey: 'senderId', 
    as: 'Sender',
    onDelete: 'CASCADE'
  });

  // Organizer associations (if not already defined)
  if (Organizer) {
    Organizer.hasMany(Event, { 
      foreignKey: 'organizerId', 
      as: 'Events',
      onDelete: 'CASCADE'
    });
  }

  // User associations for Event CD
  User.hasMany(EventRegistration, { 
    foreignKey: 'userId', 
    as: 'EventRegistrations',
    onDelete: 'SET NULL'
  });
  
  User.hasMany(EventCheckIn, { 
    foreignKey: 'checkedInBy', 
    as: 'EventCheckIns',
    onDelete: 'CASCADE'
  });
  
  User.hasMany(EventMessage, { 
    foreignKey: 'senderId', 
    as: 'EventMessages',
    onDelete: 'CASCADE'
  });
};

module.exports = setupEventAssociations;