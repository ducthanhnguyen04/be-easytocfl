'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface GrammarAttributes {
  id: number;
  grammar: string;
  structure: string;
  usage: string;
  note?: string;
  lessonId: number;
}

interface GrammarCreationAttributes extends Optional<GrammarAttributes, 'id' | 'note'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Grammars extends Model<GrammarAttributes, GrammarCreationAttributes> implements GrammarAttributes {
    declare id: number;
    declare grammar: string;
    declare structure: string;
    declare usage: string;
    declare note?: string;
    declare lessonId: number;

    static associate(models: any) {
      this.belongsTo(models.Lessons, {
        foreignKey: 'lessonId',
        as: 'lesson',
      });
    }
  }

  Grammars.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    grammar: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    structure: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    usage: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    note: {
      type: dataTypes.TEXT,
    },
    lessonId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lessons',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Grammars',
  });

  return Grammars;
};