const express = require('express');
const { sequelize, models } = require('./config/database');
const auth = require('./middleware/auth');

const app = express();

// Simple test route
app.get('/test-students/:id', auth, async (req, res) => {
  try {
    console.log('🧪 Testing students endpoint...');
    
    const courseId = req.params.id;
    console.log('Course ID:', courseId);
    
    // Get all enrollments for this course
    const CourseEnrollment = models.CourseEnrollment;
    const User = models.User;

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

    console.log('Enrollments found:', enrollments.length);

    // Calculate statistics
    const totalStudents = enrollments.length;
    const currentStudents = enrollments.filter(e => e.isActive && e.progress < 100).length;
    const completedStudents = enrollments.filter(e => e.progress === 100).length;

    // Get student lists
    const totalStudentsList = enrollments.map(e => ({
      id: e.student.id,
      name: `${e.student.firstName} ${e.student.lastName}`,
      email: e.student.email,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt
    }));

    res.json({
      statistics: {
        totalStudents,
        currentStudents,
        completedStudents
      },
      students: {
        total: totalStudentsList
      }
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log('Test URL: http://localhost:5002/test-students/1');
});
