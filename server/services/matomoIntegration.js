const axios = require('axios');

class MatomoIntegration {
  constructor() {
    this.matomoUrl = 'http://localhost:8080/matomo.php';
    this.siteId = 1; // Matomo site ID
  }

  // Track page views
  async trackPageView(pageUrl, pageTitle) {
    try {
      await axios.post(this.matomoUrl, new URLSearchParams({
        idsite: this.siteId,
        rec: 1,
        action_name: pageTitle,
        url: pageUrl
      }));
    } catch (error) {
      console.log('Matomo tracking failed:', error.message);
    }
  }

  // Track course enrollment
  async trackCourseEnrollment(userId, courseId, courseTitle) {
    try {
      await axios.post(this.matomoUrl, new URLSearchParams({
        idsite: this.siteId,
        rec: 1,
        action_name: 'Course Enrollment',
        e_c: 'Education',
        e_a: 'Enroll',
        e_n: courseTitle,
        uid: userId,
        custom_data: JSON.stringify({
          course_id: courseId,
          course_title: courseTitle,
          user_id: userId
        })
      }));
    } catch (error) {
      console.log('Matomo tracking failed:', error.message);
    }
  }

  // Track lesson completion
  async trackLessonCompletion(userId, lessonId, lessonTitle, courseId) {
    try {
      await axios.post(this.matomoUrl, new URLSearchParams({
        idsite: this.siteId,
        rec: 1,
        action_name: 'Lesson Completion',
        e_c: 'Education',
        e_a: 'Complete',
        e_n: lessonTitle,
        uid: userId,
        custom_data: JSON.stringify({
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          course_id: courseId,
          user_id: userId
        })
      }));
    } catch (error) {
      console.log('Matomo tracking failed:', error.message);
    }
  }

  // Track revenue
  async trackRevenue(userId, courseId, courseTitle, amount, currency = 'USD') {
    try {
      await axios.post(this.matomoUrl, new URLSearchParams({
        idsite: this.siteId,
        rec: 1,
        action_name: 'Course Purchase',
        e_c: 'Revenue',
        e_a: 'Purchase',
        e_n: courseTitle,
        e_v: amount,
        uid: userId,
        custom_data: JSON.stringify({
          course_id: courseId,
          course_title: courseTitle,
          amount: amount,
          currency: currency,
          user_id: userId
        })
      }));
    } catch (error) {
      console.log('Matomo tracking failed:', error.message);
    }
  }
}

module.exports = new MatomoIntegration();
