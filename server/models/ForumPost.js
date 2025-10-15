const { DataTypes } = require('sequelize');

const ForumPost = (sequelize) => {
  const ForumPost = sequelize.define('ForumPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    forumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forums',
        key: 'id'
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    parentPostId: {
      type: DataTypes.INTEGER,
      allowNull: true, // for replies
      references: {
        model: 'forum_posts',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true // can be null for replies
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    postType: {
      type: DataTypes.ENUM('text', 'audio', 'video', 'announcement', 'question', 'discussion'),
      defaultValue: 'text'
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'audio', 'video', 'document'),
      allowNull: true
    },
    mediaDuration: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isResolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // for questions
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    replyCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'forum_posts',
    timestamps: true
  });

  // Define associations
  ForumPost.associate = (models) => {
    ForumPost.belongsTo(models.Forum, { foreignKey: 'forumId', as: 'forum' });
    ForumPost.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    ForumPost.belongsTo(models.ForumPost, { foreignKey: 'parentPostId', as: 'parentPost' });
    ForumPost.hasMany(models.ForumPost, { foreignKey: 'parentPostId', as: 'replies' });
  };

  return ForumPost;
};

module.exports = ForumPost;
