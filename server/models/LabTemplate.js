const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LabTemplate = sequelize.define('LabTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
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
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    eveTemplateId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'EVE-NG template identifier'
    },
    topology: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Network topology configuration'
    },
    devices: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Device configurations and connections'
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner'
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Estimated duration in minutes'
    },
    prerequisites: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Required knowledge or skills'
    },
    learningObjectives: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'What students will learn'
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Lab instructions for students'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    maxConcurrentUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: 'Maximum number of concurrent users'
    },
    resourceRequirements: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'CPU, RAM, and other resource requirements'
    }
  }, {
    tableName: 'lab_templates',
    timestamps: true,
    indexes: [
      {
        fields: ['courseId']
      },
      {
        fields: ['eveTemplateId']
      },
      {
        fields: ['difficulty']
      }
    ]
  });

  // Instance methods
  LabTemplate.prototype.getDeviceCount = function() {
    return this.devices ? Object.keys(this.devices).length : 0;
  };

  LabTemplate.prototype.getRouterCount = function() {
    if (!this.devices) return 0;
    return Object.values(this.devices).filter(device => 
      device.type === 'router' || device.type === 'ios'
    ).length;
  };

  LabTemplate.prototype.getSwitchCount = function() {
    if (!this.devices) return 0;
    return Object.values(this.devices).filter(device => 
      device.type === 'switch' || device.type === 'iosv'
    ).length;
  };

  LabTemplate.prototype.getEstimatedResources = function() {
    const deviceCount = this.getDeviceCount();
    const routerCount = this.getRouterCount();
    
    return {
      cpu: Math.max(2, routerCount * 1 + deviceCount * 0.5),
      ram: Math.max(4, routerCount * 2 + deviceCount * 1),
      storage: Math.max(10, deviceCount * 2)
    };
  };

  // Static methods
  LabTemplate.findByCourse = function(courseId) {
    return this.findAll({
      where: {
        courseId,
        isActive: true
      },
      order: [['difficulty', 'ASC'], ['name', 'ASC']]
    });
  };

  LabTemplate.findByDifficulty = function(difficulty) {
    return this.findAll({
      where: {
        difficulty,
        isActive: true
      }
    });
  };

  // Associations
  LabTemplate.associate = (models) => {
    LabTemplate.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
    // Note: labTemplateId is a string identifier, not a foreign key
    // LabTemplate.hasMany(models.LabSession, {
    //   foreignKey: 'labTemplateId',
    //   as: 'sessions'
    // });
  };

  return LabTemplate;
};
