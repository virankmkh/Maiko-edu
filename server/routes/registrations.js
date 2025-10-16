const express = require('express');
const router = express.Router();

// @route   GET /api/registrations
// @desc    Get registrations (placeholder)
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Registrations endpoint - coming soon',
    data: []
  });
});

module.exports = router;
