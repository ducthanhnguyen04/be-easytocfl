'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface ExcersiseAttributes {
  id: number;
  title: string;
  meaning: string;
  englishMeaning: string;
  grammarId: number;
}

interface ExcersiseCreationAttributes extends Optional<ExcersiseAttributes, 'id'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Excersises extends Model<ExcersiseAttributes, ExcersiseCreationAttributes> implements ExcersiseAttributes {
    declare id: number;
    declare title: string;
    declare meaning: string;
    declare englishMeaning: string;
    declare grammarId: number;

    static associate(models: any) {
      this.belongsTo(models.Grammars, {
        foreignKey: 'grammarId',
        as: 'grammar',
      });
    }
  }

  Excersises.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    meaning: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    englishMeaning: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    grammarId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Grammars',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Excersises',
  });

  return Excersises;
};
