const express = require('express');
const auth = require('../middleware/auth');
const { sequelize, models } = require('../config/database');

const router = express.Router();

// @route   GET /api/simple-students/:id
// @desc    Get course students - simple version
// @access  Private (Instructor/Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    
    console.log('🔍 Fetching students for course:', courseId);
    console.log('👤 User:', req.user.email, req.user.role);
    
    // Check if user is instructor or admin
    if (req.user.role !== 'instructor' && req.user.role !== 'admin' && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get course to verify ownership
    const course = await models.Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('📚 Course found:', course.title);

    // Check if instructor owns this course
    if (req.user.role === 'instructor' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('✅ Access granted');

    // Get enrollments with students using raw SQL to avoid case issues
    const [enrollments] = await sequelize.query(`
      SELECT 
        ce.id as enrollment_id,
        ce."userId" as student_id,
        ce.progress,
        ce."isActive",
        ce."enrolledAt",
        ce."lastAccessedAt",
        ce."completedAt",
        u."firstName",
        u."lastName",
        u.email
      FROM course_enrollments ce
      LEFT JOIN users u ON ce."userId" = u.id
      WHERE ce."courseId" = :courseId
      ORDER BY ce."enrolledAt" DESC
    `, {
      replacements: { courseId: courseId }
    });

    console.log('👥 Enrollments found:', enrollments.length);

    // Calculate statistics
    const totalStudents = enrollments.length;
    const currentStudents = enrollments.filter(e => e.isActive && e.progress < 100).length;
    const completedStudents = enrollments.filter(e => e.progress === 100).length;

    console.log('📊 Statistics:', { totalStudents, currentStudents, completedStudents });

    // Create student lists
    const totalStudentsList = enrollments.map(e => ({
      id: e.student_id,
      name: `${e.firstName} ${e.lastName}`,
      email: e.email,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt,
      isActive: e.isActive
    }));

    const currentStudentsList = enrollments
      .filter(e => e.isActive && e.progress < 100)
      .map(e => ({
        id: e.student_id,
        name: `${e.firstName} ${e.lastName}`,
        email: e.email,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
        lastAccessedAt: e.lastAccessedAt,
        isActive: e.isActive
      }));

    const completedStudentsList = enrollments
      .filter(e => e.progress === 100)
      .map(e => ({
        id: e.student_id,
        name: `${e.firstName} ${e.lastName}`,
        email: e.email,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
        completedAt: e.completedAt,
        isActive: e.isActive
      }));

    const response = {
      statistics: {
        totalStudents,
        currentStudents,
        completedStudents
      },
      students: {
        total: totalStudentsList,
        current: currentStudentsList,
        completed: completedStudentsList
      }
    };

    console.log('✅ Response created successfully');
    res.json(response);

  } catch (err) {
    console.error('❌ Error in simple-students endpoint:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
