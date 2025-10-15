const express = require('express');
const router = express.Router();
const matomoService = require('../services/matomoService');
const auth = require('../middleware/auth');

// @route   GET /api/matomo/config
// @desc    Get Matomo configuration for frontend
// @access  Public
router.get('/config', async (req, res) => {
  try {
    const config = {
      enabled: matomoService.trackingEnabled,
      matomoUrl: matomoService.matomoUrl,
      siteId: matomoService.siteId,
      trackingScript: matomoService.getTrackingScript()
    };

    res.json({
      success: true,
      config: config
    });
  } catch (error) {
    console.error('Error getting Matomo config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Matomo configuration',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/pageview
// @desc    Track page view
// @access  Private
router.post('/track/pageview', auth, async (req, res) => {
  try {
    const { pageTitle, pageUrl, customData } = req.body;
    const userId = req.user.id;

    await matomoService.trackPageView(userId, pageTitle, pageUrl, customData);

    res.json({
      success: true,
      message: 'Page view tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track page view',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/enrollment
// @desc    Track course enrollment
// @access  Private
router.post('/track/enrollment', auth, async (req, res) => {
  try {
    const { courseId, courseTitle, coursePrice } = req.body;
    const userId = req.user.id;

    await matomoService.trackCourseEnrollment(userId, courseId, courseTitle, coursePrice);

    res.json({
      success: true,
      message: 'Course enrollment tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking course enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track course enrollment',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/lesson-completion
// @desc    Track lesson completion
// @access  Private
router.post('/track/lesson-completion', auth, async (req, res) => {
  try {
    const { courseId, lessonId, lessonTitle, lessonType, duration } = req.body;
    const userId = req.user.id;

    await matomoService.trackLessonCompletion(userId, courseId, lessonId, lessonTitle, lessonType, duration);

    res.json({
      success: true,
      message: 'Lesson completion tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking lesson completion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track lesson completion',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/h5p-interaction
// @desc    Track H5P interaction
// @access  Private
router.post('/track/h5p-interaction', auth, async (req, res) => {
  try {
    const { courseId, lessonId, h5pType, interactionType, score } = req.body;
    const userId = req.user.id;

    await matomoService.trackH5PInteraction(userId, courseId, lessonId, h5pType, interactionType, score);

    res.json({
      success: true,
      message: 'H5P interaction tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking H5P interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track H5P interaction',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/video-watch
// @desc    Track video watch time
// @access  Private
router.post('/track/video-watch', auth, async (req, res) => {
  try {
    const { courseId, lessonId, videoTitle, watchTime, totalDuration, progress } = req.body;
    const userId = req.user.id;

    await matomoService.trackVideoWatch(userId, courseId, lessonId, videoTitle, watchTime, totalDuration, progress);

    res.json({
      success: true,
      message: 'Video watch time tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking video watch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track video watch time',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/quiz-submission
// @desc    Track quiz submission
// @access  Private
router.post('/track/quiz-submission', auth, async (req, res) => {
  try {
    const { courseId, lessonId, quizTitle, score, maxScore, timeSpent } = req.body;
    const userId = req.user.id;

    await matomoService.trackQuizSubmission(userId, courseId, lessonId, quizTitle, score, maxScore, timeSpent);

    res.json({
      success: true,
      message: 'Quiz submission tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking quiz submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track quiz submission',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/jitsi-session
// @desc    Track Jitsi session
// @access  Private
router.post('/track/jitsi-session', auth, async (req, res) => {
  try {
    const { courseId, sessionId, sessionType, duration, participantCount } = req.body;
    const userId = req.user.id;

    await matomoService.trackJitsiSession(userId, courseId, sessionId, sessionType, duration, participantCount);

    res.json({
      success: true,
      message: 'Jitsi session tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking Jitsi session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track Jitsi session',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/forum-activity
// @desc    Track forum activity
// @access  Private
router.post('/track/forum-activity', auth, async (req, res) => {
  try {
    const { courseId, forumId, activityType, postTitle } = req.body;
    const userId = req.user.id;

    await matomoService.trackForumActivity(userId, courseId, forumId, activityType, postTitle);

    res.json({
      success: true,
      message: 'Forum activity tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking forum activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track forum activity',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/revenue
// @desc    Track revenue events
// @access  Private
router.post('/track/revenue', auth, async (req, res) => {
  try {
    const { courseId, courseTitle, amount, currency, paymentMethod, transactionId } = req.body;
    const userId = req.user.id;

    await matomoService.trackRevenue(userId, courseId, courseTitle, amount, currency, paymentMethod, transactionId);

    res.json({
      success: true,
      message: 'Revenue tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track revenue',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/subscription-revenue
// @desc    Track subscription revenue
// @access  Private
router.post('/track/subscription-revenue', auth, async (req, res) => {
  try {
    const { subscriptionType, amount, currency, billingCycle } = req.body;
    const userId = req.user.id;

    await matomoService.trackSubscriptionRevenue(userId, subscriptionType, amount, currency, billingCycle);

    res.json({
      success: true,
      message: 'Subscription revenue tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking subscription revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track subscription revenue',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/affiliate-commission
// @desc    Track affiliate commission
// @access  Private
router.post('/track/affiliate-commission', auth, async (req, res) => {
  try {
    const { affiliateId, courseId, commissionAmount, currency } = req.body;
    const userId = req.user.id;

    await matomoService.trackAffiliateCommission(userId, affiliateId, courseId, commissionAmount, currency);

    res.json({
      success: true,
      message: 'Affiliate commission tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking affiliate commission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track affiliate commission',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/marketing-campaign
// @desc    Track marketing campaign performance
// @access  Private
router.post('/track/marketing-campaign', auth, async (req, res) => {
  try {
    const { campaignName, campaignType, cost, revenue, roi } = req.body;
    const userId = req.user.id;

    await matomoService.trackMarketingCampaign(userId, campaignName, campaignType, cost, revenue, roi);

    res.json({
      success: true,
      message: 'Marketing campaign tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking marketing campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track marketing campaign',
      error: error.message
    });
  }
});

// @route   POST /api/matomo/track/student-lifetime-value
// @desc    Track student lifetime value
// @access  Private
router.post('/track/student-lifetime-value', auth, async (req, res) => {
  try {
    const { totalSpent, totalCourses, averageOrderValue, lastPurchaseDate } = req.body;
    const userId = req.user.id;

    await matomoService.trackStudentLifetimeValue(userId, totalSpent, totalCourses, averageOrderValue, lastPurchaseDate);

    res.json({
      success: true,
      message: 'Student lifetime value tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking student lifetime value:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track student lifetime value',
      error: error.message
    });
  }
});

// @route   GET /api/matomo/analytics/:method
// @desc    Get analytics data
// @access  Private (Instructor/Admin only)
router.get('/analytics/:method', auth, async (req, res) => {
  try {
    // Check if user has permission to view analytics
    if (req.user.role !== 'instructor' && req.user.role !== 'organization_admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Instructor or admin role required.'
      });
    }

    const { method } = req.params;
    const queryParams = req.query;

    const result = await matomoService.getAnalyticsData(method, queryParams);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics data',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error getting analytics data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data',
      error: error.message
    });
  }
});

// @route   GET /api/matomo/dashboard
// @desc    Get dashboard data for instructors
// @access  Private (Instructor/Admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Check if user has permission to view analytics
    if (req.user.role !== 'instructor' && req.user.role !== 'organization_admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Instructor or admin role required.'
      });
    }

    const { period = 'last30', courseId } = req.query;
    
    // Get various analytics data
    const [
      visitorsResult,
      pageViewsResult,
      courseEnrollmentsResult,
      lessonCompletionsResult,
      h5pInteractionsResult,
      revenueResult,
      affiliateResult,
      marketingResult
    ] = await Promise.all([
      matomoService.getAnalyticsData('VisitsSummary.get', { period, date: 'last30' }),
      matomoService.getAnalyticsData('Actions.getPageUrls', { period, date: 'last30' }),
      matomoService.getAnalyticsData('Events.getCategory', { period, date: 'last30', secondaryDimension: 'eventAction' }),
      matomoService.getAnalyticsData('Events.getAction', { period, date: 'last30', eventCategory: 'Learning' }),
      matomoService.getAnalyticsData('Events.getAction', { period, date: 'last30', eventCategory: 'H5P' }),
      matomoService.getAnalyticsData('Events.getAction', { period, date: 'last30', eventCategory: 'Revenue' }),
      matomoService.getAnalyticsData('Events.getAction', { period, date: 'last30', eventCategory: 'Revenue', eventAction: 'Affiliate' }),
      matomoService.getAnalyticsData('Events.getAction', { period, date: 'last30', eventCategory: 'Marketing' })
    ]);

    const dashboardData = {
      visitors: visitorsResult.success ? visitorsResult.data : null,
      pageViews: pageViewsResult.success ? pageViewsResult.data : null,
      courseEnrollments: courseEnrollmentsResult.success ? courseEnrollmentsResult.data : null,
      lessonCompletions: lessonCompletionsResult.success ? lessonCompletionsResult.data : null,
      h5pInteractions: h5pInteractionsResult.success ? h5pInteractionsResult.data : null,
      revenue: revenueResult.success ? revenueResult.data : null,
      affiliateCommissions: affiliateResult.success ? affiliateResult.data : null,
      marketingCampaigns: marketingResult.success ? marketingResult.data : null
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

module.exports = router;
