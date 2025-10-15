const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lesson = sequelize.define('Lesson', {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Multiple content types support
    contentTypes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of content types: [video, text, quiz, assignment, document, h5p]'
    },
    
    // Video content
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Secure video file path (encrypted, no direct download)'
    },
    videoDuration: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true,
      validate: {
        max: 1200 // 20 minutes max
      }
    },
    videoThumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Video thumbnail image path'
    },
    videoEncrypted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether video is encrypted for security'
    },
    
    // Document content
    documentUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'PDF, DOC, PPT, etc.'
    },
    
    // Audio content
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Audio file path for podcasts/lectures'
    },
    audioDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    prerequisites: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    objectives: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    resources: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    // Quiz and Assignment data
    quizData: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Quiz questions, answers, and configuration'
    },
    quizSettings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'Quiz settings: time limit, attempts, show answers, etc.'
    },
    assignmentData: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Assignment questions and requirements'
    },
    assignmentSettings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'Assignment settings: due date, grading criteria, etc.'
    },
    
    // Grading system
    maxPoints: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Maximum points for this lesson'
    },
    passingScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Minimum score to pass this lesson'
    },
    countsTowardsFinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this lesson counts towards final grade'
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 1.0,
      comment: 'Weight of this lesson in final grade calculation'
    },
    
    // H5P Content Fields
    h5pContentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the H5P content for this lesson'
    },
    h5pContentType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Type of H5P content (InteractiveVideo, DragQuestion, etc.)'
    },
    h5pContentData: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'H5P content configuration and metadata'
    },
    h5pProgress: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'Student progress data for H5P content'
    },
    h5pMaxScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum possible score for H5P content'
    },
    h5pPassingScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Minimum score required to pass H5P content'
    }
  }, {
    tableName: 'lessons',
    timestamps: true
  });

  // Associations
  Lesson.associate = (models) => {
    Lesson.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  };

  return Lesson;
};
