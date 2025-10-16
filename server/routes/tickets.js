const express = require('express');
const { body, validationResult } = require('express-validator');
const { Event, Ticket, EventRegistration } = require('../config/database');
const organizerAuth = require('../middleware/organizerAuth');
const router = express.Router();

// @route   GET /api/tickets/event/:eventId
// @desc    Get all tickets for an event
// @access  Public
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    // First check if event exists and is public
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
        message: 'Event not found'
      });
    }

    const tickets = await Ticket.findAll({
      where: {
        eventId: eventId,
        isActive: true
      },
      order: [['order', 'ASC']]
    });

    // Add computed fields
    const ticketsWithComputedFields = tickets.map(ticket => ({
      ...ticket.toJSON(),
      isOnSale: ticket.isOnSale(),
      availableQuantity: ticket.getAvailableQuantity(),
      canPurchase: ticket.canPurchase(1)
    }));

    res.json({
      success: true,
      data: ticketsWithComputedFields
    });

  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets'
    });
  }
});

// @route   POST /api/tickets
// @desc    Create new ticket (Organizer only)
// @access  Private (Organizer)
router.post('/', [
  organizerAuth,
  body('eventId').isUUID().withMessage('Valid event ID required'),
  body('name').isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('type').isIn(['free', 'paid', 'donation']).withMessage('Invalid ticket type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('currency').isString().withMessage('Currency is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be positive'),
  body('description').optional().isString(),
  body('salesStartDate').optional().isISO8601(),
  body('salesEndDate').optional().isISO8601(),
  body('minOrderQuantity').optional().isInt({ min: 1 }),
  body('maxOrderQuantity').optional().isInt({ min: 1 }),
  body('benefits').optional().isArray()
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

    const { eventId, ...ticketData } = req.body;

    // Check if event exists and belongs to organizer
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

    // Validate sales dates
    if (ticketData.salesStartDate && ticketData.salesEndDate) {
      const salesStart = new Date(ticketData.salesStartDate);
      const salesEnd = new Date(ticketData.salesEndDate);
      
      if (salesStart >= salesEnd) {
        return res.status(400).json({
          success: false,
          message: 'Sales end date must be after start date'
        });
      }
    }

    // Validate order quantities
    if (ticketData.minOrderQuantity && ticketData.maxOrderQuantity) {
      if (ticketData.minOrderQuantity > ticketData.maxOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Min order quantity cannot be greater than max order quantity'
        });
      }
    }

    const ticket = await Ticket.create({
      ...ticketData,
      eventId: eventId
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ticket'
    });
  }
});

// @route   PUT /api/tickets/:id
// @desc    Update ticket (Organizer only)
// @access  Private (Organizer)
router.put('/:id', [
  organizerAuth,
  body('name').optional().isLength({ min: 2, max: 100 }),
  body('type').optional().isIn(['free', 'paid', 'donation']),
  body('price').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 1 }),
  body('salesStartDate').optional().isISO8601(),
  body('salesEndDate').optional().isISO8601()
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

    const ticket = await Ticket.findOne({
      where: { id: req.params.id },
      include: [{
        model: Event,
        as: 'Event',
        where: { organizerId: req.user.id }
      }]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or access denied'
      });
    }

    // Check if ticket has sales
    const salesCount = await EventRegistration.count({
      where: { ticketId: ticket.id }
    });

    if (salesCount > 0 && (req.body.price || req.body.type)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify price or type of ticket with existing sales'
      });
    }

    await ticket.update(req.body);

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticket'
    });
  }
});

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket (Organizer only)
// @access  Private (Organizer)
router.delete('/:id', [organizerAuth], async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      where: { id: req.params.id },
      include: [{
        model: Event,
        as: 'Event',
        where: { organizerId: req.user.id }
      }]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or access denied'
      });
    }

    // Check if ticket has sales
    const salesCount = await EventRegistration.count({
      where: { ticketId: ticket.id }
    });

    if (salesCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete ticket with existing sales. Deactivate it instead.'
      });
    }

    await ticket.destroy();

    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });

  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ticket'
    });
  }
});

// @route   PUT /api/tickets/:id/activate
// @desc    Activate/deactivate ticket (Organizer only)
// @access  Private (Organizer)
router.put('/:id/activate', [
  organizerAuth,
  body('isActive').isBoolean().withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    const { isActive } = req.body;

    const ticket = await Ticket.findOne({
      where: { id: req.params.id },
      include: [{
        model: Event,
        as: 'Event',
        where: { organizerId: req.user.id }
      }]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or access denied'
      });
    }

    await ticket.update({ isActive });

    res.json({
      success: true,
      message: `Ticket ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: ticket
    });

  } catch (error) {
    console.error('Toggle ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticket status'
    });
  }
});

// @route   GET /api/tickets/:id/stats
// @desc    Get ticket sales statistics (Organizer only)
// @access  Private (Organizer)
router.get('/:id/stats', [organizerAuth], async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      where: { id: req.params.id },
      include: [{
        model: Event,
        as: 'Event',
        where: { organizerId: req.user.id }
      }]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or access denied'
      });
    }

    const registrations = await EventRegistration.findAll({
      where: { ticketId: ticket.id },
      attributes: ['status', 'paymentStatus', 'totalAmount', 'createdAt']
    });

    const stats = {
      totalRegistrations: registrations.length,
      confirmedRegistrations: registrations.filter(r => r.status === 'confirmed').length,
      paidRegistrations: registrations.filter(r => r.paymentStatus === 'paid').length,
      pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
      cancelledRegistrations: registrations.filter(r => r.status === 'cancelled').length,
      totalRevenue: registrations
        .filter(r => r.paymentStatus === 'paid')
        .reduce((sum, r) => sum + parseFloat(r.totalAmount), 0),
      averageOrderValue: 0,
      salesByDate: {}
    };

    // Calculate average order value
    if (stats.paidRegistrations > 0) {
      stats.averageOrderValue = stats.totalRevenue / stats.paidRegistrations;
    }

    // Group sales by date
    registrations
      .filter(r => r.paymentStatus === 'paid')
      .forEach(registration => {
        const date = registration.createdAt.toISOString().split('T')[0];
        stats.salesByDate[date] = (stats.salesByDate[date] || 0) + 1;
      });

    res.json({
      success: true,
      data: {
        ticket: {
          id: ticket.id,
          name: ticket.name,
          type: ticket.type,
          price: ticket.price,
          currency: ticket.currency,
          quantity: ticket.quantity,
          soldQuantity: ticket.soldQuantity
        },
        stats
      }
    });

  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket statistics'
    });
  }
});

module.exports = router;
