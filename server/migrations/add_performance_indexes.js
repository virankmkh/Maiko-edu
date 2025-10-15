// Database Performance Indexes for 100 Concurrent Group Calls
const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // GroupCall indexes
    await queryInterface.addIndex('group_calls', ['status', 'scheduledAt']);
    await queryInterface.addIndex('group_calls', ['hostId', 'status']);
    await queryInterface.addIndex('group_calls', ['isLiveLesson', 'status']);
    await queryInterface.addIndex('group_calls', ['roomId']);

    // LiveLessonParticipant indexes
    await queryInterface.addIndex('live_lesson_participants', ['callId', 'userId']);
    await queryInterface.addIndex('live_lesson_participants', ['callId', 'role']);
    await queryInterface.addIndex('live_lesson_participants', ['userId', 'joinedAt']);
    await queryInterface.addIndex('live_lesson_participants', ['handRaised', 'handRaisedAt']);

    // Forum indexes
    await queryInterface.addIndex('forums', ['courseId', 'lessonId']);
    await queryInterface.addIndex('forums', ['isActive', 'lastActivityAt']);
    await queryInterface.addIndex('forums', ['isPinned', 'lastActivityAt']);

    // ForumPost indexes
    await queryInterface.addIndex('forum_posts', ['forumId', 'parentPostId']);
    await queryInterface.addIndex('forum_posts', ['authorId', 'createdAt']);
    await queryInterface.addIndex('forum_posts', ['isPinned', 'createdAt']);
    await queryInterface.addIndex('forum_posts', ['postType', 'createdAt']);
    await queryInterface.addIndex('forum_posts', ['createdAt']); // For pagination

    // ForumReaction indexes
    await queryInterface.addIndex('forum_reactions', ['postId', 'userId']);
    await queryInterface.addIndex('forum_reactions', ['postId', 'reactionType']);

    // LiveLessonPayment indexes
    await queryInterface.addIndex('live_lesson_payments', ['callId', 'studentId']);
    await queryInterface.addIndex('live_lesson_payments', ['status', 'paidAt']);
    await queryInterface.addIndex('live_lesson_payments', ['studentId', 'createdAt']);

    // Transaction indexes
    await queryInterface.addIndex('transactions', ['userId', 'status']);
    await queryInterface.addIndex('transactions', ['transactionType', 'status']);
    await queryInterface.addIndex('transactions', ['providerTransactionId']);
    await queryInterface.addIndex('transactions', ['createdAt']);

    // PaymentMethod indexes
    await queryInterface.addIndex('payment_methods', ['userId', 'methodType']);
    await queryInterface.addIndex('payment_methods', ['userId', 'isDefault']);
    await queryInterface.addIndex('payment_methods', ['isActive', 'country']);

    // Course indexes
    await queryInterface.addIndex('courses', ['status', 'isPublished']);
    await queryInterface.addIndex('courses', ['category', 'status']);
    await queryInterface.addIndex('courses', ['price', 'status']);

    // User indexes
    await queryInterface.addIndex('users', ['role', 'isActive']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['lastLogin']);

    // CourseEnrollment indexes
    await queryInterface.addIndex('course_enrollments', ['studentId', 'courseId']);
    await queryInterface.addIndex('course_enrollments', ['courseId', 'enrolledAt']);
    await queryInterface.addIndex('course_enrollments', ['status', 'enrolledAt']);
  },

  down: async (queryInterface) => {
    // Remove all indexes
    const indexes = [
      'group_calls_status_scheduledAt',
      'group_calls_hostId_status',
      'group_calls_isLiveLesson_status',
      'group_calls_roomId',
      'live_lesson_participants_callId_userId',
      'live_lesson_participants_callId_role',
      'live_lesson_participants_userId_joinedAt',
      'live_lesson_participants_handRaised_handRaisedAt',
      'forums_courseId_lessonId',
      'forums_isActive_lastActivityAt',
      'forums_isPinned_lastActivityAt',
      'forum_posts_forumId_parentPostId',
      'forum_posts_authorId_createdAt',
      'forum_posts_isPinned_createdAt',
      'forum_posts_postType_createdAt',
      'forum_posts_createdAt',
      'forum_reactions_postId_userId',
      'forum_reactions_postId_reactionType',
      'live_lesson_payments_callId_studentId',
      'live_lesson_payments_status_paidAt',
      'live_lesson_payments_studentId_createdAt',
      'transactions_userId_status',
      'transactions_transactionType_status',
      'transactions_providerTransactionId',
      'transactions_createdAt',
      'payment_methods_userId_methodType',
      'payment_methods_userId_isDefault',
      'payment_methods_isActive_country',
      'courses_status_isPublished',
      'courses_category_status',
      'courses_price_status',
      'users_role_isActive',
      'users_email',
      'users_lastLogin',
      'course_enrollments_studentId_courseId',
      'course_enrollments_courseId_enrolledAt',
      'course_enrollments_status_enrolledAt'
    ];

    for (const index of indexes) {
      try {
        await queryInterface.removeIndex('table_name', index);
      } catch (error) {
        console.log(`Index ${index} not found, skipping...`);
      }
    }
  }
};





