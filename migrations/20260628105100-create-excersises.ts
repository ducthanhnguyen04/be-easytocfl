'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Excersises', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    meaning: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    englishMeaning: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    grammarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Grammars',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
  await queryInterface.dropTable('Excersises');
}
