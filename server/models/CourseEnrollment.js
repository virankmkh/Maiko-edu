const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CourseEnrollment = sequelize.define('CourseEnrollment', {
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
    enrolledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    completedLessons: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('free', 'paid', 'pending'),
      allowNull: false,
      defaultValue: 'free',
      comment: 'free: enrolled for free preview, paid: full course access, pending: payment in progress'
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Payment gateway transaction ID'
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When payment was completed'
    },
    freeLessonsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of free lessons completed'
    }
  }, {
    tableName: 'course_enrollments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId']
      }
    ]
  });

  // Associations
  CourseEnrollment.associate = (models) => {
    CourseEnrollment.belongsTo(models.User, { foreignKey: 'userId', as: 'student' });
    CourseEnrollment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  };

  return CourseEnrollment;
};
