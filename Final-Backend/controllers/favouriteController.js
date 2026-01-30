// controllers/favouriteController.js

const db = require("../config/db");

// ADD TO FAVOURITES
exports.addFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.body;

    await db.query(
      "INSERT IGNORE INTO favourites (user_id, listing_id) VALUES (?, ?)",
      [userId, listingId],
    );

    res.json({ message: "Added to favourites" });
  } catch (err) {
    console.error("Add favourite error:", err);
    res.status(500).json({ message: "Failed to add favourite" });
  }
};

// REMOVE FROM FAVOURITES
exports.removeFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;

    await db.query(
      "DELETE FROM favourites WHERE user_id = ? AND listing_id = ?",
      [userId, listingId],
    );

    res.json({ message: "Removed from favourites" });
  } catch (err) {
    console.error("Remove favourite error:", err);
    res.status(500).json({ message: "Failed to remove favourite" });
  }
};

// GET MY FAVOURITES
exports.getMyFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT l.*, 
      (SELECT image_path FROM listing_images WHERE listing_id = l.id LIMIT 1) AS image
      FROM favourites f
      JOIN listings l ON f.listing_id = l.id
      WHERE f.user_id = ?
    `,
      [userId],
    );

    res.json(rows);
  } catch (err) {
    console.error("Get favourites error:", err);
    res.status(500).json({ message: "Failed to fetch favourites" });
  }
};
