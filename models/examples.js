'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Examples extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Vocabularies, {
        foreignKey: 'vocabularyId',
        as: 'vocabulary' 
      });
      this.belongsTo(models.Grammars, {
        foreignKey: 'grammarId',
        as: 'grammar' 
      });
    }
  }
  Examples.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, 
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    meaning: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pinyin: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    audioUrl: {
      type: DataTypes.TEXT
    },
    vocabularyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vocabularies',
        key: 'id'
      },
    },
    grammarId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Grammars',
        key: 'id'
      },
    }
  }, {
    sequelize,
    modelName: 'Examples',
  });
  return Examples;
};