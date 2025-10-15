const express = require('express');
const { body, validationResult } = require('express-validator');
const { models } = require('../config/database');
const User = models.User;
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for testing)
// @access  Private (Admin/Instructor)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (req.user.role !== 'admin' && req.user.role !== 'organization_admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'isVerified', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({ users });
  } catch (err) {
    console.error('Users route error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('organizationId', 'name displayName logo');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('bio').optional().trim(),
  body('phone').optional().trim(),
  body('country').optional().trim(),
  body('language').optional().isIn(['en', 'fr'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/enrolled-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/enrolled-courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'title thumbnail description totalLessons totalDuration'
      });

    res.json(user.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/certificates
// @desc    Get user's certificates
// @access  Private
router.get('/certificates', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'certificates.courseId',
        select: 'title thumbnail'
      });

    res.json(user.certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
