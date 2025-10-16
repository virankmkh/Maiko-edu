const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Event, Ticket, EventRegistration, Organizer } = require('../config/database');
const auth = require('../middleware/auth');
const organizerAuth = require('../middleware/organizerAuth');
const router = express.Router();

// @route   GET /api/events
// @desc    Get all public events with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isIn(['conference', 'workshop', 'seminar', 'summit', 'exhibition', 'networking', 'other']),
  query('eventType').optional().isIn(['online', 'offline', 'hybrid']),
  query('city').optional().isString(),
  query('country').optional().isString(),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['startDate', 'createdAt', 'title']),
  query('sortOrder').optional().isIn(['ASC', 'DESC'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      eventType,
      city,
      country,
      search,
      sortBy = 'startDate',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {
      isPublic: true,
      isPublished: true,
      status: 'published'
    };

    // Apply filters
    if (category) whereClause.category = category;
    if (eventType) whereClause.eventType = eventType;
    if (city) whereClause.city = city;
    if (country) whereClause.country = country;

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { shortDescription: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Organizer,
          as: 'Organizer',
          attributes: ['id', 'companyName', 'logo']
        },
        {
          model: Ticket,
          as: 'Tickets',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'type', 'price', 'currency', 'isOnSale']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Add computed fields
    const eventsWithComputedFields = events.map(event => ({
      ...event.toJSON(),
      isRegistrationOpen: event.isRegistrationOpen(),
      isFullyBooked: event.isFullyBooked(),
      availableSpots: event.getAvailableSpots(),
      hasTickets: event.Tickets && event.Tickets.length > 0,
      minPrice: event.Tickets && event.Tickets.length > 0 
        ? Math.min(...event.Tickets.map(t => t.price))
        : 0,
      maxPrice: event.Tickets && event.Tickets.length > 0 
        ? Math.max(...event.Tickets.map(t => t.price))
        : 0
    }));

    res.json({
      success: true,
      data: eventsWithComputedFields,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID or slug
// @access  Public
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    const whereClause = isUUID ? { id: identifier } : { slug: identifier };

    const event = await Event.findOne({
      where: {
        ...whereClause,
        isPublic: true,
        isPublished: true,
        status: 'published'
      },
      include: [
        {
          model: Organizer,
          as: 'Organizer',
          attributes: ['id', 'companyName', 'logo', 'website', 'description']
        },
        {
          model: Ticket,
          as: 'Tickets',
          where: { isActive: true },
          required: false,
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Add computed fields
    const eventData = {
      ...event.toJSON(),
      isRegistrationOpen: event.isRegistrationOpen(),
      isFullyBooked: event.isFullyBooked(),
      availableSpots: event.getAvailableSpots(),
      hasTickets: event.Tickets && event.Tickets.length > 0
    };

    res.json({
      success: true,
      data: eventData
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event (Organizer only)
// @access  Private (Organizer)
router.post('/', [
  organizerAuth,
  body('title').isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['conference', 'workshop', 'seminar', 'summit', 'exhibition', 'networking', 'other']),
  body('eventType').isIn(['online', 'offline', 'hybrid']),
  body('startDate').isISO8601().withMessage('Start date must be valid ISO 8601 format'),
  body('endDate').isISO8601().withMessage('End date must be valid ISO 8601 format'),
  body('location').optional().isString(),
  body('address').optional().isString(),
  body('city').optional().isString(),
  body('country').optional().isString(),
  body('maxAttendees').optional().isInt({ min: 1 }),
  body('tags').optional().isArray()
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

    const eventData = {
      ...req.body,
      organizerId: req.user.id
    };

    // Validate dates
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (startDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event (Organizer only)
// @access  Private (Organizer)
router.put('/:id', [
  organizerAuth,
  body('title').optional().isLength({ min: 3, max: 200 }),
  body('description').optional().isLength({ min: 10 }),
  body('category').optional().isIn(['conference', 'workshop', 'seminar', 'summit', 'exhibition', 'networking', 'other']),
  body('eventType').optional().isIn(['online', 'offline', 'hybrid']),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
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

    const event = await Event.findOne({
      where: {
        id: req.params.id,
        organizerId: req.user.id
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or access denied'
      });
    }

    // Validate dates if provided
    if (req.body.startDate || req.body.endDate) {
      const startDate = new Date(req.body.startDate || event.startDate);
      const endDate = new Date(req.body.endDate || event.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    await event.update(req.body);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (Organizer only)
// @access  Private (Organizer)
router.delete('/:id', [organizerAuth], async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        organizerId: req.user.id
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or access denied'
      });
    }

    // Check if event has registrations
    const registrationCount = await EventRegistration.count({
      where: { eventId: event.id }
    });

    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with existing registrations. Cancel the event instead.'
      });
    }

    await event.destroy();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event'
    });
  }
});

// @route   GET /api/events/organizer/my-events
// @desc    Get organizer's events
// @access  Private (Organizer)
router.get('/organizer/my-events', [organizerAuth], async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { organizerId: req.user.id };
    if (status) whereClause.status = status;

    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Ticket,
          as: 'Tickets',
          attributes: ['id', 'name', 'type', 'price', 'soldQuantity', 'quantity']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
});

module.exports = router;
