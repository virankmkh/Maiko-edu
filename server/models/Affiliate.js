const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Affiliate = sequelize.define('Affiliate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    affiliateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    affiliateCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    totalReferrals: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    pendingEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    paidEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    commissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 10.00 // 10% commission
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastPayoutDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payoutMethod: {
      type: DataTypes.ENUM('paypal', 'mobile_money', 'bank_transfer'),
      allowNull: true
    },
    payoutDetails: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'affiliates',
    timestamps: true
  });

  // Instance methods
  Affiliate.prototype.addReferral = function(userId) {
    this.totalReferrals += 1;
    return this.save();
  };

  Affiliate.prototype.addEarnings = function(amount) {
    this.totalEarnings += parseFloat(amount);
    this.pendingEarnings += parseFloat(amount);
    return this.save();
  };

  Affiliate.prototype.processPayout = function(amount) {
    if (this.pendingEarnings >= amount) {
      this.pendingEarnings -= parseFloat(amount);
      this.paidEarnings += parseFloat(amount);
      this.lastPayoutDate = new Date();
      return this.save();
    }
    throw new Error('Insufficient pending earnings');
  };

  // Associations
  Affiliate.associate = (models) => {
    Affiliate.belongsTo(models.User, { foreignKey: 'affiliateId', as: 'user' });
  };

  return Affiliate;
};
