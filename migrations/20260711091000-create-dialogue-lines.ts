'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('DialogueLines', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    dialogueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Dialogues',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    lineOrder: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    character: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pinyin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    translation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: true
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
  await queryInterface.dropTable('DialogueLines');
}
