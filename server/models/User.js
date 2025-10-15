const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    role: {
      type: DataTypes.ENUM('student', 'instructor', 'organization_admin'),
      allowNull: false,
      defaultValue: 'student'
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    affiliateCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    referredBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    referralCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkedinProfile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        if (user.role === 'student' && !user.affiliateCode) {
          user.affiliateCode = generateAffiliateCode();
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Instance methods
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generateAffiliateCode = function() {
    return 'MAIKO' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  // Static methods
  User.generateAffiliateCode = function() {
    return 'MAIKO' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  // Associations
  User.associate = (models) => {
    User.belongsTo(models.Organization, { foreignKey: 'organizationId', as: 'organization' });
    User.belongsTo(User, { foreignKey: 'referredBy', as: 'referrer' });
    User.hasMany(User, { foreignKey: 'referredBy', as: 'referrals' });
    
    // Course associations
    User.hasMany(models.Course, { foreignKey: 'instructorId', as: 'courses' });
    User.belongsToMany(models.Course, { 
      through: models.CourseEnrollment, 
      foreignKey: 'userId', 
      otherKey: 'courseId',
      as: 'enrolledCourses' 
    });
    
    // CourseEnrollment associations
    User.hasMany(models.CourseEnrollment, { foreignKey: 'userId', as: 'enrollments' });
    
    // Certificate associations
    User.hasMany(models.Certificate, { foreignKey: 'userId', as: 'certificates' });
    
    // Forum associations
    User.hasMany(models.Forum, { foreignKey: 'creatorId', as: 'forums' });
    User.hasMany(models.ForumPost, { foreignKey: 'authorId', as: 'forumPosts' });
    User.hasMany(models.ForumReaction, { foreignKey: 'userId', as: 'forumReactions' });
    
    // Lab associations
    User.hasMany(models.LabSession, { foreignKey: 'userId', as: 'labSessions' });
  };

  return User;
};

function generateAffiliateCode() {
  return 'MAIKO' + Math.random().toString(36).substr(2, 6).toUpperCase();
}
