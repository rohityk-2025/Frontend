// middleware/adminMiddleware.js

module.exports = (req, res, next) => {
  try {
    // authMiddleware MUST run before this
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // CHECK ROLE
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // USER IS ADMIN
    next();
  } catch (err) {
    console.error("ADMIN MIDDLEWARE ERROR:", err);
    return res.status(500).json({ message: "Admin middleware failed" });
  }
};
