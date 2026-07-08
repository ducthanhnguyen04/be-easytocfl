'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface MyVocabularyAttributes {
  id: number;
  vocab: string;
  pinyin: string;
  meaning: string;
  myVocabulairesId: number;
  example?: string;
  exampleMeaning?: string;
}

interface MyVocabularyCreationAttributes extends Optional<MyVocabularyAttributes, 'id' | 'example' | 'exampleMeaning'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class MyVocabulary extends Model<MyVocabularyAttributes, MyVocabularyCreationAttributes> implements MyVocabularyAttributes {
    declare id: number;
    declare vocab: string;
    declare pinyin: string;
    declare meaning: string;
    declare myVocabulairesId: number;
    declare example?: string;
    declare exampleMeaning?: string;

    static associate(models: any) {
      this.belongsTo(models.MyVocabularies, {
        foreignKey: 'myVocabulairesId',
        as: 'myVocabulariesList',
      });
    }
  }

  MyVocabulary.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vocab: {
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
    myVocabulairesId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MyVocabularies',
        key: 'id',
      },
    },
    example: {
      type: dataTypes.TEXT,
      allowNull: true,
    },
    exampleMeaning: {
      type: dataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'MyVocabulary',
    tableName: 'MyVocabulary',
  });

  return MyVocabulary;
};
