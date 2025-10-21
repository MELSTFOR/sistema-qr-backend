import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    // En producción compara hashes (bcrypt). Aquí comparación simple por compatibilidad.
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const secret = process.env.JWT_SECRET || "secret_dev";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export { login };
