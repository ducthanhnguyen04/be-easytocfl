'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface DialogueAttributes {
  id: number;
  lessonId: number;
  header?: string;
  illustrationUrl?: string;
}

interface DialogueCreationAttributes extends Optional<DialogueAttributes, 'id' | 'header' | 'illustrationUrl'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Dialogues extends Model<DialogueAttributes, DialogueCreationAttributes> implements DialogueAttributes {
    declare id: number;
    declare lessonId: number;
    declare header?: string;
    declare illustrationUrl?: string;

    static associate(models: any) {
      this.belongsTo(models.Lessons, {
        foreignKey: 'lessonId',
        as: 'lesson',
      });
      this.hasMany(models.DialogueLines, {
        foreignKey: 'dialogueId',
        as: 'lines',
      });
    }
  }

  Dialogues.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lessonId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Lessons',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    header: {
      type: dataTypes.STRING,
      allowNull: true,
    },
    illustrationUrl: {
      type: dataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Dialogues',
  });

  return Dialogues;
};
