import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const MatomoTracker = ({ children }) => {
  const { user } = useAuth();
  const [matomoConfig, setMatomoConfig] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Matomo configuration
    const loadMatomoConfig = async () => {
      try {
        const response = await fetch('/api/matomo/config');
        const data = await response.json();
        
        if (data.success) {
          setMatomoConfig(data.config);
          
          // Load Matomo tracking script if enabled
          if (data.config.enabled) {
            loadMatomoScript(data.config);
          } else {
            setIsLoaded(true);
          }
        } else {
          console.warn('Failed to load Matomo configuration');
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Matomo configuration:', error);
        setIsLoaded(true);
      }
    };

    loadMatomoConfig();
  }, []);

  const loadMatomoScript = (config) => {
    // Create Matomo script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `${config.matomoUrl}/matomo.js`;
    
    // Set up Matomo tracking
    window._paq = window._paq || [];
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);
    window._paq.push(['setTrackerUrl', `${config.matomoUrl}/matomo.php`]);
    window._paq.push(['setSiteId', config.siteId]);
    
    // Set user ID if available
    if (user && user.id) {
      window._paq.push(['setUserId', user.id.toString()]);
    }
    
    // Add script to document
    document.head.appendChild(script);
    
    script.onload = () => {
      setIsLoaded(true);
      console.log('✅ Matomo tracking script loaded');
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Matomo tracking script');
      setIsLoaded(true);
    };
  };

  // Track page view when route changes
  useEffect(() => {
    if (isLoaded && matomoConfig && matomoConfig.enabled && user) {
      const pageTitle = document.title;
      const pageUrl = window.location.href;
      
      // Track page view
      if (window._paq) {
        window._paq.push(['setCustomUrl', pageUrl]);
        window._paq.push(['setDocumentTitle', pageTitle]);
        window._paq.push(['trackPageView']);
      }
    }
  }, [isLoaded, matomoConfig, user, window.location.pathname]);

  // Track user login
  useEffect(() => {
    if (isLoaded && matomoConfig && matomoConfig.enabled && user && window._paq) {
      window._paq.push(['setUserId', user.id.toString()]);
      window._paq.push(['trackEvent', 'User', 'Login', user.role]);
    }
  }, [isLoaded, matomoConfig, user]);

  if (!isLoaded) {
    return <div>Loading analytics...</div>;
  }

  return <>{children}</>;
};

// Hook for tracking custom events
export const useMatomoTracking = () => {
  const { user } = useAuth();

  const trackEvent = (category, action, name, value) => {
    if (window._paq && user) {
      window._paq.push(['trackEvent', category, action, name, value]);
    }
  };

  const trackCourseEnrollment = async (courseId, courseTitle, coursePrice) => {
    if (!user) return;

    try {
      await fetch('/api/matomo/track/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          courseTitle,
          coursePrice
        })
      });
    } catch (error) {
      console.error('Error tracking course enrollment:', error);
    }
  };

  const trackLessonCompletion = async (courseId, lessonId, lessonTitle, lessonType, duration) => {
    if (!user) return;

    try {
      await fetch('/api/matomo/track/lesson-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          lessonTitle,
          lessonType,
          duration
        })
      });
    } catch (error) {
      console.error('Error tracking lesson completion:', error);
    }
  };

  const trackH5PInteraction = async (courseId, lessonId, h5pType, interactionType, score) => {
    if (!user) return;

    try {
      await fetch('/api/matomo/track/h5p-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          h5pType,
          interactionType,
          score
        })
      });
    } catch (error) {
      console.error('Error tracking H5P interaction:', error);
    }
  };

  const trackVideoWatch = async (courseId, lessonId, videoTitle, watchTime, totalDuration, progress) => {
    if (!user) return;

    try {
      await fetch('/api/matomo/track/video-watch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          videoTitle,
          watchTime,
          totalDuration,
          progress
        })
      });
    } catch (error) {
      console.error('Error tracking video watch:', error);
    }
  };

  const trackQuizSubmission = async (courseId, lessonId, quizTitle, score, maxScore, timeSpent) => {
    if (!user) return;

    try {
      await fetch('/api/matomo/track/quiz-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          quizTitle,
          score,
          maxScore,
          timeSpent
        })
      });
    } catch (error) {
      console.error('Error tracking quiz submission:', error);
    }
  };

  const trackJitsiSession = async (courseId, sessionId, sessionType, duration, participantCount) => {
    if (!user) return;

    try {
      await fetch('/api/matomo/track/jitsi-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          sessionId,
          sessionType,
          duration,
          participantCount
        })
      });
    } catch (error) {
      console.error('Error tracking Jitsi session:', error);
    }
  };

  const trackForumActivity = async (courseId, forumId, activityType, postTitle) => {
    if (!user) return;

    try {
      await fetch('/api/matomo/track/forum-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          forumId,
          activityType,
          postTitle
        })
      });
    } catch (error) {
      console.error('Error tracking forum activity:', error);
    }
  };

  return {
    trackEvent,
    trackCourseEnrollment,
    trackLessonCompletion,
    trackH5PInteraction,
    trackVideoWatch,
    trackQuizSubmission,
    trackJitsiSession,
    trackForumActivity
  };
};

export default MatomoTracker;
