'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('Levels', 'slug', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('Levels', 'slug');
}
