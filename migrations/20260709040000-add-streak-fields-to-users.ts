'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('Users', 'streakCount', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  });
  await queryInterface.addColumn('Users', 'lastStudyDate', {
    type: DataTypes.STRING,
    allowNull: true
  });
  await queryInterface.addColumn('Users', 'studyTimeToday', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  });
  await queryInterface.addColumn('Users', 'lastHeartbeatDate', {
    type: DataTypes.STRING,
    allowNull: true
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('Users', 'streakCount');
  await queryInterface.removeColumn('Users', 'lastStudyDate');
  await queryInterface.removeColumn('Users', 'studyTimeToday');
  await queryInterface.removeColumn('Users', 'lastHeartbeatDate');
}
