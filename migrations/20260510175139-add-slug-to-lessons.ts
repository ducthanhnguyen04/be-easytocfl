'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('Lessons', 'slug', {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('Lessons', 'slug');
}
