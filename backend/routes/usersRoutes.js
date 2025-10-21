import express from "express";
import { createUsers } from "../controllers/usersControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createUsers);
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
