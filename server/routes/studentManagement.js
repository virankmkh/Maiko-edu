const express = require('express');
const auth = require('../middleware/auth');
const { sequelize, models } = require('../config/database');
const { Course, User, CourseEnrollment, StudentActivity, Lesson } = models;

const router = express.Router();

// Get all students enrolled in a course
router.get('/courses/:courseId/students', auth, async (req, res) => {
  try {
    console.log('🔍 Student API called for course:', req.params.courseId);
    const { courseId } = req.params;
    const { status } = req.query; // active, completed, inactive, all

    // Check if user is instructor of this course or admin
    const course = await Course.findByPk(courseId);
    if (!course) {
      console.log('❌ Course not found');
      return res.status(404).json({ message: 'Course not found' });
    }

    const isInstructor = req.user.role === 'instructor' && course.instructorId === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'organization_admin';

    if (!isInstructor && !isAdmin) {
      console.log('❌ Access denied for user:', req.user.role, req.user.id);
      return res.status(403).json({ message: 'Access denied. Only course instructors can view student data.' });
    }

    console.log('✅ Access granted, fetching enrollments...');

    // Get enrolled students with their progress
    const enrollments = await CourseEnrollment.findAll({
      where: { courseId, isActive: true },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get student progress data
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = enrollment.student;
        
        // Get overall progress
        const totalLessons = await Lesson.count({ where: { courseId } });
        const completedLessons = await StudentActivity.count({
          where: {
            userId: student.id,
            courseId: courseId,
            activityType: 'lesson_completed'
          }
        });

        // Get last activity
        const lastActivity = await StudentActivity.findOne({
          where: {
            userId: student.id,
            courseId: courseId
          },
          order: [['timestamp', 'DESC']]
        });

        // Get current active lesson
        const activeLesson = await StudentActivity.findOne({
          where: {
            userId: student.id,
            courseId: courseId,
            isActive: true
          },
          include: [
            { model: Lesson, as: 'lesson', attributes: ['id', 'title'] }
          ]
        });

        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          enrolledAt: enrollment.createdAt,
          progressPercentage,
          lessonsCompleted: completedLessons,
          totalLessons,
          lastActivityAt: lastActivity?.timestamp,
          isActive: !!activeLesson,
          currentLesson: activeLesson?.lesson?.title || null
        };
      })
    );

    // Filter by status if specified
    let filteredStudents = studentsWithProgress;
    if (status && status !== 'all') {
      filteredStudents = studentsWithProgress.filter(student => {
        if (status === 'active') return student.isActive;
        if (status === 'completed') return student.progressPercentage === 100;
        if (status === 'inactive') {
          if (!student.lastActivityAt) return true;
          const daysSinceActivity = Math.floor((new Date() - new Date(student.lastActivityAt)) / (1000 * 60 * 60 * 24));
          return daysSinceActivity > 7;
        }
        return true;
      });
    }

    res.json(filteredStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed progress for a specific student in a course
router.get('/students/:studentId/progress/:courseId', auth, async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Check if user is instructor of this course or admin
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isInstructor = req.user.role === 'instructor' && course.instructorId === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'organization_admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only course instructors can view student progress.' });
    }

    // Get student info
    const student = await User.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all lessons in the course
    const lessons = await Lesson.findAll({
      where: { courseId },
      order: [['order', 'ASC']],
      attributes: ['id', 'title', 'order', 'maxPoints']
    });

    // Get student progress for each lesson
    const lessonProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const activities = await StudentActivity.findAll({
          where: {
            userId: studentId,
            lessonId: lesson.id
          },
          order: [['timestamp', 'DESC']]
        });

        const started = activities.some(a => a.activityType === 'lesson_started');
        const completed = activities.some(a => a.activityType === 'lesson_completed');
        const inProgress = activities.some(a => a.isActive);
        
        const lastActivity = activities[0];
        const totalTimeSpent = activities.reduce((total, activity) => {
          return total + (activity.timeSpent || 0);
        }, 0);

        let status = 'not-started';
        if (completed) status = 'completed';
        else if (inProgress) status = 'in-progress';
        else if (started) status = 'started';

        return {
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          status,
          progressPercentage: completed ? 100 : (inProgress ? 50 : 0),
          timeSpent: totalTimeSpent,
          lastActivityAt: lastActivity?.timestamp,
          maxPoints: lesson.maxPoints
        };
      })
    );

    // Calculate overall progress
    const totalLessons = lessons.length;
    const completedLessons = lessonProgress.filter(l => l.status === 'completed').length;
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Get total time spent
    const totalTimeSpent = lessonProgress.reduce((total, lesson) => total + lesson.timeSpent, 0);

    // Get last activity
    const lastActivity = await StudentActivity.findOne({
      where: {
        userId: studentId,
        courseId: courseId
      },
      order: [['timestamp', 'DESC']]
    });

    res.json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      },
      course: {
        id: course.id,
        title: course.title
      },
      overallProgress,
      totalTimeSpent,
      lastActivityAt: lastActivity?.timestamp,
      lessons: lessonProgress
    });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity timeline for a specific student in a course
