import { QR, Client, Category, Product } from "../models/index.js";
import { generateQRCode } from "../utils/qrGenerator.js";
import jwt from "jsonwebtoken";
import XLSX from "xlsx";

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

    // Verificar si ya existe un QR con los mismos datos
    const existingQR = await QR.findOne({
      where: {
        clientId: client.id,
        categoryId,
        fileUrl,
        numeroExpediente,
      },
    });

    if (existingQR) {
      return res.status(409).json({
        message: "Ya existe un QR generado con estos datos.",
        qr: existingQR,
      });
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

export const createQRsFromExcel = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token no proporcionado." });

    const secret = process.env.JWT_SECRET || "secret_dev";
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id;

    if (!req.file)
      return res
        .status(400)
        .json({ message: "Archivo no provisto. Envia campo 'file'." });

    // Opcional: categoryId puede venir en body (text) si quieres asignar la misma categoría a todos
    const { categoryId: categoryIdFromBody } = req.body;

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const results = { created: 0, failed: [] };
    const createdQRs = []; // <-- acumula los QR creados

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i];

      // Mapeo flexible de columnas (encabezados del excel mostrados)
      const razonSocial = (
        raw["RAZON SOCIAL"] ||
        raw["razonSocial"] ||
        raw["razon social"] ||
        raw["Razon Social"] ||
        ""
      )
        .toString()
        .trim();
      const cuil = (raw["CUIT"] || raw["cuit"] || "").toString().trim();
      const tipo = (
        raw["TIPO"] ||
        raw["tipo"] ||
        raw["IDENTIFICACION DEL PRODUCTO"] ||
        raw["Identificacion del producto"] ||
        ""
      )
        .toString()
        .trim();
      const marca = (raw["MARCA"] || raw["marca"] || "").toString().trim();
      const modelo = (raw["MODELO"] || raw["modelo"] || "").toString().trim();
      const sku = (raw["SKU"] || raw["sku"] || "").toString().trim();
      const origen = (raw["ORIGEN"] || raw["origen"] || "").toString().trim();
      const numeroCertificado = (
        raw["N° CERTIFICADO"] ||
        raw["N°_CERTIFICADO"] ||
        raw["N CERTIFICADO"] ||
        raw["numeroCertificado"] ||
        ""
      )
        .toString()
        .trim();
      const organismo = (raw["ORGANISMO"] || raw["organismo"] || "")
        .toString()
        .trim();
      const resolucion = (
        raw["RESOLUCION"] ||
        raw["RESOLUCIÓN"] ||
        raw["resolucion"] ||
        ""
      )
        .toString()
        .trim();

      // Validaciones mínimas
      if (!razonSocial || !cuil || (!sku && !tipo)) {
        results.failed.push({
          row: i + 2,
          error:
            "Faltan campos obligatorios: RAZON SOCIAL, CUIT, (SKU o TIPO).",
        });
        continue;
      }

      try {
        // buscar o crear client (se asocia al userId)
        const [client] = await Client.findOrCreate({
          where: { razonSocial, cuil, userId },
          defaults: { razonSocial, cuil, userId },
        });

        // buscar o crear product (usar sku si existe, sino usar tipo+marca)
        let productWhere = {};
        if (sku) productWhere = { sku };
        else productWhere = { nombre: tipo, marca };

        const [product] = await Product.findOrCreate({
          where: productWhere,
          defaults: {
            nombre: tipo || null,
            marca: marca || null,
            modelo: modelo || null,
            sku: sku || null,
            origen: origen || null,
            numeroCertificado: numeroCertificado || null,
            organismo: organismo || null,
            resolucion: resolucion || "N/A",
          },
        });

        // elegir categoryId: preferir el que venga en body, si no buscar por nombre en la planilla (columna CATEGORY) o dejar null -> error
        let categoryId =
          categoryIdFromBody ||
          raw["categoryId"] ||
          raw["CATEGORIA"] ||
          raw["Categoria"] ||
          null;
        if (categoryId) categoryId = Number(categoryId);

        if (!categoryId) {
          results.failed.push({
            row: i + 2,
            error:
              "Falta categoryId. Pasa categoryId en el body o añade columna categoryId en el excel.",
          });
          continue;
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
          results.failed.push({
            row: i + 2,
            error: `Categoría ${categoryId} no encontrada.`,
          });
          continue;
        }

        // preparar datos del QR (tipoCarga en este caso 'familia' porque proviene de una planilla de productos)
        const qrData = {
          clientId: client.id,
          categoryId,
          fileUrl: null,
          numeroExpediente: numeroCertificado || null,
          estado: "Activo",
          tipoCarga: "familia",
          productId: product.id, // si tu modelo QR tiene productId
        };

        const qrImageUrl = await generateQRCode({ ...qrData, product }); // adapter: tu util puede requerir distintos campos
        const newQR = await QR.create({ ...qrData, qrImageUrl });
        // almacena el QR creado + datos relevantes para la respuesta
        createdQRs.push({
          qr: newQR.toJSON(),
          qrData,
          client: { id: client.id, razonSocial, cuil },
          product: {
            id: product.id,
            nombre: product.nombre || tipo,
            sku: product.sku || sku,
            marca: product.marca || marca,
          },
        });

        results.created++;
      } catch (errRow) {
        results.failed.push({
          row: i + 2,
          error: errRow.message || String(errRow),
        });
      }
    }

    return res.status(201).json({
      message: "Procesamiento finalizado",
      results: {
        created: results.created,
        failed: results.failed,
        qrs: createdQRs,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
