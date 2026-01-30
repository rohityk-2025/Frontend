// const db = require("../config/db");

// /* ===================== DASHBOARD STATS ===================== */

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const [[usersCount]] = await db.query(
//       "SELECT COUNT(*) AS totalUsers FROM users",
//     );

//     const [[listingsCount]] = await db.query(
//       "SELECT COUNT(*) AS totalListings FROM listings",
//     );

//     const [[visitsToday]] = await db.query(
//       "SELECT COUNT(*) AS totalVisitsToday FROM visits WHERE DATE(created_at) = CURDATE()",
//     );

//     const [[todayListings]] = await db.query(
//       "SELECT COUNT(*) AS todayListings FROM listings WHERE DATE(created_at) = CURDATE()",
//     );

//     res.json({
//       totalUsers: usersCount.totalUsers,
//       totalListings: listingsCount.totalListings,
//       totalVisitsToday: visitsToday.totalVisitsToday,
//       todayListings: todayListings.todayListings,
//     });
//   } catch (err) {
//     console.error("ADMIN DASHBOARD ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch dashboard stats" });
//   }
// };

// /* ===================== CHART APIS ===================== */

// exports.getUsersListingsChart = async (req, res) => {
//   try {
//     const [users] = await db.query(`
//       SELECT DATE(created_at) as date, COUNT(*) as users
//       FROM users
//       GROUP BY DATE(created_at)
//       ORDER BY DATE(created_at)
//     `);

//     const [listings] = await db.query(`
//       SELECT DATE(created_at) as date, COUNT(*) as listings
//       FROM listings
//       GROUP BY DATE(created_at)
//       ORDER BY DATE(created_at)
//     `);

//     res.json({ users, listings });
//   } catch (err) {
//     console.error("ADMIN BAR CHART ERROR:", err);
//     res.status(500).json({ message: "Failed to load bar chart data" });
//   }
// };

// exports.getVisitsChart = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT DATE(created_at) as date, COUNT(*) as visits
//       FROM visits
//       GROUP BY DATE(created_at)
//       ORDER BY DATE(created_at)
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error("ADMIN VISITS CHART ERROR:", err);
//     res.status(500).json({ message: "Failed to load visits chart" });
//   }
// };

// exports.getCategoryChart = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT category, COUNT(*) as total
//       FROM listings
//       GROUP BY category
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error("ADMIN CATEGORY CHART ERROR:", err);
//     res.status(500).json({ message: "Failed to load category chart" });
//   }
// };

// /* ===================== CALENDAR (EVENTS) ===================== */

// /* GET ALL EVENTS */
// exports.getAllEvents = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM admin_events ORDER BY event_date ASC",
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error("ADMIN GET EVENTS ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch events" });
//   }
// };

// /* GET EVENTS BY DATE */
// exports.getEventsByDate = async (req, res) => {
//   try {
//     const { date } = req.query;

//     const [rows] = await db.query(
//       "SELECT * FROM admin_events WHERE event_date = ? ORDER BY created_at",
//       [date],
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error("ADMIN GET EVENTS BY DATE ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch events" });
//   }
// };

// /* ADD NEW EVENT (IMPORTANT) */
// exports.addEvent = async (req, res) => {
//   try {
//     const { title, event_date, description } = req.body;

//     if (!title || !event_date) {
//       return res.status(400).json({ message: "Title and date are required" });
//     }

//     const [result] = await db.query(
//       `INSERT INTO admin_events (title, event_date, description)
//        VALUES (?, ?, ?)`,
//       [title, event_date, description || null],
//     );

//     const [[newEvent]] = await db.query(
//       "SELECT * FROM admin_events WHERE id = ?",
//       [result.insertId],
//     );

//     res.json(newEvent);
//   } catch (err) {
//     console.error("ADMIN ADD EVENT ERROR:", err);
//     res.status(500).json({ message: "Failed to add event" });
//   }
// };

// /* DELETE EVENT */
// exports.deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await db.query("DELETE FROM admin_events WHERE id = ?", [id]);

//     res.json({ message: "Event deleted successfully" });
//   } catch (err) {
//     console.error("ADMIN DELETE EVENT ERROR:", err);
//     res.status(500).json({ message: "Failed to delete event" });
//   }
// };

// /* ===================== MANAGE USERS ===================== */

// exports.getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const search = req.query.search || "";
//     const offset = (page - 1) * limit;

