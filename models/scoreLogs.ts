'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface ScoreLogAttributes {
  id: number;
  userId: number;
  activityType: 'quiz' | 'lesson' | 'exam' | 'streak';
  activityId: string;
  points: number;
  timeSpent: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ScoreLogCreationAttributes extends Optional<ScoreLogAttributes, 'id' | 'points' | 'timeSpent'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class ScoreLogs extends Model<ScoreLogAttributes, ScoreLogCreationAttributes> implements ScoreLogAttributes {
    declare id: number;
    declare userId: number;
    declare activityType: 'quiz' | 'lesson' | 'exam' | 'streak';
    declare activityId: string;
    declare points: number;
    declare timeSpent: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  ScoreLogs.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    activityType: {
      type: dataTypes.STRING(50),
      allowNull: false,
    },
    activityId: {
      type: dataTypes.STRING(255),
      allowNull: false,
    },
    points: {
      type: dataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    timeSpent: {
      type: dataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'ScoreLogs',
    tableName: 'ScoreLogs',
  });

  return ScoreLogs;
};
