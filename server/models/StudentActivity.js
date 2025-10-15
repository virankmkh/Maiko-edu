const { DataTypes } = require('sequelize');

const StudentActivity = (sequelize) => sequelize.define('StudentActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  lessonId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'lessons',
      key: 'id'
    }
  },
  activityType: {
    type: DataTypes.ENUM(
      'lesson_started', 'lesson_in_progress', 'lesson_completed', 
      'quiz_attempted', 'quiz_completed', 'forum_post', 
      'course_started', 'course_completed', 'video_watched', 
      'assignment_submitted', 'lesson_paused', 'lesson_resumed'
    ),
    allowNull: false
  },
  activityDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  progressPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Progress percentage for the lesson (0-100)'
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time spent in seconds'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the student is currently active in this lesson'
  },
  lastActivityAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last activity timestamp for this lesson'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'student_activities',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'courseId']
    },
    {
      fields: ['courseId', 'timestamp']
    },
    {
      fields: ['lessonId', 'isActive']
    },
    {
      fields: ['activityType']
    },
    {
      fields: ['lastActivityAt']
    }
  ]
});

// Define associations
const associate = (models) => {
  models.StudentActivity.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'student'
  });
  
  models.StudentActivity.belongsTo(models.Course, {
    foreignKey: 'courseId',
    as: 'course'
  });
  
  models.StudentActivity.belongsTo(models.Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson'
  });
};

module.exports = StudentActivity;
module.exports.associate = associate;
