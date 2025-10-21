import { Category } from "../models/index.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createCategories = async (req, res) => {
  try {
    const { name } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!name) {
      return res
        .status(400)
        .json({ message: "El campo 'name' es obligatorio." });
    }

    // Crear la categoría en la base de datos
    const newCategory = await Category.create({ name });

    res.status(201).json({
      message: "Categoría creada exitosamente.",
      category: newCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la categoría.", error: error.message });
  }
};
