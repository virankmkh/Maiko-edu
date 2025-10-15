const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create analytics_events table
    await queryInterface.createTable('analytics_events', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      eventType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      eventCategory: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      eventAction: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      eventLabel: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      eventValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Courses',
          key: 'id'
        }
      },
      lessonId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Lessons',
          key: 'id'
        }
      },
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      referrer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      customData: {
        type: DataTypes.JSON,
        allowNull: true
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Create indexes for analytics_events
    await queryInterface.addIndex('analytics_events', ['userId']);
    await queryInterface.addIndex('analytics_events', ['eventType']);
    await queryInterface.addIndex('analytics_events', ['eventCategory']);
    await queryInterface.addIndex('analytics_events', ['courseId']);
    await queryInterface.addIndex('analytics_events', ['lessonId']);
    await queryInterface.addIndex('analytics_events', ['timestamp']);
    await queryInterface.addIndex('analytics_events', ['userId', 'eventType']);
    await queryInterface.addIndex('analytics_events', ['courseId', 'eventType']);

    // Create user_sessions table
    await queryInterface.createTable('user_sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      pageViews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      actions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    });

    // Create indexes for user_sessions
    await queryInterface.addIndex('user_sessions', ['userId']);
    await queryInterface.addIndex('user_sessions', ['sessionId']);
    await queryInterface.addIndex('user_sessions', ['startTime']);
    await queryInterface.addIndex('user_sessions', ['isActive']);

    // Create course_analytics table
    await queryInterface.createTable('course_analytics', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id'
        }
      },
      totalEnrollments: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalCompletions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      averageRating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true
      },
      totalRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      averageCompletionTime: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Create indexes for course_analytics
    await queryInterface.addIndex('course_analytics', ['courseId']);
    await queryInterface.addIndex('course_analytics', ['totalEnrollments']);
    await queryInterface.addIndex('course_analytics', ['totalCompletions']);
    await queryInterface.addIndex('course_analytics', ['totalRevenue']);

    // Create lesson_analytics table
    await queryInterface.createTable('lesson_analytics', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Lessons',
          key: 'id'
        }
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id'
        }
      },
      totalViews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalCompletions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      averageWatchTime: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      totalWatchTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      completionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Create indexes for lesson_analytics
    await queryInterface.addIndex('lesson_analytics', ['lessonId']);
    await queryInterface.addIndex('lesson_analytics', ['courseId']);
    await queryInterface.addIndex('lesson_analytics', ['totalViews']);
    await queryInterface.addIndex('lesson_analytics', ['completionRate']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lesson_analytics');
    await queryInterface.dropTable('course_analytics');
    await queryInterface.dropTable('user_sessions');
    await queryInterface.dropTable('analytics_events');
  }
};
