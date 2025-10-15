const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LabSession = sequelize.define('LabSession', {
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
    labTemplateId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'EVE-NG lab template identifier'
    },
    eveLabId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'EVE-NG lab instance ID'
    },
    status: {
      type: DataTypes.ENUM('starting', 'running', 'stopped', 'error', 'saving'),
      defaultValue: 'starting'
    },
    deviceConnections: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Device connection details (IP, port, etc.)'
    },
    labConfiguration: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Lab topology and device configuration'
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stoppedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: true
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'lab_sessions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'courseId']
      },
      {
        fields: ['eveLabId']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Instance methods
  LabSession.prototype.isRunning = function() {
    return this.status === 'running';
  };

  LabSession.prototype.isStopped = function() {
    return this.status === 'stopped';
  };

  LabSession.prototype.hasError = function() {
    return this.status === 'error';
  };

  LabSession.prototype.getDeviceConnection = function(deviceName) {
    if (!this.deviceConnections) return null;
    return this.deviceConnections[deviceName] || null;
  };

  LabSession.prototype.updateActivity = function() {
    this.lastActivity = new Date();
    return this.save();
  };

  // Static methods
  LabSession.findActiveByUser = function(userId) {
    return this.findOne({
      where: {
        userId,
        isActive: true,
        status: 'running'
      }
    });
  };

  LabSession.findByUserAndCourse = function(userId, courseId) {
    return this.findOne({
      where: {
        userId,
        courseId,
        isActive: true
      }
    });
  };

  // Associations
  LabSession.associate = (models) => {
    LabSession.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    LabSession.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return LabSession;
};
