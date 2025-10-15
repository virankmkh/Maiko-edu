const { DataTypes } = require('sequelize');

const LiveLessonParticipant = (sequelize) => {
  const LiveLessonParticipant = sequelize.define('LiveLessonParticipant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    callId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group_calls',
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
    role: {
      type: DataTypes.ENUM('instructor', 'moderator', 'student'),
      allowNull: false,
      defaultValue: 'student'
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    leftAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isMuted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVideoEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isScreenSharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    handRaised: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    handRaisedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        canSpeak: false,
        canShareScreen: false,
        canChat: true,
        canAskQuestions: true,
        canModerate: false
      }
    },
    connectionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'live_lesson_participants',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['callId', 'userId']
      }
    ]
  });

  return LiveLessonParticipant;
};

module.exports = LiveLessonParticipant;
