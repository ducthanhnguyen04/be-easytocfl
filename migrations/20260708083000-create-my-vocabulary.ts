'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('MyVocabulary', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
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
    myVocabulairesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MyVocabularies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exampleMeaning: {
      type: DataTypes.TEXT,
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
  await queryInterface.dropTable('MyVocabulary');
}
