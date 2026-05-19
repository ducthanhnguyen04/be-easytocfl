'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Examples', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    meaning: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pinyin: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    audioUrl: {
      type: DataTypes.TEXT
    },
    vocabularyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vocabularies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    grammarId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  await queryInterface.dropTable('Examples');
}
