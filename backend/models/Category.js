// models/Category.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define("Category", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: DataTypes.ENUM(
      "Enargas",
      "Autopartes",
      "Seguridad Eléctrica",
      "Juguetes",
      "Materiales de construcción",
      "Elementos de protección personal"
    ),
    allowNull: false,
  },
});

export default Category;
