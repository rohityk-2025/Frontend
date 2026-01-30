// controllers/notificationController.js

const db = require("../config/db");

/* ===================== CREATE NOTIFICATION ===================== */
exports.createNotification = async (
  userId,
  type,
  title,
  message,
  listingId = null,
  relatedUserId = null,
) => {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, type, title, message, listing_id, related_user_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, type, title, message, listingId, relatedUserId],
    );
  } catch (err) {
    console.error("CREATE NOTIFICATION ERROR:", err);
  }
};

/* ===================== GET USER NOTIFICATIONS ===================== */
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT n.*, 
              l.title AS listing_title,
              u.first_name AS related_user_name
       FROM notifications n
       LEFT JOIN listings l ON n.listing_id = l.id
       LEFT JOIN users u ON n.related_user_id = u.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC`,
      [userId],
    );

    res.json({ notifications: rows });
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ===================== GET UNREAD COUNT ===================== */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[count]] = await db.query(
      `SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = FALSE`,
      [userId],
    );

    res.json({ unreadCount: count.unread });
  } catch (err) {
    console.error("GET UNREAD COUNT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

/* ===================== MARK AS READ ===================== */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify notification belongs to user
    const [[notification]] = await db.query(
      "SELECT * FROM notifications WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (!notification) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await db.query("UPDATE notifications SET is_read = TRUE WHERE id = ?", [
      id,
    ]);

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("MARK AS READ ERROR:", err);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

/* ===================== MARK ALL AS READ ===================== */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
      [userId],
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("MARK ALL AS READ ERROR:", err);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

/* ===================== DELETE NOTIFICATION ===================== */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify notification belongs to user
    const [[notification]] = await db.query(
      "SELECT * FROM notifications WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (!notification) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await db.query("DELETE FROM notifications WHERE id = ?", [id]);

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("DELETE NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
