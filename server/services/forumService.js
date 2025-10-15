const { sequelize, models } = require('../config/database');
const { Forum, Course, Lesson, User } = models;

class ForumService {
  /**
   * Create automatic forums for a course
   * @param {number} courseId - Course ID
   * @param {number} instructorId - Instructor ID
   */
  static async createCourseForums(courseId, instructorId) {
    try {
      // Get course details
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Create main course forum
      const courseForum = await Forum.create({
        courseId,
        lessonId: null, // Course-level forum
        title: `${course.title} - General Discussion`,
        description: `General discussion forum for ${course.title}. Ask questions, share insights, and collaborate with fellow students.`,
        isActive: true,
        isPinned: true,
        creatorId: instructorId
      });

      console.log(`✅ Created course forum: ${courseForum.title}`);

      return courseForum;
    } catch (error) {
      console.error('Error creating course forums:', error);
      throw error;
    }
  }

  /**
   * Create automatic forum for a lesson
   * @param {number} lessonId - Lesson ID
   * @param {number} courseId - Course ID
   * @param {number} instructorId - Instructor ID
   */
  static async createLessonForum(lessonId, courseId, instructorId) {
    try {
      // Get lesson details
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Create lesson forum
      const lessonForum = await Forum.create({
        courseId,
        lessonId,
        title: `${lesson.title} - Discussion`,
        description: `Discussion forum for ${lesson.title}. Ask questions about this specific lesson content.`,
        isActive: true,
        isPinned: false,
        creatorId: instructorId
      });

      console.log(`✅ Created lesson forum: ${lessonForum.title}`);

      return lessonForum;
    } catch (error) {
      console.error('Error creating lesson forum:', error);
      throw error;
    }
  }

  /**
   * Check if user has access to a forum
   * @param {number} forumId - Forum ID
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   */
  static async checkForumAccess(forumId, userId, userRole) {
    try {
      const forum = await Forum.findByPk(forumId, {
        include: [
          { model: Course, as: 'course' },
          { model: Lesson, as: 'lesson' }
        ]
      });

      if (!forum) {
        return { hasAccess: false, reason: 'Forum not found' };
      }

      // Admin and organization admin have access to all forums
      if (userRole === 'admin' || userRole === 'organization_admin') {
        return { hasAccess: true, reason: 'Admin access' };
      }

      // Check if user is the course instructor
      if (userRole === 'instructor' && forum.course.instructorId === userId) {
        return { hasAccess: true, reason: 'Course instructor' };
      }

      // Check if user is enrolled in the course
      const enrollment = await models.CourseEnrollment.findOne({
        where: { 
          courseId: forum.courseId, 
          userId: userId, 
          isActive: true 
        }
      });

      if (!enrollment) {
        return { hasAccess: false, reason: 'Not enrolled in course' };
      }

      // If it's a lesson forum, check if user has started the lesson
      if (forum.lessonId) {
        const lessonActivity = await models.StudentActivity.findOne({
          where: {
            userId: userId,
            lessonId: forum.lessonId,
            activityType: 'lesson_started'
          }
        });

        if (!lessonActivity) {
          return { 
            hasAccess: false, 
            reason: 'Must start lesson before accessing forum',
            lessonTitle: forum.lesson.title
          };
        }
      }

      return { hasAccess: true, reason: 'Enrolled student' };
    } catch (error) {
      console.error('Error checking forum access:', error);
      return { hasAccess: false, reason: 'Error checking access' };
    }
  }

  /**
   * Get forums accessible to a user for a course
   * @param {number} courseId - Course ID
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   */
  static async getAccessibleForums(courseId, userId, userRole) {
    try {
      // Get all forums for the course
      const forums = await Forum.findAll({
        where: { courseId, isActive: true },
        include: [
          { model: Lesson, as: 'lesson', attributes: ['id', 'title', 'order'] },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
        ],
        order: [
          ['isPinned', 'DESC'],
          ['lessonId', 'ASC'], // Course forums first, then lesson forums
          ['postCount', 'DESC'],
          ['lastActivityAt', 'DESC']
        ]
      });

      const accessibleForums = [];

      for (const forum of forums) {
        const access = await this.checkForumAccess(forum.id, userId, userRole);
        if (access.hasAccess) {
          accessibleForums.push({
            ...forum.toJSON(),
            accessReason: access.reason
          });
        }
      }

      return accessibleForums;
    } catch (error) {
      console.error('Error getting accessible forums:', error);
      throw error;
    }
  }

  /**
   * Get lesson progress for a user
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   */
  static async getUserLessonProgress(userId, courseId) {
    try {
      const lessonProgress = await models.StudentActivity.findAll({
        where: {
          userId: userId,
          courseId: courseId,
          activityType: 'lesson_started'
        },
        include: [
          { model: Lesson, as: 'lesson', attributes: ['id', 'title', 'order'] }
        ],
        order: [['lesson', 'order', 'ASC']]
      });

      return lessonProgress.map(activity => ({
        lessonId: activity.lessonId,
        lessonTitle: activity.lesson.title,
        lessonOrder: activity.lesson.order,
        startedAt: activity.timestamp,
        isActive: activity.isActive
      }));
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      throw error;
    }
  }

  /**
   * Create forums for all existing courses (migration)
   */
  static async createForumsForExistingCourses() {
    try {
      console.log('🔄 Creating forums for existing courses...');

      const courses = await Course.findAll({
        include: [
          { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      let createdCount = 0;

      for (const course of courses) {
        // Check if course already has a forum
        const existingForum = await Forum.findOne({
          where: { courseId: course.id, lessonId: null }
        });

        if (!existingForum) {
          await this.createCourseForums(course.id, course.instructorId);
          createdCount++;
        }

        // Create forums for lessons
        const lessons = await Lesson.findAll({
          where: { courseId: course.id },
          order: [['order', 'ASC']]
        });

        for (const lesson of lessons) {
          const existingLessonForum = await Forum.findOne({
            where: { courseId: course.id, lessonId: lesson.id }
          });

          if (!existingLessonForum) {
            await this.createLessonForum(lesson.id, course.id, course.instructorId);
            createdCount++;
          }
        }
      }

      console.log(`✅ Created ${createdCount} forums for existing courses`);
      return { createdCount, totalCourses: courses.length };
    } catch (error) {
      console.error('Error creating forums for existing courses:', error);
      throw error;
    }
  }
}

module.exports = ForumService;
