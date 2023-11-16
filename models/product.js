"use strict";
const { Model } = require("sequelize");
const { User } = require("./user.js");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, {
        foreignKey: "author",
      });
    }
  }
  Product.init(
    {
      productId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING,
      author: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: "userId",
        },
      },
      content: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("FOR_SALE", "SOLD_OUT"),
        defaultValue: "FOR_SALE",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
