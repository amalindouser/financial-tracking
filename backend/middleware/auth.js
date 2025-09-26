import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  // Ambil token dari header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verifikasi token
    const secret = process.env.JWT_SECRET || "secret123"; // pakai env variable lebih aman
    const decoded = jwt.verify(token, secret);

    // Simpan data user ke request (opsional)
    req.user = decoded;

    next(); // lanjut ke handler berikutnya
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
}
