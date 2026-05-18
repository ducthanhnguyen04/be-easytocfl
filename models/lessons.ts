'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface LessonAttributes {
  id: number;
  lessonName: string;
  title: string;
  isPremium?: boolean;
  slug: string;
  levelId: number;
}

interface LessonCreationAttributes extends Optional<LessonAttributes, 'id' | 'isPremium'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Lessons extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
    declare id: number;
    declare lessonName: string;
    declare title: string;
    declare isPremium?: boolean;
    declare slug: string;
    declare levelId: number;

    static associate(models: any) {
      this.belongsTo(models.Levels, {
        foreignKey: 'levelId',
        as: 'level',
      });
    }
  }

  Lessons.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lessonName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    isPremium: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    slug: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    levelId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'levels',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Lessons',
  });

  return Lessons;
};