import express from "express";
import { createQR, getQRs } from "../controllers/qrController.js";
const router = express.Router();

router.post("/", createQR);
router.get("/", getQRs);

export default router;
