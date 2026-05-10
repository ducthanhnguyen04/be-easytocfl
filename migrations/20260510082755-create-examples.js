'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Examples', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      example: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      meaning: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      pinyin: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      audioUrl: {
        type: Sequelize.TEXT
      },
      vocabularyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Vocabularies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      grammarId: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Examples');
  }
};