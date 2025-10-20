import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Conectar a la base de datos
try {
  await sequelize.authenticate();
  console.log("✅ Conexión exitosa con la base de datos");
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
} catch (error) {
  console.error("❌ Error al conectar con la base de datos:", error);
}
