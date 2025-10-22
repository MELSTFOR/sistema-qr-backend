import express from "express";
import { createUsers, getUsers, getUserById } from "../controllers/usersControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createUsers);
router.get("/", authenticateToken, getUsers);         // listar todos (protegido)
router.get("/me", authenticateToken, (req, res) => { // mantiene /me
  res.json({ user: req.user });
});
router.get("/:id", authenticateToken, getUserById);  // obtener por id (protegido)

export default router;
