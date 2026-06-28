'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Radicals', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    radical: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pinyin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    meaning: {
      type: DataTypes.STRING,
      allowNull: false
    },
    englishMeaning: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profoundMeaning: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stroke: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('Radicals');
}
