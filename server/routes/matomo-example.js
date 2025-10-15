const express = require('express');
const router = express.Router();
const matomoIntegration = require('../services/matomoIntegration');

// Example: Track course enrollment
router.post('/enroll-course', async (req, res) => {
  try {
    const { courseId, courseTitle, userId } = req.body;
    
    // Your existing enrollment logic here
    // ... enroll user in course ...
    
    // Track in Matomo
    await matomoIntegration.trackCourseEnrollment(userId, courseId, courseTitle);
    
    res.json({ success: true, message: 'Enrolled and tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Example: Track lesson completion
router.post('/complete-lesson', async (req, res) => {
  try {
    const { lessonId, lessonTitle, courseId, userId } = req.body;
    
    // Your existing completion logic here
    // ... mark lesson as completed ...
    
    // Track in Matomo
    await matomoIntegration.trackLessonCompletion(userId, lessonId, lessonTitle, courseId);
    
    res.json({ success: true, message: 'Completed and tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
