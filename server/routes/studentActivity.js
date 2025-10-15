const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sequelize, models } = require('../config/database');
const StudentActivity = models.StudentActivity;
const User = models.User;
const Course = models.Course;
const Lesson = models.Lesson;

// Get student activity for instructor's courses
router.get('/instructor', auth, async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    // Get instructor's courses
    const courses = await Course.findAll({
      where: { instructorId },
      attributes: ['id', 'title']
    });
    
    const courseIds = courses.map(course => course.id);
    
    if (courseIds.length === 0) {
      return res.json({ activities: [] });
    }
    
    // Get recent student activities for instructor's courses
    const activities = await StudentActivity.findAll({
      where: {
        courseId: courseIds
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
        },
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title'],
          required: false
        }
      ],
      order: [['timestamp', 'DESC']],
      limit: 50
    });
    
    // Format activities for frontend
    const formattedActivities = activities.map(activity => {
      const timeAgo = getTimeAgo(activity.timestamp);
      
      return {
        id: activity.id,
        courseTitle: activity.course?.title || 'Unknown Course',
        activity: activity.activityDescription,
        type: formatActivityType(activity.activityType),
        timestamp: timeAgo,
        studentName: `${activity.student?.firstName || ''} ${activity.student?.lastName || ''}`.trim() || 'Unknown Student',
        metadata: activity.metadata
      };
    });
    
    res.json({ activities: formattedActivities });
    
  } catch (error) {
    console.error('Error fetching student activity:', error);
    res.status(500).json({ error: 'Failed to fetch student activity' });
  }
});

// Track student activity
router.post('/track', auth, async (req, res) => {
  try {
    const { courseId, lessonId, activityType, activityDescription, metadata } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!courseId || !activityType || !activityDescription) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create activity record
    const activity = await StudentActivity.create({
      userId,
      courseId,
      lessonId,
      activityType,
      activityDescription,
      metadata: metadata || {}
    });
    
    res.json({ success: true, activity });
    
  } catch (error) {
    console.error('Error tracking student activity:', error);
    res.status(500).json({ error: 'Failed to track activity' });
  }
});

// Helper function to format time ago
function getTimeAgo(timestamp) {
  const now = new Date();
  const diff = now - new Date(timestamp);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) {
    return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (days < 7) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}

// Helper function to format activity type
function formatActivityType(type) {
  const typeMap = {
    'lesson_completed': 'Lesson completion',
    'quiz_attempted': 'Quiz attempt',
    'quiz_completed': 'Quiz completion',
    'forum_post': 'Forum post',
    'course_started': 'Course started',
    'course_completed': 'Course completion',
    'video_watched': 'Video watched',
    'assignment_submitted': 'Assignment submitted'
  };
  
  return typeMap[type] || type;
}

module.exports = router;
