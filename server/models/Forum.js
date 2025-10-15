const { DataTypes } = require('sequelize');

const Forum = (sequelize) => {
  const Forum = sequelize.define('Forum', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      allowNull: true, // null for course-level forum
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    postCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'forums',
    timestamps: true
  });

  // Define associations
  Forum.associate = (models) => {
    Forum.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    Forum.belongsTo(models.Lesson, { foreignKey: 'lessonId', as: 'lesson' });
    Forum.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    Forum.hasMany(models.ForumPost, { foreignKey: 'forumId', as: 'posts' });
  };

  return Forum;
};

module.exports = Forum;
