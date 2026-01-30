// controllers/authController.js

const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body); // DEBUG
    console.log("REGISTER FILE:", req.file); // DEBUG

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const icon = req.body.icon;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // CHECK IF USER EXISTS
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // PRIORITY: FILE > ICON
    let avatarPath = null;

    if (req.file) {
      avatarPath = `/uploads/${req.file.filename}`;
    } else if (icon) {
      avatarPath = icon;
    }

    // ROLE WILL BE DEFAULT 'user' (FROM DB DEFAULT)
    await db.query(
      "INSERT INTO users (first_name, last_name, email, password, avatar, role) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, avatarPath, "user"],
    );

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("Register error FULL:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN USER (FIXED VERSION + ADMIN ROLE SUPPORT)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // CREATE JWT TOKEN WITH ROLE INCLUDED (ADMIN SUPPORT)
    const token = jwt.sign(
      { id: user.id, role: user.role }, // ADD ROLE HERE
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" },
    );

    // SEND TOKEN + CLEAN USER OBJECT (NOW WITH ROLE)
    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
        role: user.role, // SEND ROLE TO FRONTEND
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= UPDATE PROFILE ================= */

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { first_name, email, password } = req.body;

    let query = "UPDATE users SET first_name = ?, email = ?";
    let params = [first_name, email];

    // UPDATE PASSWORD ONLY IF PROVIDED
    if (password) {
      const bcrypt = require("bcryptjs");
      const hashed = await bcrypt.hash(password, 10);

      query += ", password = ?";
      params.push(hashed);
    }

    query += " WHERE id = ?";
    params.push(userId);

    const db = require("../config/db");
    await db.query(query, params);

    // RETURN UPDATED USER DATA
    res.json({
      first_name,
      email,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
