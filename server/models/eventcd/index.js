const { sequelize } = require('../config/database');

// Import models
const Organizer = require('./Organizer');
const Event = require('./Event');
const Ticket = require('./Ticket');
const Registration = require('./Registration');
const CheckIn = require('./CheckIn');

// Initialize models
const models = {
  Organizer: Organizer(sequelize),
  Event: Event(sequelize),
  Ticket: Ticket(sequelize),
  Registration: Registration(sequelize),
  CheckIn: CheckIn(sequelize)
};

// Set up associations
const setupAssociations = () => {
  const { Organizer, Event, Ticket, Registration, CheckIn } = models;

  // Organizer associations
  Organizer.hasMany(Event, {
    foreignKey: 'organizerId',
    as: 'Events',
    onDelete: 'CASCADE'
  });

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

  Event.hasMany(Registration, {
    foreignKey: 'eventId',
    as: 'Registrations',
    onDelete: 'CASCADE'
  });

  // Ticket associations
  Ticket.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'Event',
    onDelete: 'CASCADE'
  });

  Ticket.hasMany(Registration, {
    foreignKey: 'ticketId',
    as: 'Registrations',
    onDelete: 'SET NULL'
  });

  // Registration associations
  Registration.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'Event',
    onDelete: 'CASCADE'
  });

  Registration.belongsTo(Ticket, {
    foreignKey: 'ticketId',
    as: 'Ticket',
    onDelete: 'SET NULL'
  });

  Registration.hasOne(CheckIn, {
    foreignKey: 'registrationId',
    as: 'CheckIn',
    onDelete: 'CASCADE'
  });

  // CheckIn associations
  CheckIn.belongsTo(Registration, {
    foreignKey: 'registrationId',
    as: 'Registration',
    onDelete: 'CASCADE'
  });

  CheckIn.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'Event',
    onDelete: 'CASCADE'
  });

  CheckIn.belongsTo(Organizer, {
    foreignKey: 'checkedInBy',
    as: 'CheckedInBy',
    onDelete: 'SET NULL'
  });
};

// Initialize associations
setupAssociations();

// Add instance methods to Event model
const EventModel = models.Event;

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

module.exports = {
  sequelize,
  ...models
};
