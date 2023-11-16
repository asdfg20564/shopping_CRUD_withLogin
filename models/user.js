"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
require("dotenv").config();
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
  User.init(
    {
      userId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            args: true,
            msg: "올바른 이메일 주소 형식이 아닙니다.",
          },
        },
      },
      nickname: DataTypes.STRING,
      passwd: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate(async (user) => {
    //salt will be generated with the specified number of rounds and used.
    const hashedPasswd = await bcrypt.hash(
      user.passwd,
      process.env.SALT_ROUND_KEY
    );
    user.passwd = hashedPasswd;
  });
  return User;
};
