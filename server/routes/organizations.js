const express = require('express');
const { body, validationResult } = require('express-validator');
const Organization = require('../models/Organization');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/organizations
// @desc    Get all active organizations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, type, language = 'en' } = req.query;
    
    const query = { 
      isActive: true, 
      status: 'active',
      language 
    };
    
    if (type) query.type = type;

    const organizations = await Organization.find(query)
      .select('name displayName description logo type industry totalCourses totalStudents averageRating')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Organization.countDocuments(query);

    res.json({
      organizations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/organizations/:id
// @desc    Get organization by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('totalCourses')
      .populate('totalStudents');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Increment view count
    organization.views += 1;
    await organization.save();

    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/organizations
// @desc    Create new organization
// @access  Private (Admin only)
router.post('/', [
  auth,
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Valid email is required').isEmail().normalizeEmail(),
  body('description', 'Description is required').notEmpty().trim(),
  body('type', 'Type is required').isIn(['university', 'college', 'company', 'training_center', 'individual', 'other']),
  body('language', 'Language is required').isIn(['en', 'fr'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, email, description, type, language } = req.body;

    // Check if organization already exists
    let organization = await Organization.findOne({ email });
    if (organization) {
      return res.status(400).json({ message: 'Organization with this email already exists' });
    }

    // Generate affiliate code
    const affiliateCode = `ORG${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

    organization = new Organization({
      name,
      email,
      description,
      type,
      language,
      affiliateCode,
      logo: req.body.logo || '/default-org-logo.png'
    });

    await organization.save();

    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/organizations/:id
// @desc    Update organization
// @access  Private (Organization admin or super admin)
router.put('/:id', [
  auth,
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('type').optional().isIn(['university', 'college', 'company', 'training_center', 'individual', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        (req.user.role !== 'organization_admin' || req.user.organizationId?.toString() !== req.params.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedOrganization);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/organizations/:id/courses
// @desc    Get courses by organization
// @access  Public
router.get('/:id/courses', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const Course = require('../models/Course');
    const courses = await Course.find({ 
      organizationId: req.params.id, 
      isPublished: true 
    })
    .populate('instructorId', 'firstName lastName')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const total = await Course.countDocuments({ 
      organizationId: req.params.id, 
      isPublished: true 
    });

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/organizations/:id/verify
// @desc    Verify organization
// @access  Private (Admin only)
router.put('/:id/verify', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    organization.isVerified = true;
    organization.verificationStatus = 'verified';
    organization.verifiedBy = req.user.id;
    organization.verifiedAt = new Date();

    await organization.save();

    res.json({ message: 'Organization verified successfully', organization });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
