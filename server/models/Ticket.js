const { DataTypes } = require('sequelize');

const Ticket = (sequelize) => {
  const TicketModel = sequelize.define('Ticket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('free', 'paid', 'donation'),
      allowNull: false,
      defaultValue: 'free'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    soldQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    salesStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    salesEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    minOrderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    maxOrderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    requiresApproval: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isTransferable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isRefundable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    refundPolicy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customFields: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'tickets',
    timestamps: true,
    indexes: [
      {
        fields: ['eventId']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['type']
      },
      {
        fields: ['salesStartDate', 'salesEndDate']
      }
    ]
  });

  // Instance methods
  TicketModel.prototype.isOnSale = function() {
    const now = new Date();
    const salesStart = this.salesStartDate || this.createdAt;
    const salesEnd = this.salesEndDate;
    
    const isWithinSalesPeriod = now >= salesStart && (!salesEnd || now <= salesEnd);
    const hasQuantity = !this.quantity || this.soldQuantity < this.quantity;
    
    return this.isActive && isWithinSalesPeriod && hasQuantity;
  };

  TicketModel.prototype.getAvailableQuantity = function() {
    if (!this.quantity) return null;
    return Math.max(0, this.quantity - this.soldQuantity);
  };

  TicketModel.prototype.canPurchase = function(quantity = 1) {
    if (!this.isOnSale()) return false;
    if (quantity < this.minOrderQuantity) return false;
    if (this.maxOrderQuantity && quantity > this.maxOrderQuantity) return false;
    
    const available = this.getAvailableQuantity();
    if (available !== null && quantity > available) return false;
    
    return true;
  };

  // Hooks
  TicketModel.beforeCreate(async (ticket) => {
    if (ticket.type === 'free') {
      ticket.price = 0.00;
    }
  });

  TicketModel.beforeUpdate(async (ticket) => {
    if (ticket.changed('type') && ticket.type === 'free') {
      ticket.price = 0.00;
    }
  });

  return TicketModel;
};

module.exports = Ticket;