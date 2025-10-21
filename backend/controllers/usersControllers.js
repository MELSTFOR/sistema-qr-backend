import express from "express";
import User from "../models/User.js";

const router = express.Router();

export async function createUsers(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const newUser = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: newUser,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El email ya está registrado." });
    }
    res
      .status(500)
      .json({ message: "Error al crear el usuario.", error: error.message });
  }
}

export default createUsers;
