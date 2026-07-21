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
  streakCount?: number;
  longestStreak?: number;
  lastStudyDate?: string;
  studyTimeToday?: number;
  lastHeartbeatDate?: string;
  score?: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'googleId' | 'avatarUrl' | 'tokenVersion' | 'isPremium' | 'lastLogin' | 'streakCount' | 'longestStreak' | 'lastStudyDate' | 'studyTimeToday' | 'lastHeartbeatDate' | 'score'> {}

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
    declare streakCount?: number;
    declare longestStreak?: number;
    declare lastStudyDate?: string;
    declare studyTimeToday?: number;
    declare lastHeartbeatDate?: string;
    declare score?: number;

    static associate(models: any) {
      // define association here
      this.hasMany(models.MyVocabularies, {
        foreignKey: 'userId',
        as: 'myVocabularies',
      });
      this.hasMany(models.WritingSheets, {
        foreignKey: 'userId',
        as: 'writingSheets',
      });
      this.hasMany(models.ScoreLogs, {
        foreignKey: 'userId',
        as: 'scoreLogs',
      });
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
    streakCount: {
      type: dataTypes.INTEGER,
      defaultValue: 0,
    },
    longestStreak: {
      type: dataTypes.INTEGER,
      defaultValue: 0,
    },
    lastStudyDate: {
      type: dataTypes.STRING,
      allowNull: true,
    },
    studyTimeToday: {
      type: dataTypes.INTEGER,
      defaultValue: 0,
    },
    lastHeartbeatDate: {
      type: dataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: dataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};