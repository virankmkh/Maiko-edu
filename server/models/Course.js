const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    shortDescription: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    previewVideo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('business', 'technology', 'design', 'marketing', 'lifestyle', 'health', 'education'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    language: {
      type: DataTypes.ENUM('en', 'fr'),
      defaultValue: 'en'
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner'
    },
    level: {
      type: DataTypes.ENUM('basic', 'intermediate', 'advanced', 'expert'),
      defaultValue: 'basic'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    enrollmentLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    currentEnrollments: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    affiliateCommission: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 20.00,
      validate: {
        min: 0,
        max: 100
      }
    },
    affiliateCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    totalLessons: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalDuration: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5
      }
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('draft', 'review', 'published', 'archived'),
      defaultValue: 'draft'
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    keywords: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    prerequisites: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    learningOutcomes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    targetAudience: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    providesCertificate: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    certificateTemplate: {
      type: DataTypes.STRING,
      defaultValue: 'default'
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    uniqueViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasLabContent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this course includes networking lab content'
    },
    labAccessLevel: {
      type: DataTypes.ENUM('none', 'basic', 'intermediate', 'advanced'),
      defaultValue: 'none',
      comment: 'Level of lab access for this course'
    },
    labInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'General lab instructions for the course'
    },
    labPrerequisites: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Lab-specific prerequisites'
    },
    // New fields for enhanced course creation
    enableLiveSessions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Enable Jitsi live sessions for this course'
    },
    enableInteractiveContent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Enable interactive learning activities (H5P)'
    },
    enableMarketing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Enable marketing coupon for affiliates'
    },
    enableMaikoCampaign: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Let MAIKO EDU run marketing campaigns'
    },
    instructorShare: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      comment: 'Instructor commission (40% of course price)'
    },
    maikoCommission: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      comment: 'Maiko commission (5% of instructor share)'
    },
    firstLessonFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'First lesson is always free for students'
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of enrolled students'
    },
    earnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      comment: 'Total earnings from this course'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      comment: 'Course rating (0-5)'
    },
    lessonsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of lessons in this course'
    }
  }, {
    tableName: 'courses',
    timestamps: true,
    hooks: {
      beforeCreate: (course) => {
        // Generate slug from title
        if (course.title && !course.slug) {
          course.slug = course.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        
        // Generate affiliate code
        if (!course.affiliateCode) {
          course.affiliateCode = course.generateAffiliateCode();
        }
      }
    }
  });

  // Instance methods
  Course.prototype.generateAffiliateCode = function() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `COURSE${timestamp}${random}`.toUpperCase();
  };

  Course.prototype.getUserProgress = function(userId) {
    // This would be implemented in the enrollment logic
    return 0;
  };

  // Virtual fields
  Course.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Add virtual fields
    values.isFull = this.enrollmentLimit ? this.currentEnrollments >= this.enrollmentLimit : false;
    values.ratingStars = Math.round(this.averageRating);
    
    return values;
  };

  // Static methods
  Course.generateAffiliateCode = function() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `COURSE${timestamp}${random}`.toUpperCase();
  };

  // Associations
  Course.associate = (models) => {
    Course.belongsTo(models.Organization, { 
      foreignKey: 'organizationId', 
      as: 'organization' 
    });
    Course.belongsTo(models.User, { 
      foreignKey: 'instructorId', 
      as: 'instructor' 
    });
    Course.belongsTo(models.User, { 
      foreignKey: 'approvedBy', 
      as: 'approver' 
    });
    Course.hasMany(models.CourseEnrollment, { 
      foreignKey: 'courseId', 
      as: 'enrollments' 
    });
    Course.hasMany(models.Lesson, { 
      foreignKey: 'courseId', 
      as: 'lessons' 
    });
    Course.hasMany(models.Forum, { 
      foreignKey: 'courseId', 
      as: 'forums' 
    });
  };

  return Course;
};