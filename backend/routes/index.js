import express from "express";
import clientRoutes from "./clientRoutes.js";
import qrRoutes from "./qrRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";

const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/qrs", qrRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

export default router;