//     const [rows] = await db.query(
//       `
//       SELECT
//         u.id,
//         u.first_name,
//         u.last_name,
//         u.email,
//         u.avatar,
//         u.role,
//         COUNT(l.id) AS totalListings
//       FROM users u
//       LEFT JOIN listings l ON u.id = l.user_id
//       WHERE
//         u.id LIKE ? OR
//         u.first_name LIKE ? OR
//         u.last_name LIKE ? OR
//         u.email LIKE ?
//       GROUP BY u.id
//       ORDER BY u.created_at DESC
//       LIMIT ? OFFSET ?
//       `,
//       [
//         `%${search}%`,
//         `%${search}%`,
//         `%${search}%`,
//         `%${search}%`,
//         limit,
//         offset,
//       ],
//     );

//     const [[count]] = await db.query(
//       `
//       SELECT COUNT(*) as total FROM users
//       WHERE
//         id LIKE ? OR
//         first_name LIKE ? OR
//         last_name LIKE ? OR
//         email LIKE ?
//       `,
//       [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
//     );

//     res.json({
//       users: rows,
//       total: count.total,
//       page,
//       totalPages: Math.ceil(count.total / limit),
//     });
//   } catch (err) {
//     console.error("❌ ADMIN GET USERS ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (Number(id) === req.user.id) {
//       return res.status(400).json({ message: "You cannot delete yourself" });
//     }

//     await db.query("DELETE FROM users WHERE id = ?", [id]);

//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("❌ ADMIN DELETE USER ERROR:", err);
//     res.status(500).json({ message: "Failed to delete user" });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.body;

//     await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

//     res.json({ message: "User updated successfully" });
//   } catch (err) {
//     console.error("❌ ADMIN UPDATE USER ERROR:", err);
//     res.status(500).json({ message: "Failed to update user" });
//   }
// };

// /* ===================== LISTINGS MANAGEMENT ===================== */

// exports.getAllListings = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `
//       SELECT l.*,
//              CONCAT(u.first_name, ' ', u.last_name) AS seller_name,
//              u.email AS seller_email
//       FROM listings l
//       JOIN users u ON l.user_id = u.id
//       ORDER BY l.created_at DESC
//       `,
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error("❌ ADMIN GET LISTINGS ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch listings" });
//   }
// };

// exports.deleteListing = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await db.query("DELETE FROM listings WHERE id = ?", [id]);

//     res.json({ message: "Listing deleted successfully" });
//   } catch (err) {
//     console.error("❌ ADMIN DELETE LISTING ERROR:", err);
//     res.status(500).json({ message: "Failed to delete listing" });
//   }
// };

const db = require("../config/db");

/* ===================== DASHBOARD STATS ===================== */

exports.getDashboardStats = async (req, res) => {
  try {
    const [[usersCount]] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users",
    );

    const [[listingsCount]] = await db.query(
      "SELECT COUNT(*) AS totalListings FROM listings",
    );

    const [[visitsToday]] = await db.query(
      "SELECT COUNT(*) AS totalVisitsToday FROM visits WHERE DATE(created_at) = CURDATE()",
    );

    const [[todayListings]] = await db.query(
      "SELECT COUNT(*) AS todayListings FROM listings WHERE DATE(created_at) = CURDATE()",
    );

    res.json({
      totalUsers: usersCount.totalUsers,
      totalListings: listingsCount.totalListings,
      totalVisitsToday: visitsToday.totalVisitsToday,
      todayListings: todayListings.todayListings,
    });
  } catch (err) {
    console.error("❌ ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

/* ===================== CHART APIS ===================== */

exports.getUsersListingsChart = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as users
      FROM users
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    const [listings] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as listings
      FROM listings
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json({ users, listings });
  } catch (err) {
    console.error("❌ ADMIN BAR CHART ERROR:", err);
    res.status(500).json({ message: "Failed to load bar chart data" });
  }
};

exports.getVisitsChart = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as visits
      FROM visits
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ ADMIN VISITS CHART ERROR:", err);
    res.status(500).json({ message: "Failed to load visits chart" });
  }
};

exports.getCategoryChart = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT category, COUNT(*) as total
      FROM listings
      GROUP BY category
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ ADMIN CATEGORY CHART ERROR:", err);
    res.status(500).json({ message: "Failed to load category chart" });
  }
};

