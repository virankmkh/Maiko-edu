const express = require('express');
const router = express.Router();

// @route   GET /api/check-ins
// @desc    Get check-ins (placeholder)
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Check-ins endpoint - coming soon',
    data: []
  });
});

module.exports = router;
