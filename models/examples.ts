'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface ExampleAttributes {
  id: number;
  example: string;
  meaning: string;
  pinyin: string;
  audioUrl?: string;
  vocabularyId?: number;
  grammarId?: number;
}

interface ExampleCreationAttributes extends Optional<ExampleAttributes, 'id' | 'audioUrl' | 'vocabularyId' | 'grammarId'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Examples extends Model<ExampleAttributes, ExampleCreationAttributes> implements ExampleAttributes {
    declare id: number;
    declare example: string;
    declare meaning: string;
    declare pinyin: string;
    declare audioUrl?: string;
    declare vocabularyId?: number;
    declare grammarId?: number;

    static associate(models: any) {
      this.belongsTo(models.Vocabularies, {
        foreignKey: 'vocabularyId',
        as: 'vocabulary',
      });
      this.belongsTo(models.Grammars, {
        foreignKey: 'grammarId',
        as: 'grammar',
      });
    }
  }

  Examples.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    example: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    meaning: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    pinyin: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    audioUrl: {
      type: dataTypes.TEXT,
    },
    vocabularyId: {
      type: dataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vocabularies',
        key: 'id',
      },
    },
    grammarId: {
      type: dataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Grammars',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Examples',
  });

  return Examples;
};