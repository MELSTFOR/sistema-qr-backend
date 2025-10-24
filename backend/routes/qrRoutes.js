import express from "express";
import { createQR, getQRs, createQRsFromExcel } from "../controllers/qrController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.post("/", authenticateToken, createQR);
router.get("/", authenticateToken, getQRs);
router.post("/batch", authenticateToken, upload.single("file"), createQRsFromExcel);

export default router;
