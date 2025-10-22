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

export async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"],
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios.", error: error.message });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario.", error: error.message });
  }
}

export default createUsers;
