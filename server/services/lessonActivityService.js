const { models } = require('../config/database');
const StudentActivity = models.StudentActivity;
const Lesson = models.Lesson;
const User = models.User;

class LessonActivityService {
  
  /**
   * Track when a student starts a lesson
   */
  static async startLesson(userId, courseId, lessonId) {
    try {
      // Mark any previous active activities as inactive
      await StudentActivity.update(
        { isActive: false },
        { 
          where: { 
            userId, 
            courseId, 
            lessonId,
            isActive: true 
          } 
        }
      );

      // Create new activity record
      const activity = await StudentActivity.create({
        userId,
        courseId,
        lessonId,
        activityType: 'lesson_started',
        activityDescription: 'Student started the lesson',
        progressPercentage: 0,
        timeSpent: 0,
        isActive: true,
        lastActivityAt: new Date(),
        metadata: {
          startTime: new Date().toISOString(),
          lessonProgress: 0
        }
      });

      return activity;
    } catch (error) {
      console.error('Error starting lesson activity:', error);
      throw error;
    }
  }

  /**
   * Update lesson progress
   */
  static async updateProgress(userId, courseId, lessonId, progressData) {
    try {
      const { progressPercentage, timeSpent, activityType = 'lesson_in_progress' } = progressData;
      
      // Find active activity for this lesson
      let activity = await StudentActivity.findOne({
        where: {
          userId,
          courseId,
          lessonId,
          isActive: true
        }
      });

      if (activity) {
        // Update existing activity
        await activity.update({
          activityType,
          progressPercentage,
          timeSpent: (activity.timeSpent || 0) + (timeSpent || 0),
          lastActivityAt: new Date(),
          metadata: {
            ...activity.metadata,
            lastProgressUpdate: new Date().toISOString(),
            progressPercentage
          }
        });
      } else {
        // Create new activity if none exists
        activity = await this.startLesson(userId, courseId, lessonId);
        await activity.update({
          activityType,
          progressPercentage,
          timeSpent: timeSpent || 0,
          metadata: {
            ...activity.metadata,
            lastProgressUpdate: new Date().toISOString(),
            progressPercentage
          }
        });
      }

      return activity;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  }

  /**
   * Complete a lesson
   */
  static async completeLesson(userId, courseId, lessonId, completionData = {}) {
    try {
      // Mark any active activities as completed
      await StudentActivity.update(
        { 
          isActive: false,
          activityType: 'lesson_completed',
          lastActivityAt: new Date()
        },
        { 
          where: { 
            userId, 
            courseId, 
            lessonId,
            isActive: true 
          } 
        }
      );

      // Create completion record
      const activity = await StudentActivity.create({
        userId,
        courseId,
        lessonId,
        activityType: 'lesson_completed',
        activityDescription: 'Student completed the lesson',
        progressPercentage: 100,
        timeSpent: completionData.timeSpent || 0,
        isActive: false,
        lastActivityAt: new Date(),
        metadata: {
          completionTime: new Date().toISOString(),
          finalScore: completionData.finalScore || null,
          completionData
        }
      });

      return activity;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  }

  /**
   * Check if any students are currently active in a lesson
   */
  static async isLessonBeingStudied(lessonId) {
    try {
      const activeActivities = await StudentActivity.findAll({
        where: {
          lessonId,
          isActive: true,
          activityType: ['lesson_started', 'lesson_in_progress']
        },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      return {
        isActive: activeActivities.length > 0,
        activeStudents: activeActivities.map(activity => ({
          id: activity.student.id,
          name: `${activity.student.firstName} ${activity.student.lastName}`,
          email: activity.student.email,
          progressPercentage: activity.progressPercentage,
          lastActivityAt: activity.lastActivityAt,
          timeSpent: activity.timeSpent
        })),
        count: activeActivities.length
      };
    } catch (error) {
      console.error('Error checking lesson activity:', error);
      throw error;
    }
  }

  /**
   * Get lesson activity summary for instructor
   */
  static async getLessonActivitySummary(lessonId) {
    try {
      const activities = await StudentActivity.findAll({
        where: { lessonId },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['lastActivityAt', 'DESC']]
      });

      const summary = {
        totalActivities: activities.length,
        activeStudents: activities.filter(a => a.isActive).length,
        completedStudents: activities.filter(a => a.activityType === 'lesson_completed').length,
        students: activities.map(activity => ({
          id: activity.student.id,
          name: `${activity.student.firstName} ${activity.student.lastName}`,
          email: activity.student.email,
          status: activity.isActive ? 'active' : 'completed',
          progressPercentage: activity.progressPercentage,
          lastActivityAt: activity.lastActivityAt,
          timeSpent: activity.timeSpent,
          activityType: activity.activityType
        }))
      };

      return summary;
    } catch (error) {
      console.error('Error getting lesson activity summary:', error);
      throw error;
    }
  }

  /**
   * Clean up old inactive activities (older than 24 hours)
   */
  static async cleanupOldActivities() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await StudentActivity.update(
        { isActive: false },
        {
          where: {
            isActive: true,
            lastActivityAt: {
              [models.Sequelize.Op.lt]: oneDayAgo
            }
          }
        }
      );

      console.log(`Cleaned up ${result[0]} old inactive activities`);
      return result[0];
    } catch (error) {
      console.error('Error cleaning up old activities:', error);
      throw error;
    }
  }
}

module.exports = LessonActivityService;
