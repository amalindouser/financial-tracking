// server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/auth.js";
import dotenv from "dotenv";

// Untuk dapat __dirname di ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ================= DATABASE SETUP =================
const db = new sqlite3.Database(
  path.resolve(__dirname, "database.sqlite"),
  (err) => {
    if (err) return console.error(err.message);
    console.log("✅ Connected to SQLite database.");
  }
);

// ================= TABLE SAVINGS =================
db.run(`
  CREATE TABLE IF NOT EXISTS savings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL
  )
`);

// Pastikan ada 1 data default
db.get("SELECT * FROM savings LIMIT 1", (err, row) => {
  if (err) console.error(err.message);
  if (!row) {
    db.run("INSERT INTO savings (amount) VALUES (0)", function (err) {
      if (err) console.error("Gagal buat data default savings:", err.message);
      else console.log("Data default savings dibuat (id:", this.lastID, ")");
    });
  }
});

// Ambil savings
app.get("/api/savings", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" }); // ✅ JSON, bukan string
  }

  res.json({ amount: 1000000 });
});


// Update savings
app.put("/api/savings", (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== "number") {
    return res.status(400).json({ error: "amount harus number" });
  }

  db.get("SELECT id FROM savings LIMIT 1", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) {
      db.run("INSERT INTO savings (amount) VALUES (?)", [amount], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ created: true, id: this.lastID, amount });
      });
    } else {
      db.run(
        "UPDATE savings SET amount = ? WHERE id = ?",
        [amount, row.id],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ updated: this.changes > 0, id: row.id, amount });
        }
      );
    }
  });
});

// ================= TABLE RECORDS =================
db.run(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keperluan TEXT,
    jenis TEXT,
    keterangan TEXT,
    jumlah REAL,
    date TEXT
  )
`);

// Ambil semua records
app.get("/api/records", (req, res) => {
  db.all("SELECT * FROM records", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Tambah record baru
app.post("/api/records", (req, res) => {
  const { keperluan, jenis, keterangan, jumlah, date } = req.body;
  const query = `INSERT INTO records (keperluan, jenis, keterangan, jumlah, date) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [keperluan, jenis, keterangan, jumlah, date], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    db.get("SELECT * FROM records WHERE id = ?", [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

// Update record
app.put("/api/records/:id", (req, res) => {
  const { id } = req.params;
  const { keperluan, jenis, keterangan, jumlah, date } = req.body;

  db.run(
    "UPDATE records SET keperluan=?, jenis=?, keterangan=?, jumlah=?, date=? WHERE id=?",
    [keperluan, jenis, keterangan, jumlah, date, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes > 0 });
    }
  );
});

// Hapus record
// Hapus record (pakai middleware)
app.delete("/api/records/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM records WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});


// ================= AUTH LOGIN =================

// Dummy user (password: 123456)
const users = [
  {
    id: 1,
    username: "viki",
    passwordHash: bcrypt.hashSync("123456", 10), // Simpan hash, bukan password asli
  },
];

//endpoint register (tidak dipakai di frontend)
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = { username, passwordHash };
  users.push(newUser);

  res.json({ message: "User registered" });
});


// Endpoint login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ username: user.username }, "secretkey", {
    expiresIn: "1h",
  });

  res.json({ message: "Login success", token });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
