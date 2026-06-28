'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface RadicalAttributes {
  id: number;
  radical: string;
  pinyin: string;
  meaning: string;
  englishMeaning: string;
  profoundMeaning?: string;
  example?: string;
  stroke: string;
}

interface RadicalCreationAttributes extends Optional<RadicalAttributes, 'id' | 'profoundMeaning' | 'example'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Radical extends Model<RadicalAttributes, RadicalCreationAttributes> implements RadicalAttributes {
    declare id: number;
    declare radical: string;
    declare pinyin: string;
    declare meaning: string;
    declare englishMeaning: string;
    declare profoundMeaning?: string;
    declare example?: string;
    declare stroke: string;

    static associate(models: any) {
      // define association here
    }
  }

  Radical.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    radical: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    pinyin: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    meaning: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    englishMeaning: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    profoundMeaning: {
      type: dataTypes.TEXT,
      allowNull: true,
    },
    example: {
      type: dataTypes.TEXT,
      allowNull: true,
    },
    stroke: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Radical',
  });

  return Radical;
};