/* ===================== CALENDAR (EVENTS) ===================== */

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_events ORDER BY event_date ASC",
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ ADMIN GET EVENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.getEventsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const [rows] = await db.query(
      "SELECT * FROM admin_events WHERE event_date = ? ORDER BY created_at",
      [date],
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ ADMIN GET EVENTS BY DATE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const { title, event_date, description } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const [result] = await db.query(
      `INSERT INTO admin_events (title, event_date, description)
       VALUES (?, ?, ?)`,
      [title, event_date, description || null],
    );

    const [[newEvent]] = await db.query(
      "SELECT * FROM admin_events WHERE id = ?",
      [result.insertId],
    );

    res.json(newEvent);
  } catch (err) {
    console.error("❌ ADMIN ADD EVENT ERROR:", err);
    res.status(500).json({ message: "Failed to add event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM admin_events WHERE id = ?", [id]);

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ ADMIN DELETE EVENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

/* ===================== MANAGE USERS (FRONTEND SEARCH VERSION) ===================== */
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar,
        u.role,
        COUNT(l.id) AS totalListings
      FROM users u
      LEFT JOIN listings l ON u.id = l.seller_id   
      GROUP BY 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar,
        u.role
      ORDER BY u.id DESC
    `);

    res.json({
      users: rows,
      total: rows.length,
      page: 1,
      totalPages: 1,
    });
  } catch (err) {
    console.error("❌ ADMIN GET USERS SQL ERROR FULL:", err);
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ ADMIN DELETE USER ERROR:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password, role } = req.body;

    console.log("Update request received for user:", id);
    console.log("Data received:", {
      first_name,
      last_name,
      email,
      role,
      passwordProvided: !!password,
    });

    // Validate required fields
    if (!first_name || !email) {
      return res
        .status(400)
        .json({ message: "First name and email are required" });
    }

    // Build update query dynamically
    let updateFields = ["first_name = ?", "last_name = ?", "email = ?"];
    let values = [first_name, last_name, email];

    // Add password if provided and not empty
    if (password && password.trim().length > 0) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      updateFields.push("password = ?");
      values.push(hashedPassword);
      console.log("Password will be updated");
    }

    // Add role if provided
    if (role) {
      updateFields.push("role = ?");
      values.push(role);
      console.log("Role will be updated to:", role);
    }

    values.push(id);

    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
    console.log("Query being executed:", query);
    console.log("Values being used:", values);

    const result = await db.query(query, values);
    console.log("Update result:", result);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("❌ ADMIN UPDATE USER ERROR:", err);
    console.error("Error message:", err.message);
    console.error("Error details:", err);
    res.status(500).json({ message: "Failed to update user: " + err.message });
  }
};

/* ===================== LISTINGS MANAGEMENT ===================== */

exports.getAllListings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT l.*, 
             CONCAT(u.first_name, ' ', u.last_name) AS seller_name,
             u.email AS seller_email,
             (SELECT image_path FROM listing_images WHERE listing_id = l.id LIMIT 1) AS image
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      ORDER BY l.created_at DESC
      `,
    );

    res.json({ listings: rows });
  } catch (err) {
    console.error("❌ ADMIN GET LISTINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete images first
    await db.query("DELETE FROM listing_images WHERE listing_id = ?", [id]);

    // Delete listing
    await db.query("DELETE FROM listings WHERE id = ?", [id]);

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("❌ ADMIN DELETE LISTING ERROR:", err);
    res.status(500).json({ message: "Failed to delete listing" });
  }
};

/* ===================== UPDATE LISTING STATUS ===================== */

exports.updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Get listing details to find seller
    const [[listing]] = await db.query(
      "SELECT id, title, seller_id FROM listings WHERE id = ?",
      [id],
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Update listing status
    await db.query("UPDATE listings SET status = ? WHERE id = ?", [status, id]);

    // Create notification for seller
    const notificationController = require("./notificationController");
    let notificationType = "product_" + status;
    let notificationTitle = "";
    let notificationMessage = "";

    if (status === "approved") {
      notificationTitle = "Product Approved";
      notificationMessage = `Your product "${listing.title}" has been approved and is now visible to buyers.`;
    } else if (status === "rejected") {
      notificationTitle = "Product Rejected";
      notificationMessage = `Your product "${listing.title}" has been rejected. Please review and resubmit.`;
    }

    if (notificationTitle) {
      await notificationController.createNotification(
        listing.seller_id,
        notificationType,
        notificationTitle,
        notificationMessage,
        listing.id,
      );
    }

    res.json({ message: `Listing ${status} successfully` });
  } catch (err) {
    console.error("❌ ADMIN UPDATE LISTING STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update listing status" });
  }
};
