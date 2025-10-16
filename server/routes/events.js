const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
let models, Event, Organization, Ticket, EventRegistration;

try {
  models = require('../config/database').models;
  Event = models.Event;
  Organization = models.Organization;
  Ticket = models.Ticket;
  EventRegistration = models.EventRegistration;
} catch (error) {
  console.error('Failed to load models in events route:', error.message);
  Event = null;
  Organization = null;
  Ticket = null;
  EventRegistration = null;
}
const router = express.Router();

// @route   GET /api/events/test
// @desc    Test if events route is working
// @access  Public
router.get('/test', (req, res) => {
  try {
    const availableModels = models ? Object.keys(models) : [];
    res.json({ 
      message: 'Events route is working!', 
      models: availableModels,
      eventModel: !!Event,
      organizationModel: !!Organization,
      ticketModel: !!Ticket,
      registrationModel: !!EventRegistration
    });
  } catch (error) {
    res.json({ 
      message: 'Events route loaded but models failed', 
      error: error.message,
      eventModel: !!Event
    });
  }
});

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

    // Build where clause
    const whereClause = {
      isPublic: true,
      isPublished: true,
      status: 'published'
    };

    if (category) whereClause.category = category;
    if (eventType) whereClause.eventType = eventType;
    if (city) whereClause.city = city;
    if (country) whereClause.country = country;

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { shortDescription: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (!Event) {
      console.error('Event model not available in models:', Object.keys(models));
      return res.status(500).json({ message: 'Event model not available' });
    }

    // Temporarily disable includes to avoid association errors
    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalEvents: count,
        hasNext: offset + events.length < count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Temporarily disable includes to avoid association errors
    const event = await Event.findOne({
      where: { id, isPublic: true, isPublished: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
});

// @route   GET /api/events/slug/:slug
// @desc    Get event by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Temporarily disable includes to avoid association errors
    const event = await Event.findOne({
      where: { slug, isPublic: true, isPublished: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
});

module.exports = router;
