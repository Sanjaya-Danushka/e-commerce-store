import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('Orders', 'cancellationReason', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('Orders', 'cancellationOtherReason', {
    type: DataTypes.TEXT,
    allowNull: true
  });

  await queryInterface.addColumn('Orders', 'cancelledAt', {
    type: DataTypes.DATE,
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('Orders', 'cancellationReason');
  await queryInterface.removeColumn('Orders', 'cancellationOtherReason');
  await queryInterface.removeColumn('Orders', 'cancelledAt');
}
