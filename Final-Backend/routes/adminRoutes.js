// routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

/* ===================== DASHBOARD ===================== */

// CARDS DATA
router.get("/dashboard", auth, admin, adminController.getDashboardStats);

// BAR CHART (USERS vs LISTINGS)
router.get(
  "/chart/users-listings",
  auth,
  admin,
  adminController.getUsersListingsChart,
);

// LINE CHART (VISITS)
router.get("/chart/visits", auth, admin, adminController.getVisitsChart);

// PIE CHART (CATEGORY WISE)
router.get("/chart/categories", auth, admin, adminController.getCategoryChart);

/* ===================== CALENDAR (EVENTS) ===================== */

// GET ALL EVENTS
router.get("/events", auth, admin, adminController.getAllEvents);

// GET EVENTS BY DATE
router.get("/events/by-date", auth, admin, adminController.getEventsByDate);

/* ===================== MANAGE USERS ===================== */

// GET ALL USERS (PAGINATION + SEARCH)
router.get("/users", auth, admin, adminController.getAllUsers);

// UPDATE USER (ROLE ETC.)
router.put("/users/:id", auth, admin, adminController.updateUser);

// DELETE USER
router.delete("/users/:id", auth, admin, adminController.deleteUser);

/* ===================== LISTINGS MANAGEMENT ===================== */

// GET ALL LISTINGS
router.get("/listings", auth, admin, adminController.getAllListings);

// UPDATE LISTING STATUS
router.put(
  "/listings/:id/status",
  auth,
  admin,
  adminController.updateListingStatus,
);

// DELETE LISTING
router.delete("/listings/:id", auth, admin, adminController.deleteListing);

module.exports = router;
