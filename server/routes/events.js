const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Event, Organization, Ticket, EventRegistration } = require('../config/database').models;
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

    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
        include: [
          {
            model: Organization,
            as: 'Organizer',
            attributes: ['id', 'name', 'logo', 'description']
          },
        {
          model: Ticket,
          as: 'Tickets',
          attributes: ['id', 'name', 'price', 'currency', 'isFree', 'status']
        }
      ],
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

    const event = await Event.findOne({
      where: { id, isPublic: true, isPublished: true },
      include: [
        {
          model: Organization,
          as: 'Organizer',
          attributes: ['id', 'name', 'companyName', 'logo', 'description', 'website']
        },
        {
          model: Ticket,
          as: 'Tickets',
          attributes: ['id', 'name', 'description', 'price', 'currency', 'isFree', 'status', 'quantityAvailable', 'quantitySold']
        }
      ]
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

    const event = await Event.findOne({
      where: { slug, isPublic: true, isPublished: true },
      include: [
        {
          model: Organization,
          as: 'Organizer',
          attributes: ['id', 'name', 'companyName', 'logo', 'description', 'website']
        },
        {
          model: Ticket,
          as: 'Tickets',
          attributes: ['id', 'name', 'description', 'price', 'currency', 'isFree', 'status', 'quantityAvailable', 'quantitySold']
        }
      ]
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
