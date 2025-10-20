// models/Client.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Client = sequelize.define("Client", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  razonSocial: { type: DataTypes.STRING, allowNull: false },
  cuil: { type: DataTypes.STRING, allowNull: false },
});

export default Client;
