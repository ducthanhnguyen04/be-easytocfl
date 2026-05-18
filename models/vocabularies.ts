'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface VocabularyAttributes {
  id: number;
  vocabulary: string;
  meaning: string;
  pinyin: string;
  audioUrl?: string;
  lessonId: number;
}

interface VocabularyCreationAttributes extends Optional<VocabularyAttributes, 'id' | 'audioUrl'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Vocabularies extends Model<VocabularyAttributes, VocabularyCreationAttributes> implements VocabularyAttributes {
    declare id: number;
    declare vocabulary: string;
    declare meaning: string;
    declare pinyin: string;
    declare audioUrl?: string;
    declare lessonId: number;

    static associate(models: any) {
      this.belongsTo(models.Lessons, {
        foreignKey: 'lessonId',
        as: 'lesson',
      });
    }
  }

  Vocabularies.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vocabulary: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    meaning: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    pinyin: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    audioUrl: {
      type: dataTypes.TEXT,
    },
    lessonId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lessons',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Vocabularies',
  });

  return Vocabularies;
};