router.get('/students/:studentId/activity/:courseId', auth, async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const { limit = 50 } = req.query;

    // Check if user is instructor of this course or admin
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isInstructor = req.user.role === 'instructor' && course.instructorId === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'organization_admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only course instructors can view student activity.' });
    }

    // Get student activities
    const activities = await StudentActivity.findAll({
      where: {
        userId: studentId,
        courseId: courseId
      },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'order']
        }
      ],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    // Format activities for display
    const formattedActivities = activities.map(activity => {
      let description = '';
      switch (activity.activityType) {
        case 'lesson_started':
          description = `Started lesson: ${activity.lesson?.title || 'Unknown Lesson'}`;
          break;
        case 'lesson_completed':
          description = `Completed lesson: ${activity.lesson?.title || 'Unknown Lesson'}`;
          break;
        case 'lesson_in_progress':
          description = `Continued studying: ${activity.lesson?.title || 'Unknown Lesson'}`;
          break;
        case 'lesson_paused':
          description = `Paused lesson: ${activity.lesson?.title || 'Unknown Lesson'}`;
          break;
        case 'lesson_resumed':
          description = `Resumed lesson: ${activity.lesson?.title || 'Unknown Lesson'}`;
          break;
        case 'quiz_attempted':
          description = `Attempted quiz in: ${activity.lesson?.title || 'Unknown Lesson'}`;
          break;
        case 'assignment_submitted':
          description = `Submitted assignment in: ${activity.lesson?.title || 'Unknown Lesson'}`;
          break;
        default:
          description = activity.activityDescription || 'Unknown activity';
      }

      return {
        id: activity.id,
        activityType: activity.activityType,
        activityDescription: description,
        timestamp: activity.timestamp,
        metadata: activity.metadata,
        progressPercentage: activity.progressPercentage,
        timeSpent: activity.timeSpent,
        isActive: activity.isActive
      };
    });

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching student activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course statistics
router.get('/courses/:courseId/stats', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is instructor of this course or admin
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isInstructor = req.user.role === 'instructor' && course.instructorId === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'organization_admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only course instructors can view course statistics.' });
    }

    // Get enrollment statistics
    const totalEnrollments = await CourseEnrollment.count({
      where: { courseId, isActive: true }
    });

    const completedEnrollments = await CourseEnrollment.count({
      where: { courseId, isActive: true },
      include: [
        {
          model: StudentActivity,
          as: 'activities',
          where: {
            activityType: 'lesson_completed'
          },
          required: true
        }
      ]
    });

    // Get active students (studying in last 24 hours)
    const activeStudents = await StudentActivity.count({
      where: {
        courseId: courseId,
        isActive: true,
        lastActivityAt: {
          [sequelize.Sequelize.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      distinct: true,
      col: 'userId'
    });

    // Get average completion time
    const avgCompletionTime = await sequelize.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (completed_at - enrolled_at))) as avg_seconds
      FROM (
        SELECT 
          ce.created_at as enrolled_at,
          MAX(sa.timestamp) as completed_at
        FROM course_enrollments ce
        JOIN student_activities sa ON sa.user_id = ce.user_id AND sa.course_id = ce.course_id
        WHERE ce.course_id = :courseId 
          AND ce.is_active = true
          AND sa.activity_type = 'lesson_completed'
        GROUP BY ce.user_id, ce.created_at
      ) completion_times
    `, {
      replacements: { courseId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      totalEnrollments,
      completedEnrollments,
      activeStudents,
      completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
      averageCompletionTime: avgCompletionTime[0]?.avg_seconds || 0
    });
  } catch (error) {
    console.error('Error fetching course statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
