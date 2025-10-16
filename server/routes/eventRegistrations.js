const express = require('express');
const { body, validationResult } = require('express-validator');
const { Event, Ticket, EventRegistration, User } = require('../config/database');
const auth = require('../middleware/auth');
const organizerAuth = require('../middleware/organizerAuth');
const router = express.Router();

// @route   POST /api/event-registrations
// @desc    Register for an event
// @access  Public (with optional authentication)
router.post('/', [
  body('eventId').isUUID().withMessage('Valid event ID required'),
  body('ticketId').isUUID().withMessage('Valid ticket ID required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('guestName').optional().isString().isLength({ min: 2, max: 100 }),
  body('guestEmail').optional().isEmail().withMessage('Valid email required'),
  body('guestPhone').optional().isString(),
  body('customFields').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { eventId, ticketId, quantity, guestName, guestEmail, guestPhone, customFields } = req.body;
    const userId = req.user ? req.user.id : null;

    // Validate that either user is authenticated or guest info is provided
    if (!userId && (!guestName || !guestEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Either user authentication or guest information is required'
      });
    }

    // Get event and ticket
    const event = await Event.findOne({
      where: {
        id: eventId,
        isPublic: true,
        isPublished: true,
        status: 'published'
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or not available for registration'
      });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not open for this event'
      });
    }

    // Check if event is fully booked
    if (event.isFullyBooked()) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked'
      });
    }

    const ticket = await Ticket.findOne({
      where: {
        id: ticketId,
        eventId: eventId,
        isActive: true
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or not available'
      });
    }

    // Check if ticket can be purchased
    if (!ticket.canPurchase(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot purchase this quantity of tickets'
      });
    }

    // Check for existing registration
    const existingRegistration = await EventRegistration.findOne({
      where: {
        eventId: eventId,
        [userId ? 'userId' : 'guestEmail']: userId || guestEmail
      }
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Calculate total amount
    const totalAmount = ticket.price * quantity;

    // Create registration
    const registrationData = {
      eventId,
      ticketId,
      userId,
      guestEmail,
      guestName,
      guestPhone,
      quantity,
      totalAmount,
      currency: ticket.currency,
      status: ticket.requiresApproval ? 'pending' : 'confirmed',
      paymentStatus: ticket.type === 'free' ? 'paid' : 'pending',
      customFields: customFields || {}
    };

    const registration = await EventRegistration.create(registrationData);

    // Update ticket sold quantity
    await ticket.increment('soldQuantity', { by: quantity });

    // Update event attendee count
    if (registration.status === 'confirmed') {
      await event.increment('currentAttendees', { by: quantity });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        registration: {
          id: registration.id,
          status: registration.status,
          paymentStatus: registration.paymentStatus,
          qrCode: registration.qrCode,
          totalAmount: registration.totalAmount,
          currency: registration.currency
        },
        event: {
          id: event.id,
          title: event.title,
          startDate: event.startDate,
          location: event.location
        },
        ticket: {
          id: ticket.id,
          name: ticket.name,
          type: ticket.type
        }
      }
    });

  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration'
    });
  }
});

// @route   GET /api/event-registrations/my-registrations
// @desc    Get user's event registrations
// @access  Private (User)
router.get('/my-registrations', [auth], async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) whereClause.status = status;

    const { count, rows: registrations } = await EventRegistration.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Event,
          as: 'Event',
          attributes: ['id', 'title', 'startDate', 'endDate', 'location', 'coverImage']
        },
        {
          model: Ticket,
          as: 'Ticket',
          attributes: ['id', 'name', 'type', 'price', 'currency']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: registrations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations'
    });
  }
});

// @route   GET /api/event-registrations/:id
// @desc    Get single registration details
// @access  Private (User or Organizer)
router.get('/:id', [auth], async (req, res) => {
  try {
    const registration = await EventRegistration.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Event,
          as: 'Event',
          include: [{
            model: require('../models/Organizer'),
            as: 'Organizer',
            attributes: ['id', 'companyName', 'logo']
          }]
        },
        {
          model: Ticket,
          as: 'Ticket'
        },
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check access permissions
    const isOwner = registration.userId === req.user.id;
    const isOrganizer = req.user.role === 'organizer' && 
                       registration.Event.organizerId === req.user.id;

    if (!isOwner && !isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration'
    });
  }
});

// @route   PUT /api/event-registrations/:id/cancel
// @desc    Cancel event registration
// @access  Private (User)
router.put('/:id/cancel', [
  auth,
  body('reason').optional().isString()
], async (req, res) => {
  try {
    const { reason } = req.body;

    const registration = await EventRegistration.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Event,
        as: 'Event'
      }]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (!registration.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Registration cannot be cancelled'
      });
    }

    // Check cancellation deadline
    const event = registration.Event;
    if (event.settings.cancellationDeadline) {
      const deadline = new Date(event.settings.cancellationDeadline);
      if (new Date() > deadline) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation deadline has passed'
        });
      }
    }

    await registration.update({
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date()
    });

    // Update ticket and event counts
    await registration.Ticket.decrement('soldQuantity', { by: registration.quantity });
    await event.decrement('currentAttendees', { by: registration.quantity });

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling registration'
    });
  }
});

// @route   GET /api/event-registrations/event/:eventId
// @desc    Get event registrations (Organizer only)
// @access  Private (Organizer)
router.get('/event/:eventId', [organizerAuth], async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const offset = (page - 1) * limit;

    // Verify event belongs to organizer
    const event = await Event.findOne({
      where: {
        id: eventId,
        organizerId: req.user.id
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or access denied'
      });
    }

    const whereClause = { eventId };
    if (status) whereClause.status = status;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;

    const { count, rows: registrations } = await EventRegistration.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Ticket,
          as: 'Ticket',
          attributes: ['id', 'name', 'type', 'price']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: registrations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations'
    });
  }
});

// @route   PUT /api/event-registrations/:id/approve
// @desc    Approve pending registration (Organizer only)
// @access  Private (Organizer)
router.put('/:id/approve', [organizerAuth], async (req, res) => {
  try {
    const registration = await EventRegistration.findOne({
      where: { id: req.params.id },
      include: [{
        model: Event,
        as: 'Event',
        where: { organizerId: req.user.id }
      }]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found or access denied'
      });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Registration is not pending approval'
      });
    }

    await registration.update({
      status: 'confirmed'
    });

    // Update event attendee count
    await registration.Event.increment('currentAttendees', { by: registration.quantity });

    res.json({
      success: true,
      message: 'Registration approved successfully'
    });

  } catch (error) {
    console.error('Approve registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving registration'
    });
  }
});

module.exports = router;
