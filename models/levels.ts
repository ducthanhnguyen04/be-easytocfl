'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface LevelAttributes {
  id: number;
  levelName: string;
  level: string;
}

interface LevelCreationAttributes extends Optional<LevelAttributes, 'id'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Levels extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
    declare id: number;
    declare levelName: string;
    declare level: string;

    static associate(models: any) {
      // define association here
    }
  }

  Levels.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    levelName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Levels',
  });

  return Levels;
};