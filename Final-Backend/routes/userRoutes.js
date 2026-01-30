const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET USER BY ID (PUBLIC – FOR SELLER PROFILE PAGE)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [[user]] = await db.query(
      "SELECT id, first_name, last_name, email, avatar, created_at FROM users WHERE id = ?",
      [id],
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

module.exports = router;
