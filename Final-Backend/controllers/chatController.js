const db = require("../config/db");

/* -------------------- START CHAT -------------------- */
exports.startChat = async (req, res) => {
  try {
    const { listingId, sellerId } = req.body;
    const buyerId = req.user.id;

    if (!listingId || !sellerId || !buyerId) {
      return res.status(400).json({ message: "Missing data" });
    }

    if (buyerId === sellerId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // CHECK BOTH DIRECTIONS
    const [existing] = await db.query(
      `SELECT * FROM chats 
       WHERE listing_id = ? 
       AND (
         (buyer_id = ? AND seller_id = ?) 
         OR 
         (buyer_id = ? AND seller_id = ?)
       )`,
      [listingId, buyerId, sellerId, sellerId, buyerId],
    );

    if (existing.length > 0) {
      return res.json({ chatId: existing[0].id });
    }

    // CREATE NEW CHAT
    const [result] = await db.query(
      `INSERT INTO chats (listing_id, buyer_id, seller_id)
       VALUES (?, ?, ?)`,
      [listingId, buyerId, sellerId],
    );

    res.json({ chatId: result.insertId });
  } catch (err) {
    console.error("START CHAT ERROR:", err);
    res.status(500).json({ message: "Failed to start chat" });
  }
};

/* -------------------- GET MY CHATS -------------------- */
exports.getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.listing_id,
        c.buyer_id,
        c.seller_id,
        l.title,

        CASE 
          WHEN c.buyer_id = ? THEN s.id
          ELSE b.id
        END AS other_id,

        CASE 
          WHEN c.buyer_id = ? THEN CONCAT(s.first_name, ' ', s.last_name)
          ELSE CONCAT(b.first_name, ' ', b.last_name)
        END AS other_name,

        CASE 
          WHEN c.buyer_id = ? THEN s.avatar
          ELSE b.avatar
        END AS other_avatar

      FROM chats c
      JOIN listings l ON c.listing_id = l.id
      JOIN users b ON b.id = c.buyer_id
      JOIN users s ON s.id = c.seller_id

      WHERE c.buyer_id = ? OR c.seller_id = ?
      ORDER BY c.id DESC   
      `,
      [userId, userId, userId, userId, userId],
    );

    res.json(rows);
  } catch (err) {
    console.error("GET CHATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

/* -------------------- GET MESSAGES -------------------- */
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const [rows] = await db.query(
      `SELECT 
        m.id,
        m.chat_id,
        m.sender_id,
        m.message,
        m.created_at
       FROM messages m
       WHERE m.chat_id = ?
       ORDER BY m.id ASC   -- FIX: DO NOT USE created_at
      `,
      [chatId],
    );

    res.json(rows);
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* -------------------- SEND MESSAGE -------------------- */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    if (!chatId || !message || !senderId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const [result] = await db.query(
      `INSERT INTO messages (chat_id, sender_id, message)
       VALUES (?, ?, ?)`,
      [chatId, senderId, message],
    );

    // RETURN SAVED MESSAGE
    const [rows] = await db.query(
      `SELECT 
        m.id,
        m.chat_id,
        m.sender_id,
        m.message,
        m.created_at
       FROM messages m
       WHERE m.id = ?`,
      [result.insertId],
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* -------------------- DELETE CHAT -------------------- */
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT * FROM chats 
       WHERE id = ? AND (buyer_id = ? OR seller_id = ?)`,
      [chatId, userId, userId],
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await db.query(`DELETE FROM messages WHERE chat_id = ?`, [chatId]);
    await db.query(`DELETE FROM chats WHERE id = ?`, [chatId]);

    res.json({ message: "Chat deleted" });
  } catch (err) {
    console.error("DELETE CHAT ERROR:", err);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
