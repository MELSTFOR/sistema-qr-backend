// models/Client.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Client = sequelize.define("Client", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  razonSocial: { type: DataTypes.STRING, allowNull: false },
  cuil: { type: DataTypes.STRING, allowNull: false },
  userId: {
    // Relación con el usuario
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Nombre del modelo relacionado
      key: "id", // Llave primaria del modelo User
    },
    onDelete: "CASCADE", // Elimina los clientes si el usuario es eliminado
  },
});

export default Client;
