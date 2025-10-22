// models/QR.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Client from "./Client.js";
import Category from "./Category.js";

const QR = sequelize.define("QR", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fileUrl: { // Ruta al PDF o imagen del QR
    type: DataTypes.TEXT, // <-- cambiado a TEXT
    allowNull: true,
  },
  qrImageUrl: { // Imagen generada del código QR
    type: DataTypes.TEXT, // <-- cambiado a TEXT
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM("Activo", "Suspendido"),
    defaultValue: "Activo",
  },
  fechaGeneracion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  numeroExpediente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipoCarga: {
    type: DataTypes.ENUM("individual", "familia", "pdf"),
    allowNull: false,
    defaultValue: "individual"
  },
});

QR.belongsTo(Client, { foreignKey: "clientId", onDelete: "CASCADE" });
QR.belongsTo(Category, { foreignKey: "categoryId", onDelete: "CASCADE" });

export default QR;
