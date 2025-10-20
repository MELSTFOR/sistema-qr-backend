// models/index.js
import User from "./User.js";
import Client from "./Client.js";
import Category from "./Category.js";
import QR from "./QR.js";
import Product from "./Product.js";

Client.hasMany(QR, { foreignKey: "clientId" });
Category.hasMany(QR, { foreignKey: "categoryId" });
QR.hasMany(Product, { foreignKey: "qrId" });

export { User, Client, Category, QR, Product };
