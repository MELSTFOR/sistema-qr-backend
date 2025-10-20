// models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import QR from "./QR.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  resolucion: { type: DataTypes.STRING, allowNull: false },
  marca: { type: DataTypes.STRING, allowNull: false },
  modelo: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: false },
});

Product.belongsTo(QR, { foreignKey: "qrId", onDelete: "CASCADE" });

export default Product;
