'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vocabularies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       this.belongsTo(models.Lessons, {
        foreignKey: 'lessonId',
        as: 'lesson' 
      });
    }
  }
  Vocabularies.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vocabulary: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    meaning: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pinyin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    audioUrl: {
      type: DataTypes.TEXT
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lessons',
        key: 'id'
      },
    }
  }, {
    sequelize,
    modelName: 'Vocabularies',
  });
  return Vocabularies;
};