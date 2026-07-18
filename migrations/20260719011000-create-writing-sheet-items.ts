'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('WritingSheetItems', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    writingSheetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'WritingSheets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    vocab: {
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
  await queryInterface.dropTable('WritingSheetItems');
}
