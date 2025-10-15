const analyticsService = require('../services/analyticsService');

// Track page views automatically
const trackPageView = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const pageTitle = req.route?.path || req.path;
    const pageUrl = req.originalUrl;
    const userId = req.user.id;
    
    // Extract course and lesson IDs from URL parameters
    const courseId = req.params.courseId || req.body.courseId;
    const lessonId = req.params.lessonId || req.body.lessonId;
    
    // Track page view asynchronously
    analyticsService.trackPageView(userId, pageTitle, pageUrl, courseId, lessonId, req.sessionID)
      .catch(error => {
        console.warn('Analytics page view tracking failed:', error.message);
      });
  }
  
  next();
};

// Track course enrollment
const trackCourseEnrollment = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const courseTitle = req.body.title || req.body.courseTitle;
    const coursePrice = req.body.price || req.body.coursePrice || 0;
    
    if (courseId && courseTitle) {
      analyticsService.trackCourseEnrollment(userId, courseId, courseTitle, coursePrice)
        .catch(error => console.warn('Analytics course enrollment tracking failed:', error.message));
    }
  }
  
  next();
};

// Track course completion
const trackCourseCompletion = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const courseTitle = req.body.title || req.body.courseTitle;
    const completionTime = req.body.completionTime || req.body.duration;
    
    if (courseId && courseTitle) {
      analyticsService.trackCourseCompletion(userId, courseId, courseTitle, completionTime)
        .catch(error => console.warn('Analytics course completion tracking failed:', error.message));
    }
  }
  
  next();
};

// Track lesson start
const trackLessonStart = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const lessonId = req.params.lessonId || req.body.lessonId;
    const lessonTitle = req.body.title || req.body.lessonTitle;
    const lessonType = req.body.lessonType || req.body.type;
    
    if (courseId && lessonId && lessonTitle) {
      analyticsService.trackLessonStart(userId, courseId, lessonId, lessonTitle, lessonType)
        .catch(error => console.warn('Analytics lesson start tracking failed:', error.message));
    }
  }
  
  next();
};

// Track lesson completion
const trackLessonCompletion = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const lessonId = req.params.lessonId || req.body.lessonId;
    const lessonTitle = req.body.title || req.body.lessonTitle;
    const lessonType = req.body.lessonType || req.body.type;
    const duration = req.body.duration || req.body.timeSpent;
    
    if (courseId && lessonId && lessonTitle) {
      analyticsService.trackLessonCompletion(userId, courseId, lessonId, lessonTitle, lessonType, duration)
        .catch(error => console.warn('Analytics lesson completion tracking failed:', error.message));
    }
  }
  
  next();
};

// Track lesson progress
const trackLessonProgress = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const lessonId = req.params.lessonId || req.body.lessonId;
    const lessonTitle = req.body.title || req.body.lessonTitle;
    const progress = req.body.progress || req.body.percentage;
    const watchTime = req.body.watchTime || req.body.duration;
    
    if (courseId && lessonId && lessonTitle && progress !== undefined) {
      analyticsService.trackLessonProgress(userId, courseId, lessonId, lessonTitle, progress, watchTime)
        .catch(error => console.warn('Analytics lesson progress tracking failed:', error.message));
    }
  }
  
  next();
};

// Track quiz start
const trackQuizStart = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const lessonId = req.params.lessonId || req.body.lessonId;
    const quizTitle = req.body.title || req.body.quizTitle;
    
    if (courseId && lessonId && quizTitle) {
      analyticsService.trackQuizStart(userId, courseId, lessonId, quizTitle)
        .catch(error => console.warn('Analytics quiz start tracking failed:', error.message));
    }
  }
  
  next();
};

// Track quiz completion
const trackQuizCompletion = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const lessonId = req.params.lessonId || req.body.lessonId;
    const quizTitle = req.body.title || req.body.quizTitle;
    const score = req.body.score || req.body.userScore;
    const maxScore = req.body.maxScore || req.body.totalScore;
    const timeSpent = req.body.timeSpent || req.body.duration;
    
    if (courseId && lessonId && quizTitle && score !== undefined && maxScore !== undefined) {
      analyticsService.trackQuizCompletion(userId, courseId, lessonId, quizTitle, score, maxScore, timeSpent)
        .catch(error => console.warn('Analytics quiz completion tracking failed:', error.message));
    }
  }
  
  next();
};

