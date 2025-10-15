const express = require('express');
const { body, validationResult } = require('express-validator');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
// @access  Public (for verification)
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('courseId', 'title thumbnail')
      .populate('studentId', 'firstName lastName')
      .populate('organizationId', 'name displayName');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/verify/:code
// @desc    Verify certificate by verification code
// @access  Public
router.get('/verify/:code', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ verificationCode: req.params.code })
      .populate('courseId', 'title thumbnail')
      .populate('studentId', 'firstName lastName')
      .populate('organizationId', 'name displayName');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({
      isValid: certificate.isValid(),
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        organizationName: certificate.organizationName,
        issueDate: certificate.issueDate,
        status: certificate.getStatus()
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/certificates/generate
// @desc    Generate certificate for course completion
// @access  Private (Student must be enrolled and completed)
router.post('/generate', [
  auth,
  body('courseId', 'Course ID is required').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.body;

    // Check if user is enrolled and completed the course
    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    if (enrollment.progress < 100) {
      return res.status(400).json({ message: 'Course not completed yet' });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      courseId,
      studentId: req.user.id
    });

    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already exists' });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Generate certificate
    const certificate = new Certificate({
      courseId,
      studentId: req.user.id,
      organizationId: course.organizationId,
      completedAt: new Date(),
      totalLessons: course.totalLessons,
      completedLessons: course.totalLessons,
      studentName: `${user.firstName} ${user.lastName}`,
      courseName: course.title,
      organizationName: course.organizationId.name,
      instructorName: course.instructorId.firstName + ' ' + course.instructorId.lastName,
      language: user.language || 'en',
      certificateUrl: `/certificates/${Date.now()}-${req.user.id}.pdf`
    });

    await certificate.save();

    // Add certificate to user
    user.certificates.push({
      courseId,
      issuedAt: new Date(),
      certificateUrl: certificate.certificateUrl
    });

    await user.save();

    res.json({ 
      message: 'Certificate generated successfully', 
      certificate 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/user/:userId
// @desc    Get user's certificates
// @access  Private (User or admin)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check permissions
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const certificates = await Certificate.find({ studentId: req.params.userId })
      .populate('courseId', 'title thumbnail')
      .populate('organizationId', 'name displayName');

    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/certificates/:id/issue
// @desc    Issue certificate
// @access  Private (Admin or organization admin)
router.put('/:id/issue', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        (req.user.role !== 'organization_admin' || 
         req.user.organizationId?.toString() !== certificate.organizationId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    certificate.issue(req.user.id);
    await certificate.save();

    res.json({ message: 'Certificate issued successfully', certificate });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/certificates/:id/revoke
// @desc    Revoke certificate
// @access  Private (Admin only)
router.put('/:id/revoke', [
  auth,
  body('reason', 'Revocation reason is required').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.revoke(req.user.id, req.body.reason);
    await certificate.save();

    res.json({ message: 'Certificate revoked successfully', certificate });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
