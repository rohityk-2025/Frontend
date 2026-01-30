// routes/favouriteRoutes.js

const express = require("express");
const router = express.Router();
const favouriteController = require("../controllers/favouriteController");
const auth = require("../middleware/authMiddleware");

// ADD TO FAVOURITES (HEART CLICK)
router.post("/", auth, favouriteController.addFavourite);

// REMOVE FROM FAVOURITES
router.delete("/:listingId", auth, favouriteController.removeFavourite);

// GET MY FAVOURITES (FAVOURITES PAGE)
router.get("/", auth, favouriteController.getMyFavourites);

module.exports = router;
