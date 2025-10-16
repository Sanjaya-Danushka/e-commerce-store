import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('Orders', 'returnReason', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('Orders', 'returnOtherReason', {
    type: DataTypes.TEXT,
    allowNull: true
  });

  await queryInterface.addColumn('Orders', 'returnedAt', {
    type: DataTypes.DATE,
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('Orders', 'returnReason');
  await queryInterface.removeColumn('Orders', 'returnOtherReason');
  await queryInterface.removeColumn('Orders', 'returnedAt');
}
