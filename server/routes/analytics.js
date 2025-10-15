const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');
const auth = require('../middleware/auth');

// Get course analytics
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const analytics = await analyticsService.getCourseAnalytics(courseId);
    
    if (!analytics) {
      return res.status(404).json({ message: 'Course analytics not found' });
    }
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    res.status(500).json({ message: 'Error fetching course analytics' });
  }
});

// Get lesson analytics
router.get('/lesson/:lessonId', auth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const analytics = await analyticsService.getLessonAnalytics(lessonId);
    
    if (!analytics) {
      return res.status(404).json({ message: 'Lesson analytics not found' });
    }
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching lesson analytics:', error);
    res.status(500).json({ message: 'Error fetching lesson analytics' });
  }
});

// Get user analytics
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const analytics = await analyticsService.getUserAnalytics(userId, new Date(startDate), new Date(endDate));
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Error fetching user analytics' });
  }
});

// Get popular courses
router.get('/popular-courses', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const popularCourses = await analyticsService.getPopularCourses(parseInt(limit));
    
    res.json({
      success: true,
      data: popularCourses
    });
  } catch (error) {
    console.error('Error fetching popular courses:', error);
    res.status(500).json({ message: 'Error fetching popular courses' });
  }
});

// Get recent activity
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const recentActivity = await analyticsService.getRecentActivity(parseInt(limit));
    
    res.json({
      success: true,
      data: recentActivity
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Error fetching recent activity' });
  }
});

// Get dashboard overview
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get basic stats
    const popularCourses = await analyticsService.getPopularCourses(5);
    const recentActivity = await analyticsService.getRecentActivity(20);
    
    // You can add more complex queries here for dashboard data
    const dashboardData = {
      popularCourses,
      recentActivity,
      period: {
        startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString()
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Track custom event
router.post('/track', auth, async (req, res) => {
  try {
    const {
      eventType,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      customData
    } = req.body;
    
    if (!eventType || !eventCategory || !eventAction) {
      return res.status(400).json({ 
        message: 'eventType, eventCategory, and eventAction are required' 
      });
    }
    
    await analyticsService.trackEvent(
      req.user.id,
      eventType,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      customData
    );
    
    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ message: 'Error tracking event' });
  }
});

// Get analytics summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // This would typically involve more complex queries
    // For now, return a basic summary
    const summary = {
      totalEvents: 0, // You'd query this from the database
      totalUsers: 0,
      totalCourses: 0,
      totalRevenue: 0,
      period: {
        startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString()
      }
    };
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ message: 'Error fetching analytics summary' });
  }
});

module.exports = router;
