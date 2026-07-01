'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface LevelAttributes {
  id: number;
  levelName: string;
  level: string;
  image?: string;
}

interface LevelCreationAttributes extends Optional<LevelAttributes, 'id' | 'image'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Levels extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
    declare id: number;
    declare levelName: string;
    declare level: string;
    declare image?: string;

    static associate(models: any) {
      // define association here
      this.hasMany(models.Lessons, {
        foreignKey: 'levelId',
        as: 'lessons',
      });
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
    image: {
      type: dataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Levels',
  });

  return Levels;
};