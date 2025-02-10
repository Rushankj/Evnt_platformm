const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const DB_FILE = path.join("D:/Java script/Event Platform/Database/events.db");

// ✅ Database setup
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log(`✅ Connected to SQLite database: ${DB_FILE}`);
  }
});

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend"))); // ✅ Serve frontend files

// ✅ Serve `login.html` first
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/login.html"));
});

// ✅ Protect dashboard - Redirect to login if not authenticated
app.get("/dashboard.html", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

  if (!token) {
    return res.redirect("/"); // Redirect to login if no token
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/"); // Redirect to login if token is invalid
    }
    res.sendFile(path.join(__dirname, "../Frontend/dashboard.html"));
  });
});

// ✅ Authentication Routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      console.error("❌ Database error on login:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, redirectTo: "/dashboard.html" });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
