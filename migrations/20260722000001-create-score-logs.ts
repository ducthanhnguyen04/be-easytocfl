'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('ScoreLogs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    activityType: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    activityId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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

  // Add indexes
  await queryInterface.addIndex('ScoreLogs', ['userId', 'activityType', 'activityId'], {
    name: 'idx_score_logs_user_activity'
  });
  await queryInterface.addIndex('ScoreLogs', ['userId'], {
    name: 'idx_score_logs_userId'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('ScoreLogs');
}
