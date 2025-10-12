import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  dateAdded: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  createdAt: {
    type: DataTypes.DATE(3)
  },
  updatedAt: {
    type: DataTypes.DATE(3)
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId'] // Ensure one wishlist item per user per product
    }
  ]
});

export default Wishlist;
