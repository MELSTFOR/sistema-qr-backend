import express from "express";
import clientRoutes from "./clientRoutes.js";
import qrRoutes from "./qrRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import userRoutes from "./routes/usersRoutes.js";

const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/qrs", qrRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/users", userRoutes);

export default router;
