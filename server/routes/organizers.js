const express = require('express');
const router = express.Router();

// @route   GET /api/organizers
// @desc    Get organizers (placeholder)
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Organizers endpoint - coming soon',
    data: []
  });
});

module.exports = router;
