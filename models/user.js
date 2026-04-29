'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    googleId: {
      type: DataTypes.STRING,
      unique: true,
    },
    avatarUrl: DataTypes.TEXT,
    role: DataTypes.ENUM('user', 'admin'),
    lastLogin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};