import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requerido" });

  const secret = process.env.JWT_SECRET || "secret_dev";
  jwt.verify(token, secret, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = payload; // id, email, role
    next();
  });
}