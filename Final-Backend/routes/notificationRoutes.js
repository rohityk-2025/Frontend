// routes/notificationRoutes.js

const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

/* ===================== NOTIFICATIONS ===================== */

// GET USER NOTIFICATIONS
router.get("/", auth, notificationController.getUserNotifications);

// GET UNREAD COUNT
router.get("/unread/count", auth, notificationController.getUnreadCount);

// MARK AS READ
router.put("/:id/read", auth, notificationController.markAsRead);

// MARK ALL AS READ
router.put("/", auth, notificationController.markAllAsRead);

// DELETE NOTIFICATION
router.delete("/:id", auth, notificationController.deleteNotification);

module.exports = router;
