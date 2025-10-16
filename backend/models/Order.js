import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow null for backward compatibility with existing orders
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  orderTimeMs: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  totalCostCents: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  products: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    allowNull: false
  },
  cancellationReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cancellationOtherReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  returnReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  returnOtherReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  returnedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE(3)
  },
  updatedAt: {
    type: DataTypes.DATE(3)
  },
}, {
  defaultScope: {
    order: [['createdAt', 'ASC']]
  }
});

// Import User for associations
import User from './User.js';

// Associations
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

export default Order;
