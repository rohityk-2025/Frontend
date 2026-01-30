// controllers/listingController.js

const db = require("../config/db");
const notificationController = require("./notificationController");

// CREATE LISTING (POST /api/listings)
exports.createListing = async (req, res) => {
  try {
    const { title, price, category, subcategory, location, year, description } =
      req.body;

    const sellerId = req.user.id; // from authMiddleware

    // Save images paths
    const images = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const [result] = await db.query(
      `INSERT INTO listings 
      (title, price, category, subcategory, location, year, description, seller_id, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        title,
        price,
        category,
        subcategory,
        location,
        year,
        description,
        sellerId,
      ],
    );

    const listingId = result.insertId;

    // Save images
    for (let img of images) {
      await db.query(
        "INSERT INTO listing_images (listing_id, image_path) VALUES (?, ?)",
        [listingId, img],
      );
    }

    // Create notification for product added
    await notificationController.createNotification(
      sellerId,
      "product_added",
      "Product Added Successfully",
      `Your product "${title}" has been submitted. It's waiting for admin approval.`,
      listingId,
    );

    res.json({ message: "Listing created successfully", id: listingId });
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ message: "Failed to create listing" });
  }
};

// GET ALL LISTINGS (HOME PAGE) - ONLY APPROVED
exports.getAllListings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, 
      (SELECT image_path FROM listing_images WHERE listing_id = l.id LIMIT 1) AS image
      FROM listings l
      WHERE l.status = 'approved'
      ORDER BY l.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Get listings error:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// GET SINGLE LISTING (PRODUCT DETAIL)
exports.getSingleListing = async (req, res) => {
  try {
    const { id } = req.params;

    const [[listing]] = await db.query(
      `SELECT l.*, u.first_name, u.avatar 
       FROM listings l 
       JOIN users u ON l.seller_id = u.id
       WHERE l.id = ?`,
      [id],
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const [images] = await db.query(
      "SELECT image_path FROM listing_images WHERE listing_id = ?",
      [id],
    );

    listing.images = images.map((img) => img.image_path);
    listing.seller = {
      id: listing.seller_id,
      name: listing.first_name,
      avatar: listing.avatar,
    };

    res.json(listing);
  } catch (err) {
    console.error("Get single listing error:", err);
    res.status(500).json({ message: "Failed to fetch listing" });
  }
};

// GET USER LISTINGS (PROFILE PAGE)
exports.getMyListings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT l.*, 
      (SELECT image_path FROM listing_images WHERE listing_id = l.id LIMIT 1) AS image
      FROM listings l 
      WHERE seller_id = ?
      ORDER BY l.created_at DESC`,
      [userId],
    );

    res.json(rows);
  } catch (err) {
    console.error("My listings error:", err);
    res.status(500).json({ message: "Failed to fetch your listings" });
  }
};

// DELETE MY LISTING (PROFILE DELETE BUTTON)
exports.deleteListing = async (req, res) => {
  try {
    const userId = req.user.id; // logged in user
    const listingId = req.params.id; // listing to delete

    // CHECK OWNERSHIP FIRST (VERY IMPORTANT SECURITY)
    const [[listing]] = await db.query(
      "SELECT * FROM listings WHERE id = ? AND seller_id = ?",
      [listingId, userId],
    );

    if (!listing) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this listing" });
    }

    // DELETE IMAGES FIRST
    await db.query("DELETE FROM listing_images WHERE listing_id = ?", [
      listingId,
    ]);

    // DELETE LISTING
    await db.query("DELETE FROM listings WHERE id = ?", [listingId]);

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete listing error:", err);
    res.status(500).json({ message: "Failed to delete listing" });
  }
};

// UPDATE MY LISTING (EDIT PAGE)
exports.updateListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const listingId = req.params.id;

    console.log("UPDATE USER:", userId);
    console.log("UPDATE LISTING ID:", listingId);
    console.log("UPDATE BODY:", req.body);

    const { title, price, category, subcategory, location, year, description } =
      req.body;

    // CHECK OWNERSHIP
    const [[listing]] = await db.query(
      "SELECT * FROM listings WHERE id = ? AND seller_id = ?",
      [listingId, userId],
    );

    console.log("OWNERSHIP CHECK RESULT:", listing);

    if (!listing) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this listing" });
    }

    // UPDATE LISTING
    await db.query(
      `UPDATE listings 
       SET title=?, price=?, category=?, subcategory=?, location=?, year=?, description=? 
       WHERE id=?`,
      [
        title,
        price,
        category,
        subcategory,
        location,
        year,
        description,
        listingId,
      ],
    );

    res.json({ message: "Listing updated successfully" });
  } catch (err) {
    console.error("Update listing error FULL:", err);
    res.status(500).json({ message: "Failed to update listing" });
  }
};

exports.getUserListingsById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        l.id,
        l.title,
        l.price,
        l.category,
        l.subcategory,
        l.location,
        l.year,
        l.description,
        l.seller_id,
        l.created_at,

        -- TAKE FIRST IMAGE OF EACH LISTING
        MIN(li.image_path) AS image

      FROM listings l
      LEFT JOIN listing_images li ON l.id = li.listing_id
      WHERE l.seller_id = ?
      GROUP BY l.id
      ORDER BY l.created_at DESC
    `,
      [id],
    );

    res.json(rows);
  } catch (err) {
    console.error("SELLER LISTINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch seller listings" });
  }
};
