const express = require('express');
const { body, validationResult } = require('express-validator');
const Affiliate = require('../models/Affiliate');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/affiliate/profile
// @desc    Get affiliate profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id });
    
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    res.json(affiliate);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/affiliate/performance
// @desc    Get affiliate performance metrics
// @access  Private
router.get('/performance', auth, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id });
    
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    const performance = affiliate.getPerformanceSummary();
    res.json(performance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/affiliate/commissions
// @desc    Get affiliate commissions
// @access  Private
router.get('/commissions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id });
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    let commissions = affiliate.commissions;
    
    if (status) {
      commissions = commissions.filter(comm => comm.status === status);
    }

    const total = commissions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCommissions = commissions.slice(startIndex, endIndex);

    res.json({
      commissions: paginatedCommissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/affiliate/payment-method
// @desc    Update payment method
// @access  Private
router.put('/payment-method', [
  auth,
  body('paymentMethod.type').isIn(['paypal', 'bank_transfer', 'stripe', 'crypto']),
  body('paymentMethod.details').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id });
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    affiliate.paymentMethod = req.body.paymentMethod;
    await affiliate.save();

    res.json({ message: 'Payment method updated successfully', affiliate });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/affiliate/payout-settings
// @desc    Update payout settings
// @access  Private
router.put('/payout-settings', [
  auth,
  body('payoutThreshold').isNumeric(),
  body('autoPayout').isBoolean(),
  body('payoutSchedule').isIn(['weekly', 'monthly', 'quarterly'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id });
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    affiliate.payoutThreshold = req.body.payoutThreshold;
    affiliate.autoPayout = req.body.autoPayout;
    affiliate.payoutSchedule = req.body.payoutSchedule;

    await affiliate.save();

    res.json({ message: 'Payout settings updated successfully', affiliate });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/affiliate/marketing-links
// @desc    Get marketing links
// @access  Private
router.get('/marketing-links', auth, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id });
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    res.json(affiliate.marketingLinks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/affiliate/marketing-links
// @desc    Create marketing link
// @access  Private
router.post('/marketing-links', [
  auth,
  body('name', 'Link name is required').notEmpty().trim(),
  body('url', 'Valid URL is required').isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id });
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    affiliate.marketingLinks.push({
      name: req.body.name,
      url: req.body.url
    });

    await affiliate.save();

    res.json({ message: 'Marketing link created successfully', affiliate });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/affiliate/referrals
// @desc    Get referral list
// @access  Private
router.get('/referrals', auth, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ affiliateId: req.user.id })
      .populate('referredUsers.userId', 'firstName lastName email');

    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate profile not found' });
    }

    res.json(affiliate.referredUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
