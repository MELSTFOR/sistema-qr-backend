import { QR, Client, Category, Product } from "../models/index.js";
import { generateQRCode } from "../utils/qrGenerator.js";

export const createQR = async (req, res) => {
  try {
    const {
      clientId,
      categoryId,
      tipoCarga, // 'pdf', 'individual', 'familia'
      fileUrl,
      numeroExpediente,
      products, // si hay productos
    } = req.body;

    let qrRecords = [];

    if (tipoCarga === "familia" && products?.length > 0) {
      // Genera múltiples QRs (uno por producto)
      for (const product of products) {
        const qrData = {
          clientId,
          categoryId,
          tipoCarga,
          numeroExpediente,
          estado: "Activo",
        };

        const qrImageUrl = await generateQRCode(qrData);
        const newQR = await QR.create({ ...qrData, qrImageUrl });
        await Product.create({ ...product, qrId: newQR.id });
        qrRecords.push(newQR);
      }
      return res.status(201).json(qrRecords);
    }

    // Si es PDF o carga individual
    const qrData = {
      clientId,
      categoryId,
      tipoCarga,
      fileUrl,
      numeroExpediente,
      estado: "Activo",
    };

    const qrImageUrl = await generateQRCode(qrData);
    const newQR = await QR.create({ ...qrData, qrImageUrl });

    // Si hay datos de producto, los asocia
    if (tipoCarga === "individual" && req.body.product) {
      await Product.create({ ...req.body.product, qrId: newQR.id });
    }

    res.status(201).json(newQR);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando el QR" });
  }
};

export const getQRs = async (req, res) => {
  try {
    const qrs = await QR.findAll({
      include: [Client, Category, Product],
      order: [["fechaGeneracion", "DESC"]],
    });
    res.json(qrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
