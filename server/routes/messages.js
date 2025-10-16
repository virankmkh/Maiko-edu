const express = require('express');
const router = express.Router();

// @route   GET /api/messages
// @desc    Get messages (placeholder)
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Messages endpoint - coming soon',
    data: []
  });
});

module.exports = router;
