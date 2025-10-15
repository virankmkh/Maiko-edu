const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certificate = sequelize.define('Certificate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    certificateId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
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
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    maxScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certificatePath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'default'
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'certificates',
    timestamps: true,
    hooks: {
      beforeCreate: (certificate) => {
        // Generate certificate ID if not provided
        if (!certificate.certificateId) {
          const timestamp = Date.now().toString(36);
          const random = Math.random().toString(36).substr(2, 5);
          certificate.certificateId = `CERT${timestamp}${random}`.toUpperCase();
        }
        
        // Generate verification code if not provided
        if (!certificate.verificationCode) {
          const timestamp = Date.now().toString(36);
          const random = Math.random().toString(36).substr(2, 8);
          certificate.verificationCode = `VERIFY${timestamp}${random}`.toUpperCase();
        }
      }
    }
  });

  // Instance methods
  Certificate.prototype.generateVerificationUrl = function() {
    return `${process.env.CLIENT_URL}/verify-certificate/${this.verificationCode}`;
  };

  Certificate.prototype.isExpired = function() {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  };

  Certificate.prototype.getValidityStatus = function() {
    if (!this.isActive) return 'revoked';
    if (this.isExpired()) return 'expired';
    if (this.isVerified) return 'verified';
    return 'pending';
  };

  // Static methods
  Certificate.generateCertificateId = function() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CERT${timestamp}${random}`.toUpperCase();
  };

  Certificate.generateVerificationCode = function() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    return `VERIFY${timestamp}${random}`.toUpperCase();
  };

  // Associations
  Certificate.associate = (models) => {
    Certificate.belongsTo(models.Course, { 
      foreignKey: 'courseId', 
      as: 'course' 
    });
    Certificate.belongsTo(models.User, { 
      foreignKey: 'userId', 
      as: 'user' 
    });
    Certificate.belongsTo(models.Organization, { 
      foreignKey: 'organizationId', 
      as: 'organization' 
    });
    Certificate.belongsTo(models.User, { 
      foreignKey: 'instructorId', 
      as: 'instructor' 
    });
  };

  return Certificate;
};