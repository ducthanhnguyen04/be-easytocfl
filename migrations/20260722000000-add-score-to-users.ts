'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('Users', 'score', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('Users', 'score');
}
