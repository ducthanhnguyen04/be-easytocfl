'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface WritingSheetsAttributes {
  id: number;
  title: string;
  userId?: number;
}

interface WritingSheetsCreationAttributes extends Optional<WritingSheetsAttributes, 'id' | 'userId'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class WritingSheets extends Model<WritingSheetsAttributes, WritingSheetsCreationAttributes> implements WritingSheetsAttributes {
    declare id: number;
    declare title: string;
    declare userId?: number;

    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      this.hasMany(models.WritingSheetItem, {
        foreignKey: 'writingSheetId',
        as: 'items',
      });
    }
  }

  WritingSheets.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: dataTypes.STRING,
      allowNull: false,
      defaultValue: 'File luyện viết từ vựng',
    },
    userId: {
      type: dataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'WritingSheets',
    tableName: 'WritingSheets',
  });

  return WritingSheets;
};
