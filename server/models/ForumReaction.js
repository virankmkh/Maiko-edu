const { DataTypes } = require('sequelize');

const ForumReaction = (sequelize) => {
  const ForumReaction = sequelize.define('ForumReaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forum_posts',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reactionType: {
      type: DataTypes.ENUM('like', 'dislike', 'love', 'laugh', 'angry', 'sad', 'wow'),
      allowNull: false
    }
  }, {
    tableName: 'forum_reactions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['postId', 'userId']
      }
    ]
  });

  return ForumReaction;
};

module.exports = ForumReaction;
