import { QR, Client, Category, Product } from "../models/index.js";
import { generateQRCode } from "../utils/qrGenerator.js";
import jwt from "jsonwebtoken";

export const createQR = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado." });
    }

    const secret = process.env.JWT_SECRET || "secret_dev";
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id; // ID del usuario autenticado

    const { razonSocial, cuil, categoryId, fileUrl, numeroExpediente } =
      req.body;

    // Verificar si el cliente ya existe para el usuario autenticado
    let client = await Client.findOne({
      where: { razonSocial, cuil, userId },
    });

    // Si el cliente no existe, crearlo
    if (!client) {
      client = await Client.create({ razonSocial, cuil, userId });
    }

    // Verificar si la categoría existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    // Generar el QR
    const qrData = {
      clientId: client.id,
      categoryId,
      fileUrl,
      numeroExpediente,
      estado: "Activo",
    };

    const qrImageUrl = await generateQRCode(qrData);
    const newQR = await QR.create({ ...qrData, qrImageUrl });

    res.status(201).json({
      message: "QR generado exitosamente.",
      qr: newQR,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando el QR" });
  }
};

export const getQRs = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado." });
    }

    const secret = process.env.JWT_SECRET || "secret_dev";
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id; // ID del usuario autenticado

    const qrs = await QR.findAll({
      include: [
        {
          model: Client,
          where: { userId },
        },
        Category,
        Product,
      ],
      order: [["fechaGeneracion", "DESC"]],
    });

    res.json(qrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
