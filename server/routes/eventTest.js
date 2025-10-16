const express = require('express');
const router = express.Router();

// @route   GET /api/event-test
// @desc    Test Event CD models loading
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Test loading Event CD models
    const { Event, Ticket, EventRegistration, EventCheckIn, EventMessage } = require('../config/database');
    
    res.json({
      success: true,
      message: 'Event CD models loaded successfully',
      models: {
        Event: Event ? 'Loaded' : 'Failed',
        Ticket: Ticket ? 'Loaded' : 'Failed',
        EventRegistration: EventRegistration ? 'Loaded' : 'Failed',
        EventCheckIn: EventCheckIn ? 'Loaded' : 'Failed',
        EventMessage: EventMessage ? 'Loaded' : 'Failed'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading Event CD models',
      error: error.message
    });
  }
});

module.exports = router;
