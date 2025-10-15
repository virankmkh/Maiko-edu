const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize, models } = require('../config/database');
const CourseEnrollment = models.CourseEnrollment;
const Course = models.Course;
const User = models.User;
const Lesson = models.Lesson;
const auth = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll student in a course
// @access  Private (Student)
router.post('/', [
  auth,
  body('courseId', 'Course ID is required').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({
      where: { userId: req.user.id, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment with free status (first lesson free)
    const enrollment = await CourseEnrollment.create({
      userId: req.user.id,
      courseId,
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
      paymentStatus: 'free' // Start with free access to first lesson
    });

    // Increment course enrollment count
    course.currentEnrollments += 1;
    await course.save();

    res.json({ 
      message: 'Successfully enrolled in course',
      enrollment 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/student
// @desc    Get student's enrollments
// @access  Private (Student)
router.get('/student', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await CourseEnrollment.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: Course, 
          as: 'course',
          include: [
            { model: User, as: 'instructor', attributes: ['firstName', 'lastName'] }
          ]
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    res.json({ enrollments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/course/:courseId
// @desc    Get students enrolled in a specific course
// @access  Private (Instructor/Course Owner)
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is instructor or course owner
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await CourseEnrollment.findAll({
      where: { courseId },
      include: [
        { 
          model: User, 
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    res.json({ enrollments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/enrollments/:enrollmentId/progress
// @desc    Update student progress
// @access  Private (Student)
router.put('/:enrollmentId/progress', [
  auth,
  body('progress', 'Progress must be between 0 and 100').isInt({ min: 0, max: 100 }),
  body('completedLessons', 'Completed lessons must be an array').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { enrollmentId } = req.params;
    const { progress, completedLessons } = req.body;

    // Find enrollment
    const enrollment = await CourseEnrollment.findByPk(enrollmentId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user owns this enrollment
    if (enrollment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update progress
    enrollment.progress = progress;
    enrollment.lastAccessedAt = new Date();
    
    if (completedLessons) {
      enrollment.completedLessons = completedLessons;
    }

    // Mark as completed if progress is 100%
    if (progress === 100) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.json({ 
      message: 'Progress updated successfully',
      enrollment 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/instructor/students
// @desc    Get all students for instructor's courses
// @access  Private (Instructor)
router.get('/instructor/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get instructor's courses
    const courses = await Course.findAll({
      where: { instructorId: req.user.id },
      attributes: ['id', 'title']
    });

    const courseIds = courses.map(course => course.id);

    // Get all enrollments for instructor's courses
    const enrollments = await CourseEnrollment.findAll({
      where: { 
        courseId: { [Op.in]: courseIds }
      },
      include: [
        { 
          model: User, 
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        { 
          model: Course, 
          as: 'course',
          attributes: ['id', 'title']
        }
      ],
      order: [['enrolledAt', 'DESC']],
      limit: 20 // Recent students only
    });

    res.json({ enrollments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/enrollments/payment
// @desc    Process course payment
// @access  Private (Student)
router.post('/payment', [
  auth,
  body('courseId', 'Course ID is required').isInt(),
  body('paymentMethod', 'Payment method is required').isIn(['stripe', 'paypal', 'orange_money', 'vodacom_mpesa', 'bank_transfer']),
  body('paymentData', 'Payment data is required').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can make payments' });
    }

    const { courseId, paymentMethod, paymentData } = req.body;

    const result = await paymentService.processCoursePayment(
      req.user.id,
      courseId,
      paymentMethod,
      paymentData
    );

    if (result.success) {
      res.json({
        message: 'Payment processed successfully',
        payment: result.payment,
        enrollment: result.enrollment
      });
    } else {
      res.status(400).json({
        message: 'Payment failed',
        error: result.error
      });
    }

  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/:courseId/payment-status
// @desc    Get payment status for a course
// @access  Private (Student)
router.get('/:courseId/payment-status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { courseId } = req.params;
    const status = await paymentService.getCoursePaymentStatus(req.user.id, courseId);

    res.json(status);
  } catch (err) {
    console.error('Payment status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/enrollments/:courseId/lesson/:lessonId/access
// @desc    Check if user has access to a specific lesson
// @access  Private (Student)
router.get('/:courseId/lesson/:lessonId/access', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { courseId, lessonId } = req.params;
    const access = await paymentService.checkLessonAccess(req.user.id, courseId, lessonId);

    res.json(access);
  } catch (err) {
    console.error('Lesson access check error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
