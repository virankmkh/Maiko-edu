const express = require('express');
const { models } = require('../config/database');
const LessonActivityService = require('../services/lessonActivityService');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/lesson-activity/start
// @desc    Track when a student starts a lesson
// @access  Private (Student)
router.post('/start', auth, async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user.id;

    if (!courseId || !lessonId) {
      return res.status(400).json({ message: 'Course ID and Lesson ID are required' });
    }

    const activity = await LessonActivityService.startLesson(userId, courseId, lessonId);
    
    res.status(201).json({
      message: 'Lesson activity started',
      activity
    });
  } catch (error) {
    console.error('Error starting lesson activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/lesson-activity/progress
// @desc    Update lesson progress
// @access  Private (Student)
router.put('/progress', auth, async (req, res) => {
  try {
    const { courseId, lessonId, progressPercentage, timeSpent, activityType } = req.body;
    const userId = req.user.id;

    if (!courseId || !lessonId) {
      return res.status(400).json({ message: 'Course ID and Lesson ID are required' });
    }

    const activity = await LessonActivityService.updateProgress(userId, courseId, lessonId, {
      progressPercentage,
      timeSpent,
      activityType
    });
    
    res.json({
      message: 'Lesson progress updated',
      activity
    });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/lesson-activity/complete
// @desc    Mark lesson as completed
// @access  Private (Student)
router.post('/complete', auth, async (req, res) => {
  try {
    const { courseId, lessonId, completionData } = req.body;
    const userId = req.user.id;

    if (!courseId || !lessonId) {
      return res.status(400).json({ message: 'Course ID and Lesson ID are required' });
    }

    const activity = await LessonActivityService.completeLesson(userId, courseId, lessonId, completionData);
    
    res.status(201).json({
      message: 'Lesson completed',
      activity
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/lesson-activity/lesson/:lessonId/status
// @desc    Check if lesson is being studied by any students
// @access  Private (Instructor/Admin)
router.get('/lesson/:lessonId/status', auth, async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Check if user is instructor of the course
    const lesson = await models.Lesson.findByPk(lessonId, {
      include: [{
        model: models.Course,
        as: 'course',
        attributes: ['instructorId']
      }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is instructor or admin
    if (lesson.course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const status = await LessonActivityService.isLessonBeingStudied(lessonId);
    
    res.json(status);
  } catch (error) {
    console.error('Error checking lesson status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/lesson-activity/lesson/:lessonId/summary
// @desc    Get lesson activity summary for instructor
// @access  Private (Instructor/Admin)
router.get('/lesson/:lessonId/summary', auth, async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Check if user is instructor of the course
    const lesson = await models.Lesson.findByPk(lessonId, {
      include: [{
        model: models.Course,
        as: 'course',
        attributes: ['instructorId']
      }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is instructor or admin
    if (lesson.course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const summary = await LessonActivityService.getLessonActivitySummary(lessonId);
    
    res.json(summary);
  } catch (error) {
    console.error('Error getting lesson activity summary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/lesson-activity/course/:courseId/active-lessons
// @desc    Get all lessons with active students in a course
// @access  Private (Instructor/Admin)
router.get('/course/:courseId/active-lessons', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is instructor of the course
    const course = await models.Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all lessons in the course
    const lessons = await models.Lesson.findAll({
      where: { courseId },
      order: [['order', 'ASC']]
    });

    // Check activity status for each lesson
    const lessonsWithStatus = await Promise.all(
      lessons.map(async (lesson) => {
        const status = await LessonActivityService.isLessonBeingStudied(lesson.id);
        return {
          ...lesson.toJSON(),
          isBeingStudied: status.isActive,
          activeStudentsCount: status.count,
          activeStudents: status.activeStudents
        };
      })
    );

    res.json({
      lessons: lessonsWithStatus,
      totalLessons: lessons.length,
      activeLessons: lessonsWithStatus.filter(l => l.isBeingStudied).length
    });
  } catch (error) {
    console.error('Error getting active lessons:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
