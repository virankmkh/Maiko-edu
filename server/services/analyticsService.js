const { AnalyticsEvent, UserSession, CourseAnalytics, LessonAnalytics } = require('../models/AnalyticsSimple');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

class AnalyticsService {
  constructor() {
    this.enabled = process.env.ANALYTICS_ENABLED === 'true' || true;
  }

  // Track any event
  async trackEvent(userId, eventType, eventCategory, eventAction, eventLabel = null, eventValue = null, customData = {}) {
    if (!this.enabled) return;

    try {
      await AnalyticsEvent.create({
        userId,
        eventType,
        eventCategory,
        eventAction,
        eventLabel,
        eventValue,
        customData,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Analytics tracking error:', error.message);
    }
  }

  // Track page views
  async trackPageView(userId, pageTitle, pageUrl, courseId = null, lessonId = null, sessionId = null) {
    await this.trackEvent(
      userId,
      'page_view',
      'Navigation',
      'View',
      pageTitle,
      null,
      {
        pageUrl,
        courseId,
        lessonId,
        sessionId
      }
    );
  }

  // Track course events
  async trackCourseEnrollment(userId, courseId, courseTitle, coursePrice = 0) {
    await this.trackEvent(
      userId,
      'course_enrollment',
      'Course',
      'Enroll',
      courseTitle,
      coursePrice,
      { courseId, courseTitle, coursePrice }
    );

    // Update course analytics
    await this.updateCourseAnalytics(courseId, 'enrollment');
  }

  async trackCourseCompletion(userId, courseId, courseTitle, completionTime) {
    await this.trackEvent(
      userId,
      'course_completion',
      'Course',
      'Complete',
      courseTitle,
      completionTime,
      { courseId, courseTitle, completionTime }
    );

    // Update course analytics
    await this.updateCourseAnalytics(courseId, 'completion', completionTime);
  }

  async trackCourseRating(userId, courseId, courseTitle, rating) {
    await this.trackEvent(
      userId,
      'course_rating',
      'Course',
      'Rate',
      courseTitle,
      rating,
      { courseId, courseTitle, rating }
    );

    // Update course analytics
    await this.updateCourseAnalytics(courseId, 'rating', rating);
  }

  // Track lesson events
  async trackLessonStart(userId, courseId, lessonId, lessonTitle, lessonType) {
    await this.trackEvent(
      userId,
      'lesson_start',
      'Learning',
      'Start',
      lessonTitle,
      null,
      { courseId, lessonId, lessonTitle, lessonType }
    );
  }

  async trackLessonCompletion(userId, courseId, lessonId, lessonTitle, lessonType, duration) {
    await this.trackEvent(
      userId,
      'lesson_completion',
      'Learning',
      'Complete',
      lessonTitle,
      duration,
      { courseId, lessonId, lessonTitle, lessonType, duration }
    );

    // Update lesson analytics
    await this.updateLessonAnalytics(lessonId, courseId, 'completion', duration);
  }

  async trackLessonProgress(userId, courseId, lessonId, lessonTitle, progress, watchTime) {
    await this.trackEvent(
      userId,
      'lesson_progress',
      'Learning',
      'Progress',
      lessonTitle,
      progress,
      { courseId, lessonId, lessonTitle, progress, watchTime }
    );

    // Update lesson analytics
    await this.updateLessonAnalytics(lessonId, courseId, 'progress', watchTime);
  }

  // Track quiz events
  async trackQuizStart(userId, courseId, lessonId, quizTitle) {
    await this.trackEvent(
      userId,
      'quiz_start',
      'Quiz',
      'Start',
      quizTitle,
      null,
      { courseId, lessonId, quizTitle }
    );
  }

  async trackQuizCompletion(userId, courseId, lessonId, quizTitle, score, maxScore, timeSpent) {
    const percentage = Math.round((score / maxScore) * 100);
    
    await this.trackEvent(
      userId,
      'quiz_completion',
      'Quiz',
      'Complete',
      quizTitle,
      percentage,
      { courseId, lessonId, quizTitle, score, maxScore, timeSpent, percentage }
    );
  }

  // Track video events
  async trackVideoPlay(userId, courseId, lessonId, videoTitle, videoDuration) {
    await this.trackEvent(
      userId,
      'video_play',
      'Video',
      'Play',
      videoTitle,
      videoDuration,
      { courseId, lessonId, videoTitle, videoDuration }
    );
  }

  async trackVideoPause(userId, courseId, lessonId, videoTitle, watchTime) {
    await this.trackEvent(
      userId,
      'video_pause',
      'Video',
      'Pause',
      videoTitle,
      watchTime,
      { courseId, lessonId, videoTitle, watchTime }
    );
  }

  async trackVideoComplete(userId, courseId, lessonId, videoTitle, totalWatchTime, videoDuration) {
    const completionRate = Math.round((totalWatchTime / videoDuration) * 100);
    
    await this.trackEvent(
      userId,
      'video_complete',
      'Video',
      'Complete',
      videoTitle,
      completionRate,
      { courseId, lessonId, videoTitle, totalWatchTime, videoDuration, completionRate }
    );
  }

  // Track H5P events
  async trackH5PInteraction(userId, courseId, lessonId, h5pType, interactionType, score = null) {
    await this.trackEvent(
      userId,
      'h5p_interaction',
      'H5P',
      interactionType,
      h5pType,
      score,
      { courseId, lessonId, h5pType, interactionType, score }
    );
  }

  // Track forum events
  async trackForumPost(userId, courseId, forumId, postTitle, postType) {
    await this.trackEvent(
      userId,
      'forum_post',
      'Forum',
      'Post',
      postTitle,
      null,
      { courseId, forumId, postTitle, postType }
    );
  }

  async trackForumReply(userId, courseId, forumId, postTitle, replyLength) {
    await this.trackEvent(
      userId,
      'forum_reply',
      'Forum',
      'Reply',
      postTitle,
      replyLength,
      { courseId, forumId, postTitle, replyLength }
    );
  }

  // Track live session events
  async trackLiveSessionJoin(userId, courseId, sessionId, sessionType) {
    await this.trackEvent(
      userId,
      'live_session_join',
      'Live Session',
      'Join',
      `Session ${sessionId}`,
      null,
      { courseId, sessionId, sessionType }
    );
  }

  async trackLiveSessionLeave(userId, courseId, sessionId, sessionType, duration) {
    await this.trackEvent(
      userId,
      'live_session_leave',
      'Live Session',
      'Leave',
      `Session ${sessionId}`,
      duration,
      { courseId, sessionId, sessionType, duration }
    );
  }

  // Track revenue events
  async trackPurchase(userId, courseId, courseTitle, amount, currency = 'USD', paymentMethod = '') {
    await this.trackEvent(
      userId,
      'purchase',
      'Revenue',
      'Purchase',
      courseTitle,
      amount,
      { courseId, courseTitle, amount, currency, paymentMethod }
    );

    // Update course analytics
    await this.updateCourseAnalytics(courseId, 'revenue', amount);
  }

  // Session management
  async startSession(userId, ipAddress, userAgent) {
    const sessionId = uuidv4();
    
    await UserSession.create({
      userId,
      sessionId,
      startTime: new Date(),
      ipAddress,
      userAgent,
      isActive: true
    });

    return sessionId;
  }

  async endSession(sessionId) {
    const session = await UserSession.findOne({ where: { sessionId } });
    if (session) {
      const duration = Math.floor((new Date() - session.startTime) / 1000);
      
      await session.update({
        endTime: new Date(),
        duration,
        isActive: false
      });
    }
  }

  async updateSessionActivity(sessionId, actionType) {
    const session = await UserSession.findOne({ where: { sessionId } });
    if (session) {
      if (actionType === 'page_view') {
        await session.increment('pageViews');
      } else {
        await session.increment('actions');
      }
    }
  }

  // Update course analytics
  async updateCourseAnalytics(courseId, action, value = null) {
    try {
      let [analytics, created] = await CourseAnalytics.findOrCreate({
        where: { courseId },
        defaults: { courseId }
      });

      switch (action) {
        case 'enrollment':
          await analytics.increment('totalEnrollments');
          break;
        case 'completion':
          await analytics.increment('totalCompletions');
          if (value) {
            // Update average completion time
            const currentAvg = analytics.averageCompletionTime || 0;
            const currentCompletions = analytics.totalCompletions;
            const newAvg = ((currentAvg * (currentCompletions - 1)) + value) / currentCompletions;
            await analytics.update({ averageCompletionTime: Math.round(newAvg) });
          }
          break;
        case 'revenue':
          await analytics.increment('totalRevenue', { by: value });
          break;
        case 'rating':
          if (value) {
            const currentRating = analytics.averageRating || 0;
            const currentRatings = analytics.totalRatings;
            const newRating = ((currentRating * currentRatings) + value) / (currentRatings + 1);
            await analytics.update({
              averageRating: Math.round(newRating * 100) / 100,
              totalRatings: currentRatings + 1
            });
          }
          break;
      }

      await analytics.update({ lastUpdated: new Date() });
    } catch (error) {
      console.error('Error updating course analytics:', error.message);
    }
  }

  // Update lesson analytics
  async updateLessonAnalytics(lessonId, courseId, action, value = null) {
    try {
      let [analytics, created] = await LessonAnalytics.findOrCreate({
        where: { lessonId },
        defaults: { lessonId, courseId }
      });

      switch (action) {
        case 'view':
          await analytics.increment('totalViews');
          break;
        case 'completion':
          await analytics.increment('totalCompletions');
          // Update completion rate
          const views = analytics.totalViews;
          const completions = analytics.totalCompletions;
          const completionRate = views > 0 ? (completions / views) * 100 : 0;
          await analytics.update({ completionRate: Math.round(completionRate * 100) / 100 });
          break;
        case 'progress':
          if (value) {
            await analytics.increment('totalWatchTime', { by: value });
            // Update average watch time
            const views = analytics.totalViews;
            const totalWatchTime = analytics.totalWatchTime;
            const avgWatchTime = views > 0 ? Math.round(totalWatchTime / views) : 0;
            await analytics.update({ averageWatchTime: avgWatchTime });
          }
          break;
      }

      await analytics.update({ lastUpdated: new Date() });
    } catch (error) {
      console.error('Error updating lesson analytics:', error.message);
    }
  }

  // Get analytics data
  async getCourseAnalytics(courseId) {
    return await CourseAnalytics.findOne({ where: { courseId } });
  }

  async getLessonAnalytics(lessonId) {
    return await LessonAnalytics.findOne({ where: { lessonId } });
  }

  async getUserAnalytics(userId, startDate, endDate) {
    const whereClause = {
      userId,
      timestamp: {
        [Op.between]: [startDate, endDate]
      }
    };

    return await AnalyticsEvent.findAll({
      where: whereClause,
      order: [['timestamp', 'DESC']]
    });
  }

  async getPopularCourses(limit = 10) {
    return await CourseAnalytics.findAll({
      order: [['totalEnrollments', 'DESC']],
      limit
    });
  }

  async getRecentActivity(limit = 50) {
    return await AnalyticsEvent.findAll({
      order: [['timestamp', 'DESC']],
      limit
    });
  }
}

module.exports = new AnalyticsService();
