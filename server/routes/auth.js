const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { models } = require('../config/database');
const User = models.User;
const Organization = models.Organization;
const Affiliate = models.Affiliate;
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/auth
// @desc    Get auth endpoints info
// @access  Public
router.get('/', (req, res) => {
  res.json({
    message: 'Auth API endpoints',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      refresh: 'POST /api/auth/refresh',
      forgotPassword: 'POST /api/auth/forgot-password',
      resetPassword: 'POST /api/auth/reset-password',
      changePassword: 'PUT /api/auth/change-password',
      verifyEmail: 'POST /api/auth/verify-email',
      logout: 'POST /api/auth/logout'
    }
  });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('firstName', 'First name is required').notEmpty().trim(),
  body('lastName', 'Last name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('userType', 'Invalid user type').isIn(['student', 'lecturer', 'organization']),
  body('organizationId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, userType, organizationId, affiliateCode, phone, dateOfBirth, organizationName, linkedinProfile } = req.body;
    
    // Map userType to role
    const roleMap = {
      'student': 'student',
      'lecturer': 'instructor', 
      'organization': 'organization_admin'
    };
    const role = roleMap[userType];

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if organization exists if provided
    if (organizationId && role !== 'student') {
      const organization = await Organization.findByPk(organizationId);
      if (!organization) {
        return res.status(400).json({ message: 'Organization not found' });
      }
    }

    // Create user
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      organizationId: organizationId || null,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      linkedinProfile: linkedinProfile || null
    });

    // Generate affiliate code if user is a student
    if (role === 'student') {
      user.affiliateCode = user.generateAffiliateCode();
      await user.save();
    }

    // Create affiliate profile for students
    if (role === 'student') {
      const affiliate = await Affiliate.create({
        affiliateId: user.id,
        affiliateCode: user.affiliateCode
      });
    }

    // Handle referral if affiliate code provided
    if (affiliateCode && role === 'student') {
      const referrer = await User.findOne({ where: { affiliateCode } });
      if (referrer) {
        user.referredBy = referrer.id;
        referrer.referralCount += 1;
        await referrer.save();
        
        // Update affiliate profile
        const referrerAffiliate = await Affiliate.findOne({ where: { affiliateId: referrer.id } });
        if (referrerAffiliate) {
          await referrerAffiliate.addReferral(user.id);
        }
      }
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        organizationId: user.organizationId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            affiliateCode: user.affiliateCode
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account has been deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        organizationId: user.organizationId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            affiliateCode: user.affiliateCode,
            isVerified: user.isVerified
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Organization,
        as: 'organization',
        attributes: ['name', 'displayName', 'logo']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        organizationId: user.organizationId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email', 'Please include a valid email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // In a real application, you would send this via email
    // For now, we'll just return the token
    res.json({ 
      message: 'Password reset email sent',
      resetToken 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token', 'Reset token is required').notEmpty(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password
    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    if (err.name === 'TokenExpiredError') {
              return res.status(400).json({ message: 'Token has expired' });
    }
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', [
  auth,
  body('currentPassword', 'Current password is required').exists(),
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Private
router.post('/verify-email', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // In a real application, you would send a verification email
    // For now, we'll just mark as verified
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
