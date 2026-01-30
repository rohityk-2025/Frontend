// const express = require("express");
// const router = express.Router();
// const listingController = require("../controllers/listingController");
// const auth = require("../middleware/authMiddleware");
// const upload = require("../utils/upload");

// // CREATE LISTING
// router.post(
//   "/",
//   auth,
//   upload.array("images", 12),
//   listingController.createListing,
// );

// // GET ALL LISTINGS
// router.get("/", listingController.getAllListings);

// // GET MY LISTINGS (PROFILE)
// router.get("/user/me", auth, listingController.getMyListings);

// // UPDATE LISTING (EDIT)  MUST COME BEFORE :id GET
// router.put("/:id", auth, listingController.updateListing);

// // DELETE LISTING
// router.delete("/:id", auth, listingController.deleteListing);

// // GET SINGLE LISTING (LAST ALWAYS)
// router.get("/:id", listingController.getSingleListing);

// module.exports = router;

const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const auth = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// CREATE LISTING
router.post(
  "/",
  auth,
  upload.array("images", 12),
  listingController.createListing,
);

// GET ALL LISTINGS
router.get("/", listingController.getAllListings);
// GET MY LISTINGS (PROFILE)
router.get("/user/me", auth, listingController.getMyListings);
// NEW – GET LISTINGS BY SELLER ID
router.get("/user/:id", listingController.getUserListingsById);

// NEW ROUTE — GET SELLER LISTINGS (PUBLIC, FOR SELLER PROFILE PAGE)
// ONLY NEW CODE ADDED — OLD CODE NOT TOUCHED
router.get("/user/:id", async (req, res) => {
  try {
    const db = require("../config/db");
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM listings WHERE seller_id = ? ORDER BY created_at DESC",
      [id],
    );

    res.json(rows);
  } catch (err) {
    console.error("GET SELLER LISTINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch seller listings" });
  }
});

// UPDATE LISTING (EDIT)  MUST COME BEFORE :id GET
router.put("/:id", auth, listingController.updateListing);

// DELETE LISTING
router.delete("/:id", auth, listingController.deleteListing);

// GET SINGLE LISTING (LAST ALWAYS)
router.get("/:id", listingController.getSingleListing);

module.exports = router;
