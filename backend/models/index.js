// models/index.js
import User from "./User.js";
import Client from "./Client.js";
import Category from "./Category.js";
import QR from "./QR.js";
import Product from "./Product.js";

// Relación: Un usuario tiene muchos clientes
User.hasMany(Client, { foreignKey: "userId", onDelete: "CASCADE" });
Client.belongsTo(User, { foreignKey: "userId" });

// Relación: Un cliente tiene muchos QRs
Client.hasMany(QR, { foreignKey: "clientId", onDelete: "CASCADE" });
QR.belongsTo(Client, { foreignKey: "clientId" });

// Relación: Una categoría tiene muchos QRs (categorías son comunes para todos los usuarios)
Category.hasMany(QR, { foreignKey: "categoryId", onDelete: "CASCADE" });
QR.belongsTo(Category, { foreignKey: "categoryId" });

// Relación: Un QR tiene un solo producto
QR.hasOne(Product, { foreignKey: "qrId", onDelete: "CASCADE" });
Product.belongsTo(QR, { foreignKey: "qrId" });

export { User, Client, Category, QR, Product };
