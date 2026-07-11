'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface DialogueLineAttributes {
  id: number;
  dialogueId: number;
  lineOrder: number;
  character: string;
  text: string;
  pinyin?: string;
  translation?: string;
  audioUrl?: string;
}

interface DialogueLineCreationAttributes extends Optional<DialogueLineAttributes, 'id' | 'pinyin' | 'translation' | 'audioUrl'> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class DialogueLines extends Model<DialogueLineAttributes, DialogueLineCreationAttributes> implements DialogueLineAttributes {
    declare id: number;
    declare dialogueId: number;
    declare lineOrder: number;
    declare character: string;
    declare text: string;
    declare pinyin?: string;
    declare translation?: string;
    declare audioUrl?: string;

    static associate(models: any) {
      this.belongsTo(models.Dialogues, {
        foreignKey: 'dialogueId',
        as: 'dialogue',
      });
    }
  }

  DialogueLines.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dialogueId: {
      type: dataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Dialogues',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    lineOrder: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    character: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    pinyin: {
      type: dataTypes.TEXT,
      allowNull: true,
    },
    translation: {
      type: dataTypes.TEXT,
      allowNull: true,
    },
    audioUrl: {
      type: dataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'DialogueLines',
  });

  return DialogueLines;
};