// Track video events
const trackVideoEvent = (eventType) => {
  return (req, res, next) => {
    if (req.user && analyticsService.enabled) {
      const userId = req.user.id;
      const courseId = req.params.courseId || req.body.courseId;
      const lessonId = req.params.lessonId || req.body.lessonId;
      const videoTitle = req.body.title || req.body.videoTitle;
      const videoDuration = req.body.videoDuration || req.body.duration;
      const watchTime = req.body.watchTime || req.body.currentTime;
      
      if (courseId && lessonId && videoTitle) {
        switch (eventType) {
          case 'play':
            analyticsService.trackVideoPlay(userId, courseId, lessonId, videoTitle, videoDuration)
              .catch(error => console.warn('Analytics video play tracking failed:', error.message));
            break;
          case 'pause':
            analyticsService.trackVideoPause(userId, courseId, lessonId, videoTitle, watchTime)
              .catch(error => console.warn('Analytics video pause tracking failed:', error.message));
            break;
          case 'complete':
            const totalWatchTime = req.body.totalWatchTime || req.body.totalTime;
            analyticsService.trackVideoComplete(userId, courseId, lessonId, videoTitle, totalWatchTime, videoDuration)
              .catch(error => console.warn('Analytics video complete tracking failed:', error.message));
            break;
        }
      }
    }
    
    next();
  };
};

// Track H5P interactions
const trackH5PInteraction = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const lessonId = req.params.lessonId || req.body.lessonId;
    const h5pType = req.body.h5pType || req.body.type;
    const interactionType = req.body.interactionType || req.body.action;
    const score = req.body.score || req.body.result;
    
    if (courseId && lessonId && h5pType && interactionType) {
      analyticsService.trackH5PInteraction(userId, courseId, lessonId, h5pType, interactionType, score)
        .catch(error => console.warn('Analytics H5P interaction tracking failed:', error.message));
    }
  }
  
  next();
};

// Track forum events
const trackForumEvent = (eventType) => {
  return (req, res, next) => {
    if (req.user && analyticsService.enabled) {
      const userId = req.user.id;
      const courseId = req.params.courseId || req.body.courseId;
      const forumId = req.params.forumId || req.body.forumId;
      const postTitle = req.body.title || req.body.postTitle;
      const postType = req.body.postType || req.body.type;
      const replyLength = req.body.content ? req.body.content.length : 0;
      
      if (courseId && forumId && postTitle) {
        switch (eventType) {
          case 'post':
            analyticsService.trackForumPost(userId, courseId, forumId, postTitle, postType)
              .catch(error => console.warn('Analytics forum post tracking failed:', error.message));
            break;
          case 'reply':
            analyticsService.trackForumReply(userId, courseId, forumId, postTitle, replyLength)
              .catch(error => console.warn('Analytics forum reply tracking failed:', error.message));
            break;
        }
      }
    }
    
    next();
  };
};

// Track live session events
const trackLiveSessionEvent = (eventType) => {
  return (req, res, next) => {
    if (req.user && analyticsService.enabled) {
      const userId = req.user.id;
      const courseId = req.params.courseId || req.body.courseId;
      const sessionId = req.params.sessionId || req.body.sessionId;
      const sessionType = req.body.sessionType || req.body.type;
      const duration = req.body.duration || req.body.timeSpent;
      
      if (courseId && sessionId && sessionType) {
        switch (eventType) {
          case 'join':
            analyticsService.trackLiveSessionJoin(userId, courseId, sessionId, sessionType)
              .catch(error => console.warn('Analytics live session join tracking failed:', error.message));
            break;
          case 'leave':
            analyticsService.trackLiveSessionLeave(userId, courseId, sessionId, sessionType, duration)
              .catch(error => console.warn('Analytics live session leave tracking failed:', error.message));
            break;
        }
      }
    }
    
    next();
  };
};

// Track purchase
const trackPurchase = (req, res, next) => {
  if (req.user && analyticsService.enabled) {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;
    const courseTitle = req.body.title || req.body.courseTitle;
    const amount = req.body.amount || req.body.price;
    const currency = req.body.currency || 'USD';
    const paymentMethod = req.body.paymentMethod || req.body.method;
    
    if (courseId && courseTitle && amount) {
      analyticsService.trackPurchase(userId, courseId, courseTitle, amount, currency, paymentMethod)
        .catch(error => console.warn('Analytics purchase tracking failed:', error.message));
    }
  }
  
  next();
};

module.exports = {
  trackPageView,
  trackCourseEnrollment,
  trackCourseCompletion,
  trackLessonStart,
  trackLessonCompletion,
  trackLessonProgress,
  trackQuizStart,
  trackQuizCompletion,
  trackVideoEvent,
  trackH5PInteraction,
  trackForumEvent,
  trackLiveSessionEvent,
  trackPurchase
};
