'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface WritingSheetItemAttributes {
  id: number;
  vocab: string;
  pinyin: string;
  meaning: string;
  writingSheetId: number;
}

interface WritingSheetItemCreationAttributes extends Optional<WritingSheetItemAttributes, 'id'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class WritingSheetItem extends Model<WritingSheetItemAttributes, WritingSheetItemCreationAttributes> implements WritingSheetItemAttributes {
    declare id: number;
    declare vocab: string;
    declare pinyin: string;
    declare meaning: string;
    declare writingSheetId: number;

    static associate(models: any) {
      this.belongsTo(models.WritingSheets, {
        foreignKey: 'writingSheetId',
        as: 'writingSheet',
      });
    }
  }

  WritingSheetItem.init({
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
    writingSheetId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'WritingSheets',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'WritingSheetItem',
    tableName: 'WritingSheetItems',
  });

  return WritingSheetItem;
};
