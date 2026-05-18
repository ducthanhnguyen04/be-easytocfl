'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  userName: string;
  email: string;
  password: string;
  googleId?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  tokenVersion?: string;
  isPremium?: boolean;
  lastLogin?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'googleId' | 'avatarUrl' | 'tokenVersion' | 'isPremium' | 'lastLogin'> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare userName: string;
    declare email: string;
    declare password: string;
    declare googleId?: string;
    declare avatarUrl?: string;
    declare role: 'user' | 'admin';
    declare tokenVersion?: string;
    declare isPremium?: boolean;
    declare lastLogin?: Date;

    static associate(models: any) {
      // define association here
    }
  }

  User.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: dataTypes.STRING,
    email: {
      type: dataTypes.STRING,
      unique: true,
    },
    password: dataTypes.STRING,
    googleId: {
      type: dataTypes.STRING,
      unique: true,
    },
    avatarUrl: dataTypes.TEXT,
    role: dataTypes.ENUM('user', 'admin'),
    tokenVersion: {
      type: dataTypes.STRING,
      defaultValue: '',
    },
    isPremium: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLogin: dataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};