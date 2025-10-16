const express = require('express');
const router = express.Router();

// @route   GET /api/event-test
// @desc    Test Event CD models loading
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Test loading Event CD models
    const { models } = require('../config/database');
    
    res.json({
      success: true,
      message: 'Event CD models loaded successfully',
      models: {
        Event: models.Event ? 'Loaded' : 'Failed',
        Ticket: models.Ticket ? 'Loaded' : 'Failed',
        EventRegistration: models.EventRegistration ? 'Loaded' : 'Failed',
        EventCheckIn: models.EventCheckIn ? 'Loaded' : 'Failed',
        EventMessage: models.EventMessage ? 'Loaded' : 'Failed'
      },
      allModels: Object.keys(models),
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
