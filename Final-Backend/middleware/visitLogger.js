const db = require("../config/db");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      null;

    let userId = null;

    /* READ TOKEN SAFELY FROM HEADER */

    // Axios usually sends token like:
    // Authorization: Bearer <token>
    // OR sometimes: x-auth-token: <token>

    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers["x-auth-token"]) {
      token = req.headers["x-auth-token"];
    }

    /* DECODE TOKEN SAFELY */

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // TRY ALL COMMON POSSIBILITIES
        userId =
          decoded.id ||
          decoded.userId ||
          (decoded.user && decoded.user.id) ||
          null;
      } catch (err) {
        console.log("TOKEN INVALID – VISIT SAVED AS GUEST");
        userId = null;
      }
    }

    /* INSERT VISIT */

    await db.query("INSERT INTO visits (user_id, ip_address) VALUES (?, ?)", [
      userId,
      ip,
    ]);

    console.log("VISIT LOGGED:", { userId, ip });
  } catch (err) {
    console.error("VISIT LOGGER ERROR:", err);
  }

  next();
};
