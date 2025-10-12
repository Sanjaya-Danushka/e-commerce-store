import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const CartItem = sequelize.define('CartItem', {
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deliveryOptionId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'DeliveryOptions',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE(3)
  },
  updatedAt: {
    type: DataTypes.DATE(3)
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId'] // Ensure one cart item per user per product
    }
  ],
  defaultScope: {
    order: [['createdAt', 'ASC']]
  }
});

export default CartItem;
