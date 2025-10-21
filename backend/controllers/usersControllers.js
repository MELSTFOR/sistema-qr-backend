import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post("/create", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    // Crear el usuario en la base de datos
    const newUser = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: newUser,
    });
  } catch (error) {
    // Manejo de errores (por ejemplo, email duplicado)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El email ya está registrado." });
    }
    res
      .status(500)
      .json({ message: "Error al crear el usuario.", error: error.message });
  }
});

export default router;
