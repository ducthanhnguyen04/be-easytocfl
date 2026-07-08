'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface MyVocabularyAttributes {
  id: number;
  name: string;
  userId: number;
}

interface MyVocabularyCreationAttributes extends Optional<MyVocabularyAttributes, 'id'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class MyVocabularies extends Model<MyVocabularyAttributes, MyVocabularyCreationAttributes> implements MyVocabularyAttributes {
    declare id: number;
    declare name: string;
    declare userId: number;

    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      this.hasMany(models.MyVocabulary, {
        foreignKey: 'myVocabulairesId',
        as: 'vocabularies',
      });
    }
  }

  MyVocabularies.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'MyVocabularies',
  });

  return MyVocabularies;
};
