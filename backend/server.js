import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import { User, Client, Category, QR, Product } from "./models/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch((err) => console.error("❌ Error al sincronizar:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
