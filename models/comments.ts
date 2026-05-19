'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface CommentAttributes {
  id: number;
  content: string;
  userId: number;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Comments extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    declare id: number;
    declare content: string;
    declare userId: number;

    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Comments.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: dataTypes.TEXT,
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
    modelName: 'Comments',
  });

  return Comments;
};
