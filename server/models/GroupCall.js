const { DataTypes } = require('sequelize');

const GroupCall = (sequelize) => {
  const GroupCall = sequelize.define('GroupCall', {
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
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'active', 'ended', 'cancelled'),
      defaultValue: 'scheduled'
    },
    callType: {
      type: DataTypes.ENUM('discussion', 'live_lesson', 'proctored_exam'),
      defaultValue: 'discussion'
    },
    isLiveLesson: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isProctoredExam: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accessFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    currentParticipants: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isRecording: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recordingUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    instructorControls: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        allowScreenShare: true,
        allowStudentVideo: false,
        allowStudentAudio: false,
        allowChat: true,
        allowQuestions: true,
        muteAllStudents: false,
        requireHandRaise: true,
        allowRecording: false
      }
    },
    moderators: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    examSettings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        allowTabSwitch: false,
        allowCopyPaste: false,
        requireFullScreen: true,
        monitorScreen: true,
        timeLimit: null,
        questionCount: 0
      }
    }
  }, {
    tableName: 'group_calls',
    timestamps: true
  });

  return GroupCall;
};

module.exports = GroupCall;